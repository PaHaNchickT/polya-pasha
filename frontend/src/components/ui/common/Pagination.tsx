import { Box, Pagination as MuiPagination, Typography } from "@mui/material";
import { ChangeEvent } from "react";

interface PaginationProps {
  page: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalItems,
  limit,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) =>
    onPageChange(value);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        py: 2,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {totalItems > 0 ? `${from}–${to} из ${totalItems}` : "Нет записей"}
      </Typography>

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
    </Box>
  );
};
