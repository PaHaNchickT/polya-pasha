import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SortIcon from "@mui/icons-material/Sort";

export type SortType = "walk" | "ride" | "travel_internal" | "travel_external";
export type SortMode = "open" | "close" | "hybrid";

export interface SortParams {
  type: SortType;
  mode: SortMode;
}

interface SortPopoverProps {
  onSortChange?: (params: SortParams) => void;
}

export const SortButton = ({ onSortChange }: SortPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [type, setType] = useState<SortType>("walk");
  const [mode, setMode] = useState<SortMode>("open");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onSortChange?.({ type, mode });
    handleClose();
  };

  const handleTypeChange = (event: SelectChangeEvent<SortType>) => {
    setType(event.target.value as SortType);
  };

  const handleModeChange = (event: SelectChangeEvent<SortMode>) => {
    setMode(event.target.value as SortMode);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} aria-label="sort options">
        <SortIcon />
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
              <MenuItem value="walk">Walk</MenuItem>
              <MenuItem value="ride">Ride</MenuItem>
              <MenuItem value="travel_internal">Travel Internal</MenuItem>
              <MenuItem value="travel_external">Travel External</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="mode-select-label">Режим</InputLabel>
            <Select
              labelId="mode-select-label"
              value={mode}
              label="Режим"
              onChange={handleModeChange}
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="close">Close</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
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
