export const LOCAL_STORAGE_TOKEN_KEY = "polya-pasha-token";
export const LOCAL_STORAGE_USERNAME_KEY = "polya-pasha-username";

export const HEADER_TABS: (keyof typeof HEADER_TABS_MAP)[] = [
  "places",
  "reviews",
  "randomizer",
  "map",
];
export const HEADER_TABS_MAP = {
  places: "Места",
  reviews: "Отзывы",
  randomizer: "Рандомайзер",
  map: "Карта",
};

export const BREADCRUMBS_MAP = {
  ...HEADER_TABS_MAP,
  create: "Создание",
  edit: "Редактирование",
};
