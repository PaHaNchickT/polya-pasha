import { Control, Controller, FieldValues, Path } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import { useMemo } from "react";
import { IS_EVENT_DATE_KEYS, IS_EVENT_DATE_MAP } from "@/lib/constants/place";

interface IsEventDateSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  isFilter?: boolean;
}

export function IsEventDateSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Ограничения по дате",
  size = "small",
  fullWidth = true,
  isFilter = false,
}: IsEventDateSelectProps<TFieldValues>) {
  const tabsData: ReadonlyArray<keyof typeof IS_EVENT_DATE_MAP> = useMemo(
    () => (isFilter ? ["all", ...IS_EVENT_DATE_KEYS] : IS_EVENT_DATE_KEYS),
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
                {IS_EVENT_DATE_MAP[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}
