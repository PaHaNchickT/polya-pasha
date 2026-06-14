import { Control, Controller, FieldValues, Path } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";

const TEMP_PLACE_ACTIVITIES_LIST = [
  "food",
  "rich_food",
  "movie",
  "music",
  "action",
  "animals",
  "nature",
  "walk",
  "other",
] as const;

interface ActivityTypeSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  options?: ReadonlyArray<keyof typeof ACTIVITY_TYPE_MAP>;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

export function ActivityTypeSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Активности",
  options = TEMP_PLACE_ACTIVITIES_LIST as unknown as ReadonlyArray<
    keyof typeof ACTIVITY_TYPE_MAP
  >,
  size = "small",
  fullWidth = true,
}: ActivityTypeSelectProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} size={size} error={!!error}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            id={name}
            multiple
            value={value ?? []}
            onChange={onChange}
            label={label}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((val) => (
                  <Chip
                    key={val}
                    label={
                      ACTIVITY_TYPE_MAP[val as keyof typeof ACTIVITY_TYPE_MAP]
                    }
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {options.map((act) => (
              <MenuItem key={act} value={act}>
                {ACTIVITY_TYPE_MAP[act]}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
