import { UserFormData } from "@/schemas/user";
import { UserFormView } from "./UserFormView";
import { User } from "@/types/user";
import { getPotentialSubordinates } from "@/utils/getPotentialSubordinates";
import { ModalMode } from "@/types/usersTable";
import { useMemo } from "react";

type UserFormContainer = {
  users: User[];
  mode: ModalMode;
  userId?: string;
  onSave: () => void;
  addUser: (u: User) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
};

export const UserFormContainer = ({
  users,
  mode,
  userId,
  onSave,
  addUser,
  updateUser,
}: UserFormContainer) => {
  const currentUser =
    mode === "edit" ? users.find((user) => user.id === userId) : null;

  const defaultValues: UserFormData = {
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    role: currentUser?.role || "User",
    subordinates: currentUser?.subordinates || [],
  };

  const potentialSubordinates = useMemo(
    () => getPotentialSubordinates(users, currentUser),
    [users, currentUser]
  );

  return (
    <UserFormView
      users={users}
      currentUser={currentUser}
      mode={mode}
      defaultValues={defaultValues}
      potentialSubsInit={potentialSubordinates}
      onSave={onSave}
      addUser={addUser}
      updateUser={updateUser}
    />
  );
};
