import { IconButton } from "@mui/material";
import { PlacesFilterButton } from "./PlacesFilterButton";
import { ACTIVITY_TYPE_KEYS } from "@/lib/constants/place";
import AddIcon from "@mui/icons-material/Add";
import { ProgressLink } from "../common/ProgressLink";
import {
  GetPlacesParams,
  PlaceActivityType,
  PlacesFilterParams,
  PlacesSortParams,
} from "@/types/place";
import { LabelTab } from "../common/labels/LabelTab";
import { SearchInput } from "../form/SearchInput";
import { PlacesSortButton } from "./PlacesSortButton";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { ActivityTypeSelect } from "../form/ActivityTypeSelect";

interface PlacesTabsProps {
  activityType: PlaceActivityType | "all";
  filters: PlacesFilterParams;
  sortParams: PlacesSortParams;
  counters: Record<PlaceActivityType | "all", number>;
  searchValue?: string;
  isFetching?: boolean;
  onSearchChange: (search: string) => void;
  onFilterChange: (
    key: keyof GetPlacesParams,
    value: string | boolean | undefined,
  ) => void;
  onSortChange: (sortParams: PlacesSortParams) => void;
}

export const PlacesTabs = ({
  activityType,
  filters,
  sortParams,
  counters,
  searchValue,
  isFetching = false,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: PlacesTabsProps) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleClick = (item: PlaceActivityType | "all") => {
    onFilterChange("activity_type", item);
  };

  return (
    <div className="flex flex w-full justify-between items-start gap-8">
      {isSmUp && (
        <div className="flex flex-wrap gap-2">
          {["all" as const, ...ACTIVITY_TYPE_KEYS].map((tabName) => (
            <LabelTab
              key={`${tabName}-tab`}
              activityType={activityType}
              tabName={tabName}
              counters={counters}
              isLoading={isFetching}
              handleClick={handleClick}
            />
          ))}
        </div>
      )}
      <div className="flex flex-col-reverse sm:flex-row w-full sm:w-auto gap-2 flex-wrap sm:flex-nowrap">
        <SearchInput
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <div className="flex gap-2 w-full sm:w-auto">
          {!isSmUp && (
            <ActivityTypeSelect
              activityType={activityType}
              setActivityType={handleClick}
            />
          )}
          <PlacesFilterButton
            filters={filters}
            onFilterChange={onFilterChange}
          />
          <PlacesSortButton
            sortParams={sortParams}
            onSortChange={onSortChange}
          />
          <ProgressLink href="/places/create">
            <IconButton aria-label="add">
              <AddIcon />
            </IconButton>
          </ProgressLink>
        </div>
      </div>
    </div>
  );
};
