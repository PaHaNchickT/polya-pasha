import { PlaceResponseData } from "@/types/api";
import { Place } from "@/types/place";

export const transformPlaceData = (data: PlaceResponseData): Place => ({
  id: data.id,
  title: data.title,
  description: data.description,
  createdAt: data.created_at,
  eventDate: data.event_date,
  author: data.author,
  locationType: data.location_type,
  activityType: data.activity_type,
  coverType: data.cover_type,
  comment: data.comment,
  address: data.address,
  coordinates: data.coordinates,
  link: data.link,
  rating: data.rating,
  images: data.images,
  isNew: data.is_new,
  isVisited: data.is_visited,
  isExpired: data.is_expired,
});
