import React, { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchInputProps {
  searchValue?: string;
  onSearchChange: (search: string) => void;
}

export const SearchInput = ({
  searchValue,
  onSearchChange,
}: SearchInputProps) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearchChange(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearchChange("");
  };

  useEffect(() => {
    setValue(searchValue || "");
  }, [searchValue]);

  return (
    <TextField
      size="small"
      placeholder="Поиск мест..."
      value={value}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              aria-label="очистить поиск"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{ minWidth: 200, maxWidth: 300 }}
    />
  );
};
