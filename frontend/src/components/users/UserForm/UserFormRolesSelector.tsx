import { UserFormData } from "@/schemas/user";
import { UserRole } from "@/types/user";
import { MenuItem, TextField } from "@mui/material";
import { ChangeEvent, useCallback } from "react";
import { FieldErrors, UseFormSetValue } from "react-hook-form";

type UserFormRolesSelectorProps = {
  updateSubs: (role: UserRole) => void;
  selectedRole: UserRole;
  setValue: UseFormSetValue<UserFormData>;
  errors: FieldErrors<UserFormData>;
};

export const UserFormRolesSelector = ({
  updateSubs,
  selectedRole,
  setValue,
  errors,
}: UserFormRolesSelectorProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateSubs(event.target.value as UserRole);
      setValue("role", event.target.value as UserRole);
    },
    [updateSubs, setValue]
  );

  return (
    <TextField
      select
      label="Роль"
      value={selectedRole}
      onChange={handleChange}
      error={!!errors.role}
      helperText={errors.role?.message}
    >
      <MenuItem value="Admin">Администратор</MenuItem>
      <MenuItem value="Manager">Менеджер</MenuItem>
      <MenuItem value="User">Пользователь</MenuItem>
    </TextField>
  );
};
