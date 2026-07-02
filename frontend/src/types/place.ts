import { DefaultBooleanKeys, DefaultSortingOrder, UserTypes } from "./common";

export interface Place {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  eventDate: string | null;
  author: PlaceAuthorType;
  locationType: PlaceLocationType;
  activityType: PlaceActivityType[];
  coverType: PlaceCoverType;
  comment: string | null;
  address: string;
  coordinates: number[];
  link: string | null;
  rating: number;
  images: ImageData[];
  isNew: boolean;
  isVisited: boolean;
  isExpired: boolean | null;
}

export type PlaceLocationType =
  | "home"
  | "walk"
  | "ride"
  | "travel_internal"
  | "travel_external";
export type PlaceActivityType =
  | "food"
  | "rich_food"
  | "movie"
  | "music"
  | "action"
  | "animals"
  | "nature"
  | "walk"
  | "other";
export type PlaceCoverType = "open" | "close" | "hybrid";
export type PlaceAuthorType = UserTypes;

export type ImageData = {
  id: number;
  uri: string;
  name: string;
  type: string;
};

export interface PlacesFilterParams {
  locationType: PlaceLocationType | "all";
  coverType: PlaceCoverType | "all";
  author: UserTypes | "all";
  eventDate: DefaultBooleanKeys | "all";
  isVisited: DefaultBooleanKeys | "all";
  isExpired: DefaultBooleanKeys | "all";
}

export type PlaceSortType = "title" | "created_at";
export type PlaceSortOrder = DefaultSortingOrder;

export interface PlacesSortParams {
  sort: PlaceSortType;
  order: PlaceSortOrder;
}

export interface GetPlacesParams {
  page?: number;
  limit?: number;
  sort?: PlaceSortType;
  order?: PlaceSortOrder;
  search?: string;
  activity_type?: string;
  location_type?: string;
  cover_type?: string;
  author?: string;
  event_date?: DefaultBooleanKeys | "all";
  is_visited?: DefaultBooleanKeys | "all";
  is_expired?: DefaultBooleanKeys | "all";
}
