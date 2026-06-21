import { GetPlacesParams, PaginationMeta } from "@/types/api";
import {
  ACTIVITY_TYPE_KEYS,
  COVER_TYPE_KEYS,
  LOCATION_TYPE_KEYS,
  SORTING_TYPE_KEYS,
} from "../constants/place";
import { SORTING_ORDER_KEYS } from "../constants/common";
import {
  PlaceActivityType,
  PlaceCoverType,
  PlaceLocationType,
} from "@/types/place";
import { USERS_KEYS } from "../constants/users";
import { UserTypes } from "@/types/common";

export const placesSearchParamsBuilder = (
  params: GetPlacesParams,
  meta: PaginationMeta,
) => {
  const newSearchParams = new URLSearchParams();

  if (
    params.page &&
    typeof params.page === "number" &&
    params.page > 1 &&
    params.page <= meta.totalPages
  )
    newSearchParams.set("page", String(params.page));

  if (params.limit && params.limit !== 12)
    newSearchParams.set("limit", String(params.limit));

  if (
    params.sort &&
    SORTING_TYPE_KEYS.includes(params.sort) &&
    params.sort !== "created_at"
  )
    newSearchParams.set("sort", params.sort);

  if (
    params.order &&
    SORTING_ORDER_KEYS.includes(params.order) &&
    params.order !== "desc"
  )
    newSearchParams.set("order", params.order);

  if (params.search) newSearchParams.set("search", params.search);

  if (
    params.location_type &&
    LOCATION_TYPE_KEYS.includes(params.location_type as PlaceLocationType) &&
    params.location_type !== "all"
  )
    newSearchParams.set("location_type", params.location_type);

  if (
    params.activity_type &&
    ACTIVITY_TYPE_KEYS.includes(params.activity_type as PlaceActivityType) &&
    params.activity_type !== "all"
  )
    newSearchParams.set("activity_type", params.activity_type);

  if (
    params.cover_type &&
    COVER_TYPE_KEYS.includes(params.cover_type as PlaceCoverType) &&
    params.cover_type !== "all"
  )
    newSearchParams.set("cover_type", params.cover_type);

  if (
    params.author &&
    USERS_KEYS.includes(params.author as UserTypes) &&
    params.author !== "all"
  )
    newSearchParams.set("author", params.author);

  if (params.event_date && params.event_date !== "all")
    newSearchParams.set("event_date", String(params.event_date));

  if (params.is_visited && params.is_visited !== "all")
    newSearchParams.set("is_visited", String(params.is_visited));

  if (params.is_expired && params.is_expired !== "all")
    newSearchParams.set("is_expired", String(params.is_expired));

  return newSearchParams;
};
