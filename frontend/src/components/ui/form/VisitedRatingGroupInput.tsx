import {
  Control,
  Controller,
  FieldValues,
  Path,
  useWatch,
} from "react-hook-form";
import { Switch, FormControlLabel, TextField } from "@mui/material";

interface VisitedRatingGroupInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  visitedName: Path<TFieldValues>;
  ratingName: Path<TFieldValues>;
  visitedLabel?: string;
  ratingLabel?: string;
}

export function VisitedRatingGroupInput<TFieldValues extends FieldValues>({
  control,
  visitedName,
  ratingName,
  visitedLabel = "Посещено",
  ratingLabel = "Рейтинг (1-10)",
}: VisitedRatingGroupInputProps<TFieldValues>) {
  const isVisited = useWatch({ control, name: visitedName });

  return (
    <div className="flex gap-2">
      <Controller
        name={visitedName}
        control={control}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
            }
            label={visitedLabel}
          />
        )}
      />
      <Controller
        name={ratingName}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextField
            label={ratingLabel}
            type="number"
            fullWidth
            disabled={!isVisited}
            value={value}
            onChange={(e) =>
              onChange(
                e.target.value === "" ? 0 : Math.round(Number(e.target.value)),
              )
            }
            inputProps={{ min: 0, max: 10, step: 1 }}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </div>
  );
}
