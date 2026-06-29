import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import { ACTIVITY_TYPE_KEYS, ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import { PlaceActivityType } from "@/types/place";

interface ActivityTypeSelectProps {
  activityType: PlaceActivityType | "all";
  setActivityType: (activity: PlaceActivityType | "all") => void;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

export function ActivityTypeSelect({
  activityType,
  setActivityType,
  size = "small",
  fullWidth = true,
}: ActivityTypeSelectProps) {
  const tabsData: ReadonlyArray<keyof typeof ACTIVITY_TYPE_MAP> = [
    "all",
    ...ACTIVITY_TYPE_KEYS,
  ];

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <InputLabel id="activity-type-label">Активности</InputLabel>
      <Select
        labelId="activity-type-label"
        id="activity-type-input"
        value={activityType}
        label="Активности"
        onChange={(event: SelectChangeEvent<PlaceActivityType | "all">) =>
          setActivityType(event.target.value)
        }
      >
        {tabsData.map((item) => (
          <MenuItem key={item} value={item}>
            {ACTIVITY_TYPE_MAP[item]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
