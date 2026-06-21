import { Control, Controller, FieldValues, Path } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import { SORTING_TYPE_KEYS, SORTING_TYPE_MAP } from "@/lib/constants/place";

interface PlaceSortTypeSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  isFilter?: boolean;
}

export function PlaceSortTypeSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Сортировать",
  size = "small",
  fullWidth = true,
}: PlaceSortTypeSelectProps<TFieldValues>) {
  const tabsData: ReadonlyArray<keyof typeof SORTING_TYPE_MAP> =
    SORTING_TYPE_KEYS;

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
                {SORTING_TYPE_MAP[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}
