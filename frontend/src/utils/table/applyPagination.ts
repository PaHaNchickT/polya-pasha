export function applyPagination<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const start = page * pageSize;
  return data.slice(start, start + pageSize);
}
