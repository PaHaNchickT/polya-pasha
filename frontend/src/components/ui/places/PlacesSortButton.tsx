import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import { PlacesSortParams } from "@/types/place";
import { PlaceSortTypeSelect } from "../form/PlaceSortTypeSelect";
import { PlaceSortOrderSelect } from "../form/PlaceSortOrderSelect";

const PLACES_SORTING_DEFAULT_VALUES: PlacesSortParams = {
  sort: "created_at",
  order: "desc",
};

interface PlacesSortButtonProps {
  sortParams: PlacesSortParams;
  onSortChange: (sortParams: PlacesSortParams) => void;
}

export const PlacesSortButton = ({
  sortParams,
  onSortChange,
}: PlacesSortButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { control, handleSubmit, reset } = useForm<PlacesSortParams>({
    defaultValues: sortParams,
  });

  useEffect(() => {
    reset(sortParams);
  }, [sortParams, reset]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (data: PlacesSortParams) => {
    onSortChange(data);
    handleClose();
  };

  const handleReset = () => {
    onSortChange(PLACES_SORTING_DEFAULT_VALUES);
    reset(PLACES_SORTING_DEFAULT_VALUES);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} aria-label="sort options">
        <FilterListIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        className="!top-5"
      >
        <div className="p-4 flex flex-col gap-4">
          <PlaceSortTypeSelect
            control={control}
            name="sort"
            label="Сортировать"
          />
          <PlaceSortOrderSelect
            control={control}
            name="order"
            label="Порядок"
          />

          <div className="flex gap-4">
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
