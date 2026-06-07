import { PlacePostData } from "@/types/api";
import { Place } from "@/types/place";

export const preparePlaceData = (data: Place): PlacePostData => ({
  title: data.title,
  description: data.description,
  event_date: data.eventDate,
  author: data.author,
  location_type: data.locationType,
  activity_type: data.activityType,
  cover_type: data.coverType,
  comment: data.comment,
  address: data.address,
  coordinates: data.coordinates,
  link: data.link,
  rating: data.rating,
  images: data.images,
  is_visited: data.isVisited,
});
