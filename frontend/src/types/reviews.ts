import { PlaceAuthorType } from "./place";

export interface Review {
  id: number;
  placeId: number;
  title: string;
  description: string;
  createdAt: string;
  visitedAt: string;
  author: PlaceAuthorType;
}

export interface GetReviewsParams {
  place_id?: number;
}
