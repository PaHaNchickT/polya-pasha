import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (search: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearchChange(search);
      }, 500);
    },
    [onSearchChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    // При очистке отменяем отложенный вызов и сразу передаём пустую строку
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onSearchChange("");
  };

  // Синхронизация с внешним значением
  useEffect(() => {
    setValue(searchValue || "");
    // Если родитель изменил searchValue извне, сбрасываем таймер,
    // чтобы старый вызов не перезатёр актуальное состояние
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [searchValue]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
      sx={{
        minWidth: 200,
        maxWidth: 300,
        "& .MuiOutlinedInput-root": {
          height: "100%",
        },
      }}
    />
  );
};
