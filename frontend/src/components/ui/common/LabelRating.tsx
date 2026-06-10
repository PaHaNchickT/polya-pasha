import { Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

type LabelRatingProps = {
  rating: number;
};

export const LabelRating = ({ rating }: LabelRatingProps) => {
  return (
    <Box className="absolute top-2 right-2 flex items-center gap-1 bg-black/65 text-white rounded px-2 py-0.5 z-10 backdrop-blur-[2px]">
      <Star sx={{ color: "#FFD700", fontSize: 16 }} />
      <Typography className="!text-xs !leading-none !font-medium">
        {rating}
      </Typography>
    </Box>
  );
};
