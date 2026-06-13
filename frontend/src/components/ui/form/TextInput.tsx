import { TextField, TextFieldProps } from "@mui/material";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

interface TextInputProps<TFieldValues extends FieldValues>
  extends UseControllerProps<TFieldValues>,
    Omit<TextFieldProps, "name" | "defaultValue" | "control"> {
  nullifyEmpty?: boolean;
  onChangeExtra?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function TextInput<TFieldValues extends FieldValues>({
  control,
  name,
  nullifyEmpty,
  onChangeExtra,
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
            if (onChangeExtra) onChangeExtra(e);
          }}
        />
      )}
    />
  );
}
