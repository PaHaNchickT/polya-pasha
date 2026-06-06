export interface Place {
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

type PlaceAuthorType = "Pasha" | "Polya";
type PlaceLocationType =
  | "walk"
  | "ride"
  | "travel_internal"
  | "travel_external";
type PlaceActivityType =
  | "food"
  | "rich_food"
  | "movie"
  | "music"
  | "action"
  | "animals"
  | "other";
type PlaceCoverType = "open" | "close" | "hybrid";

type ImageData = {
  uri: string;
  name: string;
  type: string;
};
