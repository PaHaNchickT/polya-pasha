import { Box, Chip, IconButton } from "@mui/material";
import { PlacesFilterButton } from "./PlacesFilterButton";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import AddIcon from "@mui/icons-material/Add";
import { ProgressLink } from "../common/ProgressLink";
import { PlaceActivityType, PlacesFilterParams } from "@/types/place";
import { Dispatch, SetStateAction } from "react";

export const TEMP_TABS: (keyof typeof ACTIVITY_TYPE_MAP)[] = [
  "all",
  "food",
  "rich_food",
  "movie",
  "music",
  "action",
  "animals",
  "nature",
  "other",
];

interface PlacesTabsProps {
  activityType: PlaceActivityType | "all";
  setActivityType: Dispatch<SetStateAction<PlaceActivityType | "all">>;
  filters: PlacesFilterParams;
  setFilters: (filters: PlacesFilterParams) => void;
}

export const PlacesTabs = ({
  activityType,
  setActivityType,
  filters,
  setFilters,
}: PlacesTabsProps) => {
  const handleClick = (item: PlaceActivityType | "all") => {
    setActivityType(item);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        width: "100%",
        justifyContent: "space-between",
        alignItems: "start",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          columnGap: 3,
          rowGap: 1,
        }}
      >
        {TEMP_TABS.map((item) => (
          <Chip
            key={`${item}-tab`}
            onClick={() => handleClick(item)}
            size="medium"
            label={ACTIVITY_TYPE_MAP[item]}
            sx={
              activityType !== item
                ? { backgroundColor: "transparent", border: "none" }
                : null
            }
          />
        ))}
      </Box>
      <div className="flex gap-2 h-max">
        <PlacesFilterButton filters={filters} setFilters={setFilters} />
        <ProgressLink href="/places/create">
          <IconButton aria-label="add">
            <AddIcon />
          </IconButton>
        </ProgressLink>
      </div>
    </Box>
  );
};
