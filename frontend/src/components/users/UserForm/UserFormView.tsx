import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, FormControl, FormGroup } from "@mui/material";
import { nanoid } from "nanoid";
import { userSchema, UserFormData } from "@/schemas/user";
import { User, UserRole } from "@/types/user";
import { UserFormRolesSelector } from "./UserFormRolesSelector";
import { UserFormRolesSubordinates } from "./UserFormRolesSubordinates";
import { ModalMode } from "@/types/usersTable";
import { UserFormActionButtons } from "./UserFormActionButtons";
import { useCallback, useState } from "react";
import { updateHierarchy } from "./helpers/updateHierarchy";
import { notify } from "@/utils/notify";
import { NOTIFY_TEXT } from "@/constants/notify";
import { getPotentialSubordinates } from "@/utils/getPotentialSubordinates";

type UserFormProps = {
  users: User[];
  currentUser?: User | null;
  mode: ModalMode;
  defaultValues: UserFormData;
  potentialSubsInit: User[];
  onSave: () => void;
  addUser: (u: User) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
};

export const UserFormView = ({
  users,
  currentUser,
  mode,
  defaultValues,
  potentialSubsInit,
  onSave,
  addUser,
  updateUser,
}: UserFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });
  const [potentialSubs, setPotentialSubs] = useState(potentialSubsInit);

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  const selectedSubs = useWatch({
    control,
    name: "subordinates",
  });

  const updateSubs = useCallback(
    (role: UserRole) => {
      if (!currentUser) return;

      const potentialSubsUpdated = getPotentialSubordinates(users, {
        ...currentUser,
        role,
      });
      const potentialSubsUpdatedIds = potentialSubsUpdated.map((sub) => sub.id);

      setValue(
        "subordinates",
        currentUser.subordinates.filter((sub) =>
          potentialSubsUpdatedIds.includes(sub)
        )
      );
      setPotentialSubs(potentialSubsUpdated);
    },
    [currentUser, setValue, users]
  );

  const onSubmit = useCallback(
    (data: UserFormData) => {
      if (mode === "create") {
        const id = nanoid();
        addUser({ id, managerId: null, ...data });
        onSave();

        notify(NOTIFY_TEXT.createSuccess, "success");
      } else if (mode === "edit" && currentUser) {
        const result = updateHierarchy(users, data, currentUser, updateUser);

        const managerId =
          "managerId" in result ? result.managerId : currentUser.managerId;

        if (result.status === "success") {
          updateUser(currentUser.id, { ...currentUser, ...data, managerId });
          onSave();

          notify(NOTIFY_TEXT.editSuccess, "success");
        } else {
          notify(result.errorMsg || NOTIFY_TEXT.default, "error");
        }
      }
    },
    [addUser, currentUser, mode, onSave, updateUser, users]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth>
        <FormGroup sx={{ gap: 2 }}>
          <TextField
            label="Имя"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Телефон"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <UserFormRolesSelector
            updateSubs={updateSubs}
            selectedRole={selectedRole}
            setValue={setValue}
            errors={errors}
          />

          {mode === "edit" && (
            <UserFormRolesSubordinates
              users={users}
              selectedSubs={selectedSubs}
              potentialSubs={potentialSubs}
              setValue={setValue}
            />
          )}

          <UserFormActionButtons mode={mode} onSave={onSave} />
        </FormGroup>
      </FormControl>
    </form>
  );
};
