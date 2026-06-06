import { UserRole } from "./user";

export type SortDirection = "asc" | "desc";

export type TableState<T> = {
  page: number;
  pageSize: number;
  sortBy?: keyof T;
  sortDirection?: SortDirection;
  filter: UserRole | "";
};
