"use client";

import { Box, Skeleton, Typography } from "@mui/material";
import { GetMapParams, MapItem } from "@/types/map";
import YMapMultiply from "@/components/ui/common/YMapMultiply ";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  console.log(selectedId);
  // const router = useRouter();

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box component="main" className="flex flex-col gap-4 sm:gap-8">
      <main className="grow flex flex-col gap-4">
        <Typography
          variant={isSmUp ? "h1" : "h2"}
          {...(isSmUp && { gutterBottom: true })}
          className="text-center sm:text-start"
        >
          Карта мест
        </Typography>
        {isFetching ? (
          <Skeleton variant="rounded" width={77} height={18} />
        ) : (
          <YMapMultiply
            items={data || []}
            selectedItemId={selectedId}
            onSelectItem={setSelectedId}
          />
        )}
      </main>
    </Box>
  );
};
