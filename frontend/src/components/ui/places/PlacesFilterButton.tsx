import { MouseEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { PlacesFilterParams } from "@/types/place";
import { PlaceTypeSelect } from "../form/PlaceTypeSelect";
import { PlaceCoverSelect } from "../form/PlaceCoverSelect";
import { AuthorSelect } from "../form/AuthorSelect";
import { IsVisitedSelect } from "../form/IsVisitedSelect";
import { GetPlacesParams } from "@/types/api";
import { camelToSnake } from "@/lib/helpers/camelToSnake";
import { IsEventDateSelect } from "../form/IsEventDateSelect";
import { IsExpiredSelect } from "../form/IsExpiredSelect";
import { Badge } from "@mui/material";

export const PLACES_FILTERS_DEFAULT_VALUES: PlacesFilterParams = {
  locationType: "all",
  coverType: "all",
  author: "all",
  eventDate: "all",
  isVisited: "all",
  isExpired: "all",
};

interface PlacesFilterButtonProps {
  filters: PlacesFilterParams;
  onFilterChange: (
    key: keyof GetPlacesParams,
    value: string | boolean | undefined,
  ) => void;
}

export const PlacesFilterButton = ({
  filters,
  onFilterChange,
}: PlacesFilterButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { control, handleSubmit, reset } = useForm<PlacesFilterParams>({
    defaultValues: filters,
  });

  const isFiltersInactive = useMemo(
    () => Object.values(filters).every((value) => value === "all"),
    [filters],
  );

  useEffect(() => {
    reset(filters);
  }, [filters, reset]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (data: PlacesFilterParams) => {
    Object.entries(data).forEach((item) => {
      const [key, value] = item;

      onFilterChange(camelToSnake(key) as keyof GetPlacesParams, value);
    });

    handleClose();
  };

  const handleReset = () => {
    Object.keys(PLACES_FILTERS_DEFAULT_VALUES).forEach((key) => {
      onFilterChange(camelToSnake(key) as keyof GetPlacesParams, "all");
    });

    reset(PLACES_FILTERS_DEFAULT_VALUES);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} aria-label="filter options">
        {isFiltersInactive ? (
          <FilterAltIcon />
        ) : (
          <Badge variant="dot" color="primary">
            <FilterAltIcon />
          </Badge>
        )}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        className="!top-5"
      >
        <div className="p-4 flex flex-col gap-8">
          <div className="flex gap-4">
            {/* Левая колонка */}
            <div className="flex flex-col gap-4 min-w-[210px]">
              <PlaceTypeSelect
                control={control}
                name="locationType"
                label="Тип"
                isFilter
              />
              <PlaceCoverSelect
                control={control}
                name="coverType"
                label="Местность"
                isFilter
              />
              <AuthorSelect
                control={control}
                name="author"
                label="Автор"
                isFilter
              />
            </div>
            {/* Правая колонка */}
            <div className="flex flex-col gap-4 min-w-[160px]">
              <IsVisitedSelect
                control={control}
                name="isVisited"
                label="Посещение"
                isFilter
              />
              <IsEventDateSelect
                control={control}
                name="eventDate"
                label="Ограничения по дате"
                isFilter
              />
              <IsExpiredSelect
                control={control}
                name="isExpired"
                label="Прошло ли событие"
                isFilter
              />
            </div>
          </div>
          {/* Кнопки */}
          <div className="flex justify-between">
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={handleReset}
            >
              Сбросить
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit(onSubmit)}
            >
              Применить
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};
