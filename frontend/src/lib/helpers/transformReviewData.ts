import { ReviewResponseData } from "@/types/api";
import { Review } from "@/types/reviews";

export const transformReviewData = (data: ReviewResponseData): Review => ({
  id: data.id,
  placeId: data.place_id,
  title: data.title,
  description: data.description,
  createdAt: data.created_at,
  visitedAt: data.visited_at,
  author: data.author,
});
