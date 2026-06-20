import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { PlacesFilterParams } from "@/types/place";
import { PlaceTypeSelect } from "../form/PlaceTypeSelect";
import { PlaceCoverSelect } from "../form/PlaceCoverSelect";
import { AuthorSelect } from "../form/AuthorSelect";
import { IsVisitedSelect } from "../form/IsVisitedSelect";
import { PLACES_FILTERS_DEFAULT_VALUES } from "@/components/places/PlacesPage/PlacesPage";
import { GetPlacesParams } from "@/types/api";
import { camelToSnake } from "@/lib/helpers/camelToSnake";

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
        <FilterAltIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 250,
          }}
        >
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
          <IsVisitedSelect
            control={control}
            name="isVisited"
            label="Посещение"
            isFilter
          />

          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit(onSubmit)}
          >
            Применить
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={handleReset}
          >
            Сбросить
          </Button>
        </Box>
      </Popover>
    </>
  );
};
