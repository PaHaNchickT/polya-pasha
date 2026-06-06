import { TableState } from "@/types/tableCommon";
import { User } from "@/types/user";

export const TABLE_INIT_STATE: TableState<User> = {
  page: 0,
  pageSize: 10,
  sortBy: "id",
  sortDirection: "asc",
  filter: "",
};
