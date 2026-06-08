import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface DatePickerInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
}

export function DatePickerInput<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Дата события",
}: DatePickerInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={value ? dayjs(value) : null}
          onChange={(date: Dayjs | null) =>
            onChange(date ? date.toISOString() : null)
          }
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
            actionBar: {
              actions: ["clear"],
            },
          }}
        />
      )}
    />
  );
}
