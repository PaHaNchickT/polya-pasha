import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Skeleton,
  PaginationItem,
  PaginationRenderItemParams,
} from "@mui/material";
import { ChangeEvent, useMemo } from "react";
import { PaginationSkeleton } from "./PaginationSkeleton";
import { PaginationMeta } from "@/types/api";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

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

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  const paginationProps = useMemo(() => {
    if (isSmUp) {
      return {
        showFirstButton: true,
        showLastButton: true,
      };
    }

    // Мобильный вариант: всегда видны первая, текущая и последняя страницы
    return {
      renderItem: (item: PaginationRenderItemParams) => {
        const { page: itemPage, type } = item;

        // Кнопки навигации (first/prev/next/last) оставляем как есть
        if (
          type === "first" ||
          type === "previous" ||
          type === "next" ||
          type === "last"
        ) {
          return <PaginationItem {...item} />;
        }

        // Если страниц мало, показываем все
        if (totalPages <= 4) {
          return <PaginationItem {...item} />;
        }

        // Всегда показываем первую и последнюю страницы
        if (itemPage === 1 || itemPage === totalPages) {
          return <PaginationItem {...item} />;
        }

        // Всегда показываем текущую страницу
        if (itemPage === page) {
          return <PaginationItem {...item} />;
        }

        // Показываем страницу 2, если текущая < 4 (чтобы не было многоточия сразу после 1)
        if (itemPage === 2 && page < 4) {
          return <PaginationItem {...item} />;
        }

        // Показываем предпоследнюю страницу, если текущая > totalPages - 3
        if (itemPage === totalPages - 1 && page > totalPages - 3) {
          return <PaginationItem {...item} />;
        }

        // Левое многоточие: между 1 и текущей (если разрыв больше 1)
        if (itemPage === 2 && page > 3) {
          return <PaginationItem type="start-ellipsis" disabled />;
        }

        // Правое многоточие: между текущей и последней (если разрыв больше 1)
        if (itemPage === totalPages - 1 && page < totalPages - 2) {
          return <PaginationItem type="end-ellipsis" disabled />;
        }

        // Остальные страницы скрываем
        return null;
      },
    };
  }, [isSmUp, totalPages, page]);

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
            onChange={(_: ChangeEvent<unknown>, value: number) =>
              onPageChange(value)
            }
            color="primary"
            shape="rounded"
            size="medium"
            boundaryCount={totalPages}
            siblingCount={isSmUp ? 1 : 0}
            sx={{
              "& .MuiPaginationItem-root": {
                transition: "all 0.2s",
              },
            }}
            {...paginationProps}
          />
        )
      )}
    </Box>
  );
};
