import { Control, Controller, FieldValues, Path } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import { useMemo } from "react";
import { IS_EXPIRED_KEYS, IS_EXPIRED_MAP } from "@/lib/constants/place";

interface IsExpiredSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  isFilter?: boolean;
}

export function IsExpiredSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Прошло ли событие",
  size = "small",
  fullWidth = true,
  isFilter = false,
}: IsExpiredSelectProps<TFieldValues>) {
  const tabsData: ReadonlyArray<keyof typeof IS_EXPIRED_MAP> = useMemo(
    () => (isFilter ? ["all", ...IS_EXPIRED_KEYS] : IS_EXPIRED_KEYS),
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
                {IS_EXPIRED_MAP[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}
