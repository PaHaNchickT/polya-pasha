"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
} from "react";

interface YMapIframeProps {
  center: number[];
  zoom?: number;
  width?: number | string;
  height?: number | string;
}

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

const YMap = forwardRef<HTMLIFrameElement, YMapIframeProps>(
  ({ center, zoom = 16, width = "100%", height = "400px" }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    useImperativeHandle(ref, () => iframeRef.current as HTMLIFrameElement);

    const srcDoc = useMemo(() => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>body,html{margin:0;padding:0;width:100%;height:100%;}</style>
        </head>
        <body>
          <div id="map" style="width:100%;height:100%;"></div>
          <script src="https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU"></script>
          <script>
            var map, placemark;

            ymaps.ready(function () {
              map = new ymaps.Map('map', {
                center: [${center[0]}, ${center[1]}],
                zoom: ${zoom}
              });

              placemark = new ymaps.Placemark(
                [${center[0]}, ${center[1]}],
                {},
                { draggable: true }
              );
              map.geoObjects.add(placemark);

              // При перетаскивании метки просто отправляем координаты
              placemark.events.add('dragend', function () {
                var coords = placemark.geometry.getCoordinates();
                window.parent.postMessage({
                  type: 'updateCoords',
                  coords: coords
                }, '*');
              });

              // Приём команд от родителя
              window.addEventListener('message', function (event) {
                if (!event.data || !event.data.type) return;
                if (event.data.type === 'updateMap') {
                  var newCenter = event.data.center;
                  var newZoom = event.data.zoom;
                  if (newCenter) {
                    map.setCenter(newCenter);
                    placemark.geometry.setCoordinates(newCenter);
                  }
                  if (typeof newZoom === 'number') {
                    map.setZoom(newZoom);
                  }
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

    const style = {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      border: "none",
    };

    return <iframe ref={iframeRef} srcDoc={srcDoc} style={style} />;
  },
);

YMap.displayName = "YMap";
export default YMap;
