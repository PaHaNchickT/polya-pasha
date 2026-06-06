import { UserFormData } from "@/schemas/user";
import { User } from "@/types/user";
import { getUserRoleIndex } from "@/utils/getUserRoleIndex";
import { updateHierarchyStatus } from "./updateHierarchy";
import { NOTIFY_TEXT } from "@/constants/notify";

export const getNewManager = (
  users: User[],
  user: User,
  userData: UserFormData,
  updateUser: (id: string, patch: Partial<User>) => void,
  currentUserId?: string
) => {
  let status: updateHierarchyStatus = { status: "success" };

  const newManager = users.find(
    (candidate) =>
      candidate.id !== currentUserId &&
      getUserRoleIndex(candidate.role) < getUserRoleIndex(user.role) &&
      !userData.subordinates.includes(candidate.id)
  );

  if (newManager) {
    updateUser(user.id, { ...user, managerId: newManager.id });
  } else {
    status = {
      status: "error",
      errorMsg: NOTIFY_TEXT.editFailure,
    };
  }

  return status;
};
