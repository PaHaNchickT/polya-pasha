import { Box, Skeleton, IconButton } from "@mui/material";
import { useMemo } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

interface PaginationSkeletonProps {
  totalPages: number;
}

export const PaginationSkeleton = ({ totalPages }: PaginationSkeletonProps) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const emptyArray = useMemo(
    () =>
      Array.from(
        { length: !isSmUp && totalPages > 5 ? 4 : totalPages },
        (_, index) => index + 1,
      ),
    [totalPages, isSmUp],
  );

  return (
    <Box className="flex justify-end items-center">
      {Boolean(totalPages) && (
        <>
          {isSmUp && <IconButtonPlaceholder icon="firstPage" />}
          <IconButtonPlaceholder icon="prev" />
          {emptyArray.map((index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={32}
              height={32}
              className="mx-[3px]"
            />
          ))}
          <IconButtonPlaceholder icon="next" />
          {isSmUp && <IconButtonPlaceholder icon="lastPage" />}
        </>
      )}
    </Box>
  );
};

const IconButtonPlaceholder = ({
  icon,
}: {
  icon: "firstPage" | "prev" | "next" | "lastPage";
}) => {
  const ICONS_MAP = {
    firstPage: <FirstPageIcon fontSize="small" />,
    prev: <NavigateBeforeIcon fontSize="small" />,
    next: <NavigateNextIcon fontSize="small" />,
    lastPage: <LastPageIcon fontSize="small" />,
  };

  return (
    <IconButton disabled className="w-[38px] h-[32px]">
      {ICONS_MAP[icon]}
    </IconButton>
  );
};
