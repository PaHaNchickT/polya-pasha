import { Box, Chip } from "@mui/material";
import { FilterButton } from "./FilterButton";
import { AddButton } from "./AddButton";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";

export const TEMP_TABS: (keyof typeof ACTIVITY_TYPE_MAP)[] = [
  "all",
  "food",
  "rich_food",
  "movie",
  "music",
  "action",
  "animals",
  "other",
];

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
        {TEMP_TABS.map((item, idx) => (
          <Chip
            key={`${item}-tab`}
            onClick={handleClick}
            size="medium"
            label={ACTIVITY_TYPE_MAP[item]}
            sx={idx ? { backgroundColor: "transparent", border: "none" } : null}
          />
        ))}
      </Box>
      <div className="flex gap-2 h-max">
        <FilterButton />
        <AddButton />
      </div>
    </Box>
  );
};
