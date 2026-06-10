import { Box, Typography } from "@mui/material";

export const LabelNew = () => {
  return (
    <Box className="absolute top-2 left-2 flex items-center gap-1 bg-[#2e7d32] text-white rounded px-2 py-0.5 z-10">
      <Typography className="!text-xs !leading-none !font-medium">
        Новое
      </Typography>
    </Box>
  );
};
