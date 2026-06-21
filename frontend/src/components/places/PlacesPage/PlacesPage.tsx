"use client";

import { PlaceItem } from "@/components/ui/places/PlaceItem";
import { PlacesEmptyList } from "@/components/ui/places/PlacesEmptyList";
import { PlacesTabs } from "@/components/ui/places/PlacesTabs";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { getRandomPhrase } from "@/lib/helpers/getRandomPhrase";
import {
  Place,
  PlaceActivityType,
  PlacesFilterParams,
  PlacesSortParams,
} from "@/types/place";
import { Typography } from "@mui/material";
import { useMemo } from "react";
import isEqual from "lodash/isEqual";
import { GetPlacesParams, PaginationMeta } from "@/types/api";
import { Pagination } from "@/components/ui/common/Pagination";
import { camelToSnake } from "@/lib/helpers/camelToSnake";
import { PlaceItemSkeleton } from "@/components/ui/places/PlaceItemSkeleton";
import { PLACES_FILTERS_DEFAULT_VALUES } from "@/components/ui/places/PlacesFilterButton";

type PlacesPageProps = {
  data: Place[];
  meta: PaginationMeta;
  params: GetPlacesParams;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onFilterChange: (
    key: keyof GetPlacesParams,
    value: string | boolean | undefined,
  ) => void;
  onSortChange: (sortParams: PlacesSortParams) => void;
};

export const PlacesPage = ({
  data,
  meta,
  params,
  isFetching,
  onPageChange,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: PlacesPageProps) => {
  const username = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  const phrase =
    username === "admin" || username === "polinka"
      ? getRandomPhrase(username)
      : null;

  const filters = useMemo(
    () =>
      ({
        locationType: params?.location_type || "all",
        coverType: params?.cover_type || "all",
        author: params?.author || "all",
        eventDate: params?.event_date || "all",
        isVisited: params?.is_visited || "all",
        isExpired: params?.is_expired || "all",
      }) as PlacesFilterParams,
    [params],
  );

  const sortParams = useMemo(
    () =>
      ({
        sort: params?.sort || "created_at",
        order: params?.order || "asc",
      }) as PlacesSortParams,
    [params],
  );

  const handleResetFilters = () => {
    [...Object.keys(PLACES_FILTERS_DEFAULT_VALUES), "activityType"].forEach(
      (key) => {
        onFilterChange(camelToSnake(key) as keyof GetPlacesParams, "all");
      },
    );
    onSearchChange("");
  };

  const emptyArray = useMemo(
    () => Array.from({ length: 4 }, (_, index) => index + 1),
    [],
  );

  return (
    <main className="grow flex flex-col gap-4">
      <div>
        <Typography variant="h1" gutterBottom>
          Список мест
        </Typography>
        {phrase && <Typography>{phrase}</Typography>}
      </div>
      <PlacesTabs
        activityType={
          (params?.activity_type || "all") as PlaceActivityType | "all"
        }
        filters={filters}
        sortParams={sortParams}
        counters={meta.counters}
        searchValue={params?.search}
        isFetching={isFetching}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
      />
      {data.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {isFetching
            ? emptyArray.map((index) => <PlaceItemSkeleton key={index} />)
            : data.map((item) => <PlaceItem key={item.id} item={item} />)}
        </div>
      ) : (
        <PlacesEmptyList
          isFiltersActive={
            !isEqual(filters, PLACES_FILTERS_DEFAULT_VALUES) ||
            params?.activity_type !== "all"
          }
          resetFilters={handleResetFilters}
        />
      )}

      <Pagination
        meta={meta}
        isFetching={isFetching}
        onPageChange={onPageChange}
      />
    </main>
  );
};
