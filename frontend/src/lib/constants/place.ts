import {
  PlaceActivityType,
  PlaceCoverType,
  PlaceLocationType,
} from "@/types/place";
import { USERS_MAP } from "./users";

export const LOCATION_TYPE_MAP = {
  all: "Не знаю 🤷🏻‍♀️",
  home: "Дома",
  walk: "Пешком",
  ride: "На машине",
  travel_internal: "Путешествие (межгород)",
  travel_external: "Путешествие (за границу)",
};

export const LOCATION_TYPE_KEYS = Object.keys(LOCATION_TYPE_MAP).filter(
  (key) => key !== "all",
) as PlaceLocationType[];

export const ACTIVITY_TYPE_MAP = {
  all: "Все активности",
  food: "Покушать",
  rich_food: "Покушать дорого",
  movie: "Фильмы",
  music: "Музыка",
  action: "Активный отдых",
  animals: "Зверушки",
  nature: "Природа",
  walk: "Прогулка",
  other: "Другое",
};

export const ACTIVITY_TYPE_KEYS = Object.keys(ACTIVITY_TYPE_MAP).filter(
  (key) => key !== "all",
) as PlaceActivityType[];

export const COVER_TYPE_MAP = {
  all: "Не знаю 🤷🏻‍♀️",
  open: "Улица",
  close: "Помещение",
  hybrid: "Гибрид",
};

export const COVER_TYPE_KEYS = Object.keys(COVER_TYPE_MAP).filter(
  (key) => key !== "all",
) as PlaceCoverType[];

export const USERS_TYPE_MAP = {
  ...USERS_MAP,
  all: "Все авторы",
};

export const IS_VISITED_TYPE_MAP = {
  all: "Не знаю 🤷🏻‍♀️",
  true: "Были",
  false: "Не были",
};

export const IS_VISITED_TYPE_KEYS = Object.keys(IS_VISITED_TYPE_MAP).filter(
  (key) => key !== "all",
) as ("true" | "false")[];
