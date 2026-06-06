import { User } from "@/types/user";
import { TableState } from "@/types/tableCommon";

export function applyFilters(
  users: User[],
  tableState: TableState<User>
): User[] {
  return users.filter((user) => {
    if (tableState.filter && user.role !== tableState.filter) {
      return false;
    }

    return true;
  });
}
