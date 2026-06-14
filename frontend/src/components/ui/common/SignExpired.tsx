import { Box, Typography } from "@mui/material";

export const SignExpired = () => {
  return (
    <Box className="absolute top-[calc(25%-19px)] flex items-center justify-center gap-1 text-[#d32f2f] bg-black/65 py-2 z-[1] w-full">
      <Typography className="!text-2xl !leading-none !font-bold">
        Событие прошло
      </Typography>
    </Box>
  );
};
