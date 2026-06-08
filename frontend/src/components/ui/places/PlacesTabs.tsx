import { Box, Chip, IconButton } from "@mui/material";
import { PlacesFilterButton } from "./PlacesFilterButton";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";

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
  const router = useRouter();

  const handleClick = () => {
    console.info("You clicked the filter chip.");
  };

  const handleAddClick = () => {
    router.push("/places/create");
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
        <IconButton onClick={handleAddClick} aria-label="add">
          <AddIcon />
        </IconButton>
      </div>
    </Box>
  );
};
