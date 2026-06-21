import {
  PlaceActivityType,
  PlaceAuthorType,
  PlaceCoverType,
  PlaceLocationType,
  PlaceSortType,
} from "@/types/place";
import { USERS_MAP } from "./users";
import { DefaultBooleanKeys } from "@/types/common";

export const LOCATION_TYPE_MAP: Record<PlaceLocationType | "all", string> = {
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

export const ACTIVITY_TYPE_MAP: Record<PlaceActivityType | "all", string> = {
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

export const COVER_TYPE_MAP: Record<PlaceCoverType | "all", string> = {
  all: "Не знаю 🤷🏻‍♀️",
  open: "Улица",
  close: "Помещение",
  hybrid: "Гибрид",
};

export const COVER_TYPE_KEYS = Object.keys(COVER_TYPE_MAP).filter(
  (key) => key !== "all",
) as PlaceCoverType[];

export const USERS_TYPE_MAP: Record<PlaceAuthorType | "all", string> = {
  ...USERS_MAP,
  all: "Все авторы",
};

export const IS_VISITED_MAP: Record<DefaultBooleanKeys | "all", string> = {
  all: "Не знаю 🤷🏻‍♀️",
  true: "Были",
  false: "Не были",
};

export const IS_VISITED_KEYS = Object.keys(IS_VISITED_MAP).filter(
  (key) => key !== "all",
) as DefaultBooleanKeys[];

export const IS_EVENT_DATE_MAP: Record<DefaultBooleanKeys | "all", string> = {
  all: "Не знаю 🤷🏻‍♀️",
  true: "Ограничено",
  false: "Без ограничений",
};

export const IS_EVENT_DATE_KEYS = Object.keys(IS_EVENT_DATE_MAP).filter(
  (key) => key !== "all",
) as DefaultBooleanKeys[];

export const IS_EXPIRED_MAP: Record<DefaultBooleanKeys | "all", string> = {
  all: "Не знаю 🤷🏻‍♀️",
  true: "Прошло",
  false: "Не прошло",
};

export const IS_EXPIRED_KEYS = Object.keys(IS_EXPIRED_MAP).filter(
  (key) => key !== "all",
) as DefaultBooleanKeys[];

export const SORTING_TYPE_MAP: Record<PlaceSortType, string> = {
  title: "По названию места",
  created_at: "По дате создания",
};

export const SORTING_TYPE_KEYS = Object.keys(
  SORTING_TYPE_MAP,
) as PlaceSortType[];
