import { SortDirection } from "@/types/tableCommon";

export function applySorting<T>(
  data: T[],
  sortBy?: keyof T,
  sortDirection: SortDirection = "asc"
): T[] {
  if (!sortBy) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
    if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}
