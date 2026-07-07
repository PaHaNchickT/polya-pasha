import { MapItem } from "./map";
import {
  ImageData,
  PlaceActivityType,
  PlaceAuthorType,
  PlaceCoverType,
  PlaceLocationType,
} from "./place";

export type CustomError = {
  status: number | string;
  message: string;
};

interface UserMetaResponseData {
  login: string;
  role: string;
}

export interface LoginResponseData {
  token: string;
  user: UserMetaResponseData;
}

export interface VerifyTokenResponseData {
  valid: boolean;
  user: UserMetaResponseData;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  counters: Record<PlaceActivityType | "all", number>;
}

export interface PlacesListResponse {
  data: PlaceResponseData[];
  meta: PaginationMeta;
}

export interface PlaceResponseData {
  id: number;
  title: string;
  description: string;
  created_at: string;
  event_date: string | null;
  author: PlaceAuthorType;
  location_type: PlaceLocationType;
  activity_type: PlaceActivityType[];
  cover_type: PlaceCoverType;
  comment: string | null;
  address: string;
  coordinates: number[];
  link: string | null;
  rating: number;
  images: ImageData[];
  is_new: boolean;
  is_visited: boolean;
  is_expired: boolean | null;
}

export type PlacePostData = Omit<
  PlaceResponseData,
  "id" | "created_at" | "is_new" | "is_expired"
>;

export interface MapResponseData {
  data: MapItem[];
}

export interface ReviewResponseData {
  id: number;
  place_id: number;
  title: string;
  description: string;
  created_at: string;
  visited_at: string;
  author: PlaceAuthorType;
}

export interface ReviewPostData {
  place_id?: number;
  title: string;
  description: string;
  visited_at: string;
  author?: PlaceAuthorType;
}
