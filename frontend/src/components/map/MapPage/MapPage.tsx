"use client";

import { Box, Skeleton, Typography } from "@mui/material";
import { GetMapParams, MapItem } from "@/types/map";
import {
  YMapMultiply,
  YMapMultiplyHandle,
} from "@/components/ui/common/YMapMultiply ";
import { useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { MapFilters } from "@/components/ui/map/MapFilters";
import { MapPlaceItem } from "@/components/ui/map/MapPlaceItem";
import { PlacesFilterParams } from "@/types/place";
import { MapPlaceEmpty } from "@/components/ui/map/MapPlaceEmpty";

interface MapPageProps {
  data: MapItem[];
  params: GetMapParams;
  isFetching: boolean;
  onFilterChange: (
    key: keyof GetMapParams,
    value: string | boolean | undefined,
  ) => void;
}

export const MapPage = ({
  data,
  params,
  isFetching,
  onFilterChange,
}: MapPageProps) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const mapRef = useRef<YMapMultiplyHandle>(null);

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

  const mapHeight = "100%";

  const handleResetMap = () => {
    mapRef.current?.resetMap();
  };

  const handleResetPlace = () => {
    setSelectedId(null);
  };

  return (
    <Box
      component="main"
      className="flex flex-col gap-4 sm:gap-8 h-[400px] mb-[500px] sm:mb-[300px]"
    >
      <main className="grow flex flex-col gap-4">
        <Typography
          variant={isSmUp ? "h1" : "h2"}
          {...(isSmUp && { gutterBottom: true })}
          className="text-center sm:text-start"
        >
          Карта мест
        </Typography>

        <MapFilters
          selectedId={selectedId}
          filters={filters}
          onFilterChange={onFilterChange}
          handleResetMap={handleResetMap}
          handleResetPlace={handleResetPlace}
        />

        <div className="flex flex-col sm:flex-row gap-4 grow">
          {isFetching ? (
            <Skeleton
              variant="rounded"
              className="w-full h-full"
              height={mapHeight}
            />
          ) : (
            <YMapMultiply
              ref={mapRef}
              items={data || []}
              selectedItemId={selectedId}
              onSelectItem={setSelectedId}
              height={mapHeight}
            />
          )}

          {selectedId ? (
            <MapPlaceItem
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ) : (
            <MapPlaceEmpty />
          )}
        </div>
      </main>
    </Box>
  );
};
