import { GetPlacesParams } from "@/types/api";

export const placesSearchParamsBuilder = (params: GetPlacesParams) => {
  const newSearchParams = new URLSearchParams();

  if (params.page && params.page > 1)
    newSearchParams.set("page", String(params.page));

  if (params.limit && params.limit !== 12)
    newSearchParams.set("limit", String(params.limit));

  if (params.sort && params.sort !== "created_at")
    newSearchParams.set("sort", params.sort);

  if (params.order && params.order !== "desc")
    newSearchParams.set("order", params.order);

  if (params.search) newSearchParams.set("search", params.search);

  if (params.location_type && params.location_type !== "all")
    newSearchParams.set("location_type", params.location_type);

  if (params.activity_type && params.activity_type !== "all")
    newSearchParams.set("activity_type", params.activity_type);

  if (params.cover_type && params.cover_type !== "all")
    newSearchParams.set("cover_type", params.cover_type);

  if (params.author && params.author !== "all")
    newSearchParams.set("author", params.author);

  if (params.event_date && params.event_date !== "all")
    newSearchParams.set("event_date", String(params.event_date));

  if (params.is_visited && params.is_visited !== "all")
    newSearchParams.set("is_visited", String(params.is_visited));

  if (params.is_expired && params.is_expired !== "all")
    newSearchParams.set("is_expired", String(params.is_expired));

  return newSearchParams;
};
