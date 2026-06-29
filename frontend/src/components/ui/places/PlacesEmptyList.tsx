import { Box, Button, Typography } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

interface PlacesEmptyListProps {
  isFiltersActive?: boolean;
  resetFilters?: () => void;
}

export const PlacesEmptyList = ({
  isFiltersActive = false,
  resetFilters,
}: PlacesEmptyListProps) => {
  const handleClick = () => {
    if (resetFilters) resetFilters();
  };

  return (
    <Box className="flex flex-col justify-center items-center gap-2 py-12 text-gray-400 h-[400px]">
      <TravelExploreIcon sx={{ fontSize: 64 }} />
      <Typography variant="h6" color="text.secondary">
        Мест пока нет
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        className="text-center"
      >
        Попробуйте изменить фильтры или добавьте новое место
      </Typography>
      {isFiltersActive && (
        <Button
          variant="contained"
          size="medium"
          onClick={handleClick}
          className="!mt-4"
        >
          Сбросить фильтры
        </Button>
      )}
    </Box>
  );
};
