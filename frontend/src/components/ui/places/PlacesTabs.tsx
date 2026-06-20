import { Box, IconButton } from "@mui/material";
import { PlacesFilterButton } from "./PlacesFilterButton";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import AddIcon from "@mui/icons-material/Add";
import { ProgressLink } from "../common/ProgressLink";
import { PlaceActivityType, PlacesFilterParams } from "@/types/place";
import { LabelTab } from "../common/labels/LabelTab";
import { GetPlacesParams } from "@/types/api";
import { SearchInput } from "../form/SearchInput";

interface PlacesTabsProps {
  activityType: PlaceActivityType | "all";
  filters: PlacesFilterParams;
  searchValue?: string;
  onSearchChange: (search: string) => void;
  onFilterChange: (
    key: keyof GetPlacesParams,
    value: string | boolean | undefined,
  ) => void;
  counters: Record<PlaceActivityType | "all", number>;
}

export const PlacesTabs = ({
  activityType,
  filters,
  searchValue,
  onSearchChange,
  onFilterChange,
  counters,
}: PlacesTabsProps) => {
  const TABS_LIST = Object.keys(ACTIVITY_TYPE_MAP) as (
    | PlaceActivityType
    | "all"
  )[];

  const handleClick = (item: PlaceActivityType | "all") => {
    onFilterChange("activity_type", item);
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
      <div className="flex flex-wrap gap-2">
        {TABS_LIST.map((tabName) => (
          <LabelTab
            key={`${tabName}-tab`}
            activityType={activityType}
            tabName={tabName}
            counters={counters}
            handleClick={handleClick}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <SearchInput
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <PlacesFilterButton filters={filters} onFilterChange={onFilterChange} />
        <ProgressLink href="/places/create">
          <IconButton aria-label="add">
            <AddIcon />
          </IconButton>
        </ProgressLink>
      </div>
    </Box>
  );
};
