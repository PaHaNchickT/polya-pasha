import { PlaceResponse } from "@/types/api";
import { Place } from "@/types/place";

export const preparePlaceData = (data: PlaceResponse): Place => ({
  ...data,
  createdAt: data.created_at,
  eventDate: data.event_date,
  locationType: data.location_type,
  activityType: data.activity_type,
  coverType: data.cover_type,
  isNew: data.is_new,
  isVisited: data.is_visited,
  isExpired: data.is_expired,
});
