import { UserFormData } from "@/schemas/user";
import { User } from "@/types/user";
import { getUserRoleIndex } from "@/utils/getUserRoleIndex";
import { getNewManager } from "./getNewManager";

export type updateHierarchyStatus = {
  status: "success" | "error";
  errorMsg?: string;
  managerId?: string | null;
};

export const updateHierarchy = (
  users: User[],
  userData: UserFormData,
  currentUser: User | null | undefined,
  updateUser: (id: string, patch: Partial<User>) => void
): updateHierarchyStatus => {
  let status: updateHierarchyStatus = { status: "success" };

  const newRole = userData.role;
  const newSubs = userData.subordinates;
  const currentUserId = currentUser?.id;

  const isRoleChanged = newRole !== currentUser?.role;
  const isSubsChanged =
    [...newSubs].sort().join(",") !==
    [...(currentUser?.subordinates ?? [])].sort().join(",");

  const subsDiff = userData.subordinates.filter(
    (item) => !currentUser?.subordinates.includes(item)
  );

  users.forEach((user) => {
    // SUBORDINATES CHECK
    if (isSubsChanged) {
      if (subsDiff.includes(user.id)) {
        // У старого начальника убираем подчиненного, у которого теперь новый начальник
        const oldManager = users.find(
          (candidate) => candidate.id === user.managerId
        );

        if (oldManager) {
          updateUser(oldManager.id, {
            ...oldManager,
            subordinates: user.subordinates.filter((id) => id !== user.id),
          });
        }
      }

      // Если назначаем челу подчиненных, то у этих подчиненных нужно обновить managerId
      if (user.managerId !== currentUserId && newSubs.includes(user.id)) {
        updateUser(user.id, { ...user, managerId: currentUserId });
      }

      // Если убираем подчиненного, то пытаемся найти ему нового начальника, иначе - не можем отредактировать
      if (
        !newSubs.includes(user.id) &&
        currentUser?.subordinates.includes(user.id)
      ) {
        status = getNewManager(
          users,
          user,
          userData,
          updateUser,
          currentUserId
        );
      }
    }

    // ROLE CHECK
    if (isRoleChanged) {
      const managerData = users.find(
        (userManager) => userManager.id === user.managerId
      );

      if (
        managerData &&
        getUserRoleIndex(managerData?.role) >= getUserRoleIndex(newRole) &&
        user.id === currentUserId
      ) {
        // Если чел-подчиненный прекращает быть по статусу младше начальника, то сбрасываем managerId у чела
        status = { status: "success", managerId: null };

        // Если чел-подчиненный прекращает быть по статусу младше начальника, то также чистим подчиненных у того начальника
        updateUser(managerData.id, {
          ...managerData,
          subordinates: managerData.subordinates.filter((id) => id !== user.id),
        });
      }

      if (
        getUserRoleIndex(newRole) >= getUserRoleIndex(user.role) &&
        user.id !== currentUserId &&
        newSubs.includes(user.id)
      ) {
        // Если начальник перестает быть по статусу выше подчиненного, то пытаемся найти подчиненному нового начальника
        // В ином случае - запрещаем изменение роли
        status = getNewManager(
          users,
          user,
          userData,
          updateUser,
          currentUserId
        );
      }
    }
  });

  return status;
};
