import { USER_ROLE_MAPPING } from "@/constants/users";

export const getUserRoleIndex = (role: string) =>
  Object.keys(USER_ROLE_MAPPING).indexOf(role);

// 0 - Admin
// 1 - Manager
// 2 - User
