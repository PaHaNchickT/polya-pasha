import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Skeleton,
} from "@mui/material";
import { ChangeEvent } from "react";

interface PaginationProps {
  page: number;
  totalItems: number;
  limit: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalItems,
  limit,
  isFetching,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) =>
    onPageChange(value);

  return (
    <Box
      className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t-1"
      sx={{ borderColor: "divider" }}
    >
      {isFetching ? (
        <Skeleton variant="text" width={120} height={30} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          {totalItems > 0 ? `${from}–${to} из ${totalItems}` : "Нет записей"}
        </Typography>
      )}

      {isFetching ? (
        <Skeleton
          variant="rounded"
          width={300}
          height={32}
          sx={{ borderRadius: 1 }}
        />
      ) : (
        <MuiPagination
          page={page}
          count={totalPages}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="medium"
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              transition: "all 0.2s",
            },
          }}
        />
      )}
    </Box>
  );
};
