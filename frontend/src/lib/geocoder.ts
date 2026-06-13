const GEOCODER_BASE = "https://geocode-maps.yandex.ru/1.x";

async function yandexGeocode(query: string, apikey: string) {
  const params = new URLSearchParams({
    apikey,
    geocode: query,
    format: "json",
    results: "1",
  });
  const res = await fetch(`${GEOCODER_BASE}?${params}`);
  if (!res.ok) throw new Error(`Geocoder error: ${res.status}`);
  const data = await res.json();
  const geoObjects = data?.response?.GeoObjectCollection?.featureMember;
  if (!geoObjects || geoObjects.length === 0) return null;
  const geoObject = geoObjects[0].GeoObject;
  const coordsStr = geoObject.Point.pos; // "lon lat"
  const [lon, lat] = coordsStr.split(" ").map(Number);
  const address = geoObject.metaDataProperty?.GeocoderMetaData?.text || "";
  return { lat, lon, address };
}

export async function geocodeAddress(address: string, apikey: string) {
  return yandexGeocode(address, apikey);
}

export async function reverseGeocode(coords: [number, number], apikey: string) {
  // В геокодере координаты передаются как "долгота,широта"
  const query = `${coords[1]},${coords[0]}`;
  return yandexGeocode(query, apikey);
}
