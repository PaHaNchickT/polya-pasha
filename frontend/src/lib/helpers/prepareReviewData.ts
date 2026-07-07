import { ReviewPostData } from "@/types/api";
import { Review } from "@/types/reviews";

export const prepareReviewData = (
  data: Omit<Review, "id" | "createdAt">,
): ReviewPostData => ({
  place_id: data.placeId,
  title: data.title,
  description: data.description,
  visited_at: data.visitedAt,
  author: data.author,
});
