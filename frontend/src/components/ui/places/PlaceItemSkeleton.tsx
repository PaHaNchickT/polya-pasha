import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box, Skeleton } from "@mui/material";
import { clsx as cn } from "clsx";

interface PlaceItemSkeletonProps {
  invisible?: boolean;
}

export const PlaceItemSkeleton = ({
  invisible = false,
}: PlaceItemSkeletonProps) => (
  <div className={cn("relative", invisible && "opacity-0")}>
    <Card
      variant="outlined"
      tabIndex={0}
      className="relative flex flex-col p-0 h-full"
    >
      <div className="absolute top-2 left-2 flex flex-col items-start gap-1 text-white rounded z-10">
        <Skeleton
          variant="rounded"
          width={78}
          height={24}
          className="!rounded-full"
        />
      </div>
      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 text-white rounded z-10">
        <Skeleton
          variant="rounded"
          width={43}
          height={24}
          className="!rounded-full"
        />
      </div>

      <Skeleton
        variant="rounded"
        width="100%"
        height="auto"
        className="!rounded-none aspect-video"
      />

      <CardContent className="flex flex-col gap-4 p-4 flex-grow last:pb-4 border-t border-gray-600">
        <div className="flex gap-2">
          <Skeleton
            variant="rounded"
            width={60}
            height={24}
            className="!rounded-full"
          />
          <Skeleton
            variant="rounded"
            width={50}
            height={24}
            className="!rounded-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton variant="text" width="60%" height={29} />
          <Skeleton variant="text" width="90%" height={20} />
        </div>
      </CardContent>

      <Box className="flex items-center justify-between gap-2 p-4">
        <Box className="flex items-center gap-2">
          <Skeleton
            variant="rounded"
            width={24}
            height={24}
            className="!rounded-full"
          />
          <Skeleton variant="text" width={32} height={20} />
        </Box>

        <Skeleton variant="text" width={76} height={20} />
      </Box>
    </Card>
  </div>
);
