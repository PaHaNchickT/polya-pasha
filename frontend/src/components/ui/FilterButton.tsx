import { MouseEvent, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { PlaceCoverType, PlaceLocationType } from "@/types/place";
import { LOCATION_TYPE_MAP, COVER_TYPE_MAP } from "@/lib/constants/place";

const TEMP_PLACE_COVER_LIST: (keyof typeof LOCATION_TYPE_MAP)[] = [
  "all",
  "walk",
  "ride",
  "travel_internal",
  "travel_external",
];
const TEMP_PLACE_LOCATION_LIST: (keyof typeof COVER_TYPE_MAP)[] = [
  "all",
  "open",
  "close",
  "hybrid",
];

export interface FilterParams {
  type: PlaceLocationType;
  mode: PlaceCoverType;
}

interface IFilterButton {
  onFilterChange?: (params: FilterParams) => void;
}

export const FilterButton = ({ onFilterChange }: IFilterButton) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [type, setType] = useState<PlaceLocationType>("walk");
  const [mode, setMode] = useState<PlaceCoverType>("open");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onFilterChange?.({ type, mode });
    handleClose();
  };

  const handleTypeChange = (event: SelectChangeEvent<PlaceLocationType>) => {
    setType(event.target.value as PlaceLocationType);
  };

  const handleModeChange = (event: SelectChangeEvent<PlaceCoverType>) => {
    setMode(event.target.value as PlaceCoverType);
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
          <FormControl fullWidth size="small">
            <InputLabel id="type-select-label">Тип</InputLabel>
            <Select
              labelId="type-select-label"
              value={type}
              label="Тип"
              onChange={handleTypeChange}
            >
              {TEMP_PLACE_COVER_LIST.map((item) => (
                <MenuItem key={`${item}-option`} value={item}>
                  {LOCATION_TYPE_MAP[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="mode-select-label">Местность</InputLabel>
            <Select
              labelId="mode-select-label"
              value={mode}
              label="Режим"
              onChange={handleModeChange}
            >
              {TEMP_PLACE_LOCATION_LIST.map((item) => (
                <MenuItem key={`${item}-option`} value={item}>
                  {COVER_TYPE_MAP[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" size="small" onClick={handleApply}>
            Применить
          </Button>
        </Box>
      </Popover>
    </>
  );
};
