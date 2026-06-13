"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";

interface YMapIframeProps {
  center: number[];
  zoom?: number;
  width?: number | string;
  height?: number | string;
  readOnly?: boolean;
}

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

const YMap = forwardRef<HTMLIFrameElement, YMapIframeProps>(
  (
    { center, zoom = 16, width = "100%", height = "400px", readOnly = false },
    ref,
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    useImperativeHandle(ref, () => iframeRef.current as HTMLIFrameElement);

    const srcDoc = useMemo(() => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <div id="map" style="width:100%;height:100%;"></div>
          <script src="https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU"></script>
          <script>
            var map, placemark;

            ymaps.ready(function () {
              map = new ymaps.Map('map', {
                center: [${center[0]}, ${center[1]}],
                zoom: ${zoom},
                controls: []   // убираем все стандартные элементы управления
              });

              placemark = new ymaps.Placemark(
                [${center[0]}, ${center[1]}],
                {},
                { draggable: true }
              );
              map.geoObjects.add(placemark);

              window.parent.postMessage({ type: 'mapReady' }, '*');

              placemark.events.add('dragend', function () {
                var coords = placemark.geometry.getCoordinates();
                window.parent.postMessage({
                  type: 'updateCoords',
                  coords: coords
                }, '*');
              });

              window.addEventListener('message', function (event) {
                if (!event.data || !event.data.type) return;

                switch (event.data.type) {
                  case 'updateMap':
                    var newCenter = event.data.center;
                    var newZoom = event.data.zoom;
                    if (newCenter) {
                      map.setCenter(newCenter);
                      placemark.geometry.setCoordinates(newCenter);
                    }
                    if (typeof newZoom === 'number') {
                      map.setZoom(newZoom);
                    }
                    break;

                  case 'setOptions':
                    if (typeof event.data.draggable === 'boolean') {
                      placemark.options.set({ draggable: event.data.draggable });
                    }
                    break;
                }
              });
            });
          </script>
        </body>
        </html>
      `;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "updateMap", center, zoom },
          "*",
        );
      }
    }, [center, zoom]);

    const sendDraggable = useCallback((draggable: boolean) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "setOptions", draggable },
          "*",
        );
      }
    }, []);

    useEffect(() => {
      sendDraggable(!readOnly);
    }, [readOnly, sendDraggable]);

    useEffect(() => {
      const handler = (event: MessageEvent) => {
        if (
          event.source === iframeRef.current?.contentWindow &&
          event.data?.type === "mapReady"
        ) {
          sendDraggable(!readOnly);
        }
      };
      window.addEventListener("message", handler);
      return () => window.removeEventListener("message", handler);
    }, [readOnly, sendDraggable]);

    const style = {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      border: "none",
      borderRadius: "0.5rem",
    };

    return <iframe ref={iframeRef} srcDoc={srcDoc} style={style} />;
  },
);

YMap.displayName = "YMap";
export default YMap;
