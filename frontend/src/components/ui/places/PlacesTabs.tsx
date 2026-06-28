import { IconButton } from "@mui/material";
import { PlacesFilterButton } from "./PlacesFilterButton";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import AddIcon from "@mui/icons-material/Add";
import { ProgressLink } from "../common/ProgressLink";
import {
  PlaceActivityType,
  PlacesFilterParams,
  PlacesSortParams,
} from "@/types/place";
import { LabelTab } from "../common/labels/LabelTab";
import { GetPlacesParams } from "@/types/api";
import { SearchInput } from "../form/SearchInput";
import { PlacesSortButton } from "./PlacesSortButton";

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
  const TABS_LIST = Object.keys(ACTIVITY_TYPE_MAP) as (
    | PlaceActivityType
    | "all"
  )[];

  const handleClick = (item: PlaceActivityType | "all") => {
    onFilterChange("activity_type", item);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row w-full justify-between items-start gap-8">
      <div className="flex flex-wrap gap-2">
        {TABS_LIST.map((tabName) => (
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
      <div className="flex gap-2">
        <SearchInput
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <PlacesFilterButton filters={filters} onFilterChange={onFilterChange} />
        <PlacesSortButton sortParams={sortParams} onSortChange={onSortChange} />
        <ProgressLink href="/places/create">
          <IconButton aria-label="add">
            <AddIcon />
          </IconButton>
        </ProgressLink>
      </div>
    </div>
  );
};
