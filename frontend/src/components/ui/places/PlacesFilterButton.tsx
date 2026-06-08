// components/PlacesFilterButton.tsx
import { MouseEvent, useState } from "react";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { PlaceCoverType, PlaceLocationType } from "@/types/place";
import { PlaceTypeSelect } from "../form/PlaceTypeSelect";
import { PlaceCoverSelect } from "../form/PlaceCoverSelect";

export interface FilterParams {
  type: PlaceLocationType;
  mode: PlaceCoverType;
}

export const PlacesFilterButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { control, handleSubmit } = useForm<FilterParams>({
    defaultValues: {
      type: "walk",
      mode: "open",
    },
  });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (data: FilterParams) => {
    console.log(data);
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
            minWidth: 200,
          }}
        >
          <PlaceTypeSelect control={control} name="type" label="Тип" isFilter />
          <PlaceCoverSelect
            control={control}
            name="mode"
            label="Местность"
            isFilter
          />

          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit(onSubmit)}
          >
            Применить
          </Button>
        </Box>
      </Popover>
    </>
  );
};
