import { DefaultBooleanKeys } from "./common";

export interface MapItem {
  id: number;
  coordinates: number[];
}

export interface GetMapParams {
  search?: string;
  activity_type?: string;
  location_type?: string;
  cover_type?: string;
  author?: string;
  event_date?: DefaultBooleanKeys | "all";
  is_visited?: DefaultBooleanKeys | "all";
  is_expired?: DefaultBooleanKeys | "all";
}
