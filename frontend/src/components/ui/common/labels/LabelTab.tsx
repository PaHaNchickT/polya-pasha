import { Box, Chip } from "@mui/material";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import { PlaceActivityType } from "@/types/place";

interface LabelTabProps {
  activityType: PlaceActivityType | "all";
  tabName: keyof typeof ACTIVITY_TYPE_MAP;
  counters: Record<PlaceActivityType | "all", number>;
  handleClick: (item: PlaceActivityType | "all") => void;
}

export const LabelTab = ({
  activityType,
  tabName,
  counters,
  handleClick,
}: LabelTabProps) => (
  <Chip
    className="!h-[40px]"
    onClick={() => handleClick(tabName)}
    size="medium"
    label={
      <div className="flex gap-2">
        {ACTIVITY_TYPE_MAP[tabName]}
        {counters[tabName] != null && (
          <Box className="ml-1 inline-flex items-center justify-center rounded-full bg-white px-1 text-xs text-black min-w-[22px]">
            {counters[tabName]}
          </Box>
        )}
      </div>
    }
    sx={
      activityType !== tabName
        ? { backgroundColor: "transparent", cursor: "pointer" }
        : { cursor: "auto" }
    }
  />
);
