import { Box, Chip, Skeleton } from "@mui/material";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/place";
import { PlaceActivityType } from "@/types/place";

interface LabelTabProps {
  activityType: PlaceActivityType | "all";
  tabName: keyof typeof ACTIVITY_TYPE_MAP;
  counters: Record<PlaceActivityType | "all", number>;
  isLoading: boolean;
  handleClick: (item: PlaceActivityType | "all") => void;
}

export const LabelTab = ({
  activityType,
  tabName,
  counters,
  isLoading = true,
  handleClick,
}: LabelTabProps) => (
  <Chip
    className="!h-[40px]"
    onClick={() => handleClick(tabName)}
    size="medium"
    label={
      <div className="flex gap-2">
        {ACTIVITY_TYPE_MAP[tabName]}
        {isLoading ? (
          <Skeleton
            variant="rounded"
            width={22}
            height={19.5}
            className="!rounded-full ml-1 !bg-white"
          />
        ) : (
          counters[tabName] != null && (
            <Box className="ml-1 inline-flex items-center justify-center rounded-full bg-white px-1 text-xs text-black min-w-[22px]">
              {counters[tabName]}
            </Box>
          )
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
