import { Control, Controller, FieldValues, Path } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import { useMemo } from "react";
import { USERS_TYPE_MAP } from "@/lib/constants/place";
import { USERS_KEYS } from "@/lib/constants/users";

interface AuthorSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  isFilter?: boolean;
}

export function AuthorSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Автор",
  size = "small",
  fullWidth = true,
  isFilter = false,
}: AuthorSelectProps<TFieldValues>) {
  const tabsData: ReadonlyArray<keyof typeof USERS_TYPE_MAP> = useMemo(
    () => (isFilter ? ["all", ...USERS_KEYS] : USERS_KEYS),
    [isFilter],
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth={fullWidth} size={size}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            id={name}
            value={field.value ?? ""}
            label={label}
            onChange={(e: SelectChangeEvent<string>) =>
              field.onChange(e.target.value)
            }
          >
            {tabsData.map((item) => (
              <MenuItem key={item} value={item}>
                {USERS_TYPE_MAP[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}
