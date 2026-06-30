import { DefaultSortingOrder, HeaderNavKeys } from "@/types/common";

export const LOCAL_STORAGE_TOKEN_KEY = "polya-pasha-token";
export const LOCAL_STORAGE_USERNAME_KEY = "polya-pasha-username";

export const HEADER_TABS_MAP: Record<HeaderNavKeys, string> = {
  places: "Места",
  map: "Карта",
  randomizer: "Рандомайзер",
};
export const HEADER_TABS_KEYS = Object.keys(HEADER_TABS_MAP) as HeaderNavKeys[];

export const BREADCRUMBS_MAP = {
  ...HEADER_TABS_MAP,
  create: "Создание",
  edit: "Редактирование",
};

export const SORTING_ORDER_MAP: Record<DefaultSortingOrder, string> = {
  asc: "По возрастанию",
  desc: "По убыванию",
};

export const SORTING_ORDER_KEYS = Object.keys(
  SORTING_ORDER_MAP,
) as DefaultSortingOrder[];
