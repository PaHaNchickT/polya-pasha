import { Box, Chip } from "@mui/material";
import { SortButton } from "./SortButton";
import { AddButton } from "./AddButton";

export const Tabs = () => {
  const handleClick = () => {
    console.info("You clicked the filter chip.");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        width: "100%",
        justifyContent: "space-between",
        alignItems: "start",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          columnGap: 3,
          rowGap: 1,
        }}
      >
        <Chip onClick={handleClick} size="medium" label="Все активности" />
        <Chip
          onClick={handleClick}
          size="medium"
          label="Покушать"
          sx={{ backgroundColor: "transparent", border: "none" }}
        />
        <Chip
          onClick={handleClick}
          size="medium"
          label="Покушать дорого"
          sx={{ backgroundColor: "transparent", border: "none" }}
        />
        <Chip
          onClick={handleClick}
          size="medium"
          label="Фильмы"
          sx={{ backgroundColor: "transparent", border: "none" }}
        />
        <Chip
          onClick={handleClick}
          size="medium"
          label="Музыка"
          sx={{ backgroundColor: "transparent", border: "none" }}
        />
        <Chip
          onClick={handleClick}
          size="medium"
          label="Активный отдых"
          sx={{ backgroundColor: "transparent", border: "none" }}
        />
        <Chip
          onClick={handleClick}
          size="medium"
          label="Зверушки"
          sx={{ backgroundColor: "transparent", border: "none" }}
        />
        <Chip
          onClick={handleClick}
          size="medium"
          label="Другое"
          sx={{ backgroundColor: "transparent", border: "none" }}
        />
      </Box>
      <div className="flex gap-2 h-max">
        <SortButton />
        <AddButton />
      </div>
    </Box>
  );
};
