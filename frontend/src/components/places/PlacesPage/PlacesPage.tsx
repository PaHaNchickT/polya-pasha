"use client";

import { PlaceItem } from "@/components/ui/places/PlaceItem";
import { PlacesEmptyList } from "@/components/ui/places/PlacesEmptyList";
import { PlacesTabs } from "@/components/ui/places/PlacesTabs";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { getRandomPhrase } from "@/lib/helpers/getRandomPhrase";
import { placesFiltersApplying } from "@/lib/helpers/placesFiltersApplying";
import { Place, PlaceActivityType, PlacesFilterParams } from "@/types/place";
import { Typography } from "@mui/material";
import { useMemo, useState } from "react";
import isEqual from "lodash/isEqual";

export const PLACES_FILTERS_DEFAULT_VALUES: PlacesFilterParams = {
  locationType: "all",
  coverType: "all",
  author: "all",
  isVisited: "all",
};

type IPlacesPage = {
  data: Place[];
};

export const PlacesPage = ({ data }: IPlacesPage) => {
  const username = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  const phrase =
    username === "admin" || username === "polinka"
      ? getRandomPhrase(username)
      : null;

  const [activityType, setActivityType] = useState<PlaceActivityType | "all">(
    "all",
  );
  const [filters, setFilters] = useState<PlacesFilterParams>(
    PLACES_FILTERS_DEFAULT_VALUES,
  );

  const modifiedData = useMemo(
    () => placesFiltersApplying(data, activityType, filters),
    [data, activityType, filters],
  );

  const handleResetFilters = () => {
    setActivityType("all");
    setFilters(PLACES_FILTERS_DEFAULT_VALUES);
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
        activityType={activityType}
        setActivityType={setActivityType}
        filters={filters}
        setFilters={setFilters}
      />
      {modifiedData.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {modifiedData.map((item) => (
            <PlaceItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <PlacesEmptyList
          isFiltersActive={
            !isEqual(filters, PLACES_FILTERS_DEFAULT_VALUES) ||
            activityType !== "all"
          }
          resetFilters={handleResetFilters}
        />
      )}
    </main>
  );
};
