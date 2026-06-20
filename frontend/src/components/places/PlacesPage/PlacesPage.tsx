"use client";

import { PlaceItem } from "@/components/ui/places/PlaceItem";
import { PlacesEmptyList } from "@/components/ui/places/PlacesEmptyList";
import { PlacesTabs } from "@/components/ui/places/PlacesTabs";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { getRandomPhrase } from "@/lib/helpers/getRandomPhrase";
import { Place, PlaceActivityType, PlacesFilterParams } from "@/types/place";
import { Typography } from "@mui/material";
import { useMemo } from "react";
import isEqual from "lodash/isEqual";
import { GetPlacesParams, PaginationMeta } from "@/types/api";
import { Pagination } from "@/components/ui/common/Pagination";
import { Loader } from "@/components/ui/common/Loader";
import { camelToSnake } from "@/lib/helpers/camelToSnake";

export const PLACES_FILTERS_DEFAULT_VALUES: PlacesFilterParams = {
  locationType: "all",
  coverType: "all",
  author: "all",
  isVisited: "all",
};

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
};

export const PlacesPage = ({
  data,
  meta,
  params,
  isFetching,
  onPageChange,
  onSearchChange,
  onFilterChange,
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
        isVisited: params?.is_visited || "all",
      }) as PlacesFilterParams,
    [params],
  );

  const handleResetFilters = () => {
    [...Object.keys(PLACES_FILTERS_DEFAULT_VALUES), "activityType"].forEach(
      (key) => {
        onFilterChange(camelToSnake(key) as keyof GetPlacesParams, "all");
        console.log(key);
      },
    );
    onSearchChange("");
  };

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
        searchValue={params?.search}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        counters={meta.counters}
      />
      {isFetching ? (
        <Loader />
      ) : data.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {data.map((item) => (
            <PlaceItem key={item.id} item={item} />
          ))}
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
        page={meta.page}
        totalItems={meta.totalItems}
        limit={meta.limit}
        onPageChange={onPageChange}
      />
    </main>
  );
};
