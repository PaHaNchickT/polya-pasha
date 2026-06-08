import { Control, Controller, FieldValues, Path } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface TextInputProps<TFieldValues extends FieldValues>
  extends Omit<TextFieldProps, "name" | "error" | "helperText"> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  /** Если true, преобразует пустую строку в null */
  nullifyEmpty?: boolean;
}

export function TextInput<TFieldValues extends FieldValues>({
  control,
  name,
  nullifyEmpty,
  ...rest
}: TextInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...rest}
          {...field}
          error={!!error}
          helperText={error?.message}
          value={field.value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            field.onChange(nullifyEmpty ? (val === "" ? null : val) : val);
          }}
        />
      )}
    />
  );
}
