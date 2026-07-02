"use client";

import { MapItem } from "@/types/map";
import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";

interface YMapMultiplyProps {
  items: MapItem[];
  selectedItemId: number | null;
  onSelectItem: (id: number) => void;
  width?: number | string;
  height?: number | string | null;
  initialZoom?: number;
  zoomOnSelect?: number;
  initialCenter?: [number, number];
}

export interface YMapMultiplyHandle {
  resetMap: () => void;
}

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

export const YMapMultiply = forwardRef<YMapMultiplyHandle, YMapMultiplyProps>(
  (
    {
      items,
      selectedItemId,
      onSelectItem,
      width = "100%",
      height,
      initialZoom = 10,
      zoomOnSelect = 16,
      initialCenter = [59.9343, 30.3351],
    },
    ref,
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Метод для сброса (вызывается родителем)
    useImperativeHandle(ref, () => ({
      resetMap() {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "resetMap" },
          "*",
        );
      },
    }));

    // HTML-документ для iframe с логикой Яндекс.Карт
    const srcDoc = useMemo(
      () => `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }
          </style>
        </head>
        <body>
          <div id="map" style="width:100%;height:100%;"></div>
          <script src="https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU"></script>
          <script>
            var map, placemarks = {};
            var selectedId = null;
            var defaultCenter = [${initialCenter[0]}, ${initialCenter[1]}];
            var defaultZoom = ${initialZoom};
            var zoomOnSelect = ${zoomOnSelect};

            ymaps.ready(function () {
              map = new ymaps.Map('map', {
                center: defaultCenter,
                zoom: defaultZoom,
                controls: []
              });

              // Создание метки
              function createPlacemark(point) {
                var pm = new ymaps.Placemark(
                  point.coordinates,
                  {},
                  {
                    preset: point.id === selectedId ? 'islands#redIcon' : 'islands#blueIcon',
                    draggable: false
                  }
                );
                pm.events.add('click', function () {
                  window.parent.postMessage({ type: 'selectPoint', id: point.id }, '*');
                });
                return pm;
              }

              // Удаление всех меток
              function clearPlacemarks() {
                Object.keys(placemarks).forEach(function(id) {
                  map.geoObjects.remove(placemarks[id]);
                });
                placemarks = {};
              }

              // Обновление всех меток
              function setPlacemarks(points) {
                clearPlacemarks();
                points.forEach(function(point) {
                  placemarks[point.id] = createPlacemark(point);
                  map.geoObjects.add(placemarks[point.id]);
                });
                // если была выбрана точка, перекрашиваем её
                if (selectedId !== null && placemarks[selectedId]) {
                  placemarks[selectedId].options.set({ preset: 'islands#redIcon' });
                }
              }

              // Подсветить выбранную метку и подвинуть карту
              function highlightSelected(id) {
                if (selectedId && placemarks[selectedId]) {
                  placemarks[selectedId].options.set({ preset: 'islands#blueIcon' });
                }
                selectedId = id;
                if (selectedId && placemarks[selectedId]) {
                  placemarks[selectedId].options.set({ preset: 'islands#redIcon' });
                  var coords = placemarks[selectedId].geometry.getCoordinates();
                  map.setCenter(coords, zoomOnSelect, { duration: 300 });
                }
              }

              // Сброс карты к начальному состоянию
              function resetMap() {
                map.setCenter(defaultCenter, defaultZoom, { duration: 300 });
              }

              window.parent.postMessage({ type: 'mapReady' }, '*');

              window.addEventListener('message', function(event) {
                if (!event.data || !event.data.type) return;
                switch(event.data.type) {
                  case 'setPoints':
                    setPlacemarks(event.data.points);
                    break;
                  case 'setSelected':
                    highlightSelected(event.data.id);
                    break;
                  case 'resetMap':
                    resetMap();
                    break;
                }
              });
            });
          </script>
        </body>
        </html>`,
      [initialCenter, initialZoom, zoomOnSelect],
    );

    // Отправка точек в iframe
    const sendPoints = useCallback(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "setPoints", points: items },
          "*",
        );
      }
    }, [items]);

    // Отправка выбранного id в iframe
    const sendSelected = useCallback((id: number | null) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "setSelected", id },
          "*",
        );
      }
    }, []);

    // Обработчик сообщений от iframe
    useEffect(() => {
      const handler = (event: MessageEvent) => {
        if (event.source !== iframeRef.current?.contentWindow) return;

        if (event.data?.type === "mapReady") {
          // Карта загрузилась – шлём текущие данные
          sendPoints();
          sendSelected(selectedItemId);
        } else if (event.data?.type === "selectPoint") {
          // Кликнули по точке в iframe
          const id = event.data.id;
          if (typeof id === "number") {
            onSelectItem(id);
          }
        }
      };
      window.addEventListener("message", handler);
      return () => window.removeEventListener("message", handler);
    }, [sendPoints, sendSelected, selectedItemId, onSelectItem]);

    // Синхронизация items → iframe
    useEffect(() => {
      sendPoints();
    }, [sendPoints]);

    // Синхронизация selectedItemId → iframe
    useEffect(() => {
      sendSelected(selectedItemId);
    }, [sendSelected, selectedItemId]);

    const style = {
      width: typeof width === "number" ? `${width}px` : width,
      ...(height && {
        height: typeof height === "number" ? `${height}px` : height,
      }),
      border: "none",
      borderRadius: "0.5rem",
    };

    return <iframe ref={iframeRef} srcDoc={srcDoc} style={style} />;
  },
);

YMapMultiply.displayName = "YMapMultiply";
