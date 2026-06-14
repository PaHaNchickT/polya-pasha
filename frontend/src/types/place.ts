import { UserTypes } from "./common";

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

export type PlaceAuthorType = "admin" | "polinka";
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

export type ImageData = {
  uri: string;
  name: string;
  type: string;
};

export interface PlacesFilterParams {
  locationType: PlaceLocationType | "all";
  coverType: PlaceCoverType | "all";
  author: UserTypes | "all";
  isVisited: "all" | "true" | "false";
}
