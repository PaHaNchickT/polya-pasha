import { Box, Chip, IconButton } from "@mui/material";
import { PlacesFilterButton } from "./PlacesFilterButton";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import AddIcon from "@mui/icons-material/Add";
import { ProgressLink } from "../common/ProgressLink";

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

export const PlacesTabs = () => {
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
        <PlacesFilterButton />
        <ProgressLink href="/places/create">
          <IconButton aria-label="add">
            <AddIcon />
          </IconButton>
        </ProgressLink>
      </div>
    </Box>
  );
};
