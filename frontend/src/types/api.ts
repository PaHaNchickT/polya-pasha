import {
  ImageData,
  PlaceActivityType,
  PlaceAuthorType,
  PlaceCoverType,
  PlaceLocationType,
} from "./place";

export interface LoginResponse {
  token: string;
  user: {
    login: string;
    role: string;
  };
}

export interface PlaceResponse {
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
  address: string | null;
  coordinates: number[];
  link: string | null;
  rating: number;
  images: ImageData[];
  is_new: boolean;
  is_visited: boolean;
  is_expired: boolean | null;
}
