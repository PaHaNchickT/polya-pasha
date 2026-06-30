import { DefaultBooleanKeys } from "./common";
import {
  ImageData,
  PlaceActivityType,
  PlaceAuthorType,
  PlaceCoverType,
  PlaceLocationType,
  PlaceSortOrder,
  PlaceSortType,
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
