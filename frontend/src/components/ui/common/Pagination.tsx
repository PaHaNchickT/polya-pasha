import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Skeleton,
} from "@mui/material";
import { ChangeEvent } from "react";
import { PaginationSkeleton } from "./PaginationSkeleton";
import { PaginationMeta } from "@/types/api";

interface PaginationProps {
  meta: PaginationMeta;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  meta,
  isFetching,
  onPageChange,
}: PaginationProps) => {
  const { page, limit, totalItems, totalPages } = meta;

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
        <Skeleton variant="rounded" width={77} height={18} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          {totalItems > 0 ? `${from}–${to} из ${totalItems}` : "Нет записей"}
        </Typography>
      )}

      {isFetching ? (
        <PaginationSkeleton totalPages={totalPages} />
      ) : (
        Boolean(totalPages) && (
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
        )
      )}
    </Box>
  );
};
