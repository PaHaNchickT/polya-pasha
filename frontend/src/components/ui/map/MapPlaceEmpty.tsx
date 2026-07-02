import Card from "@mui/material/Card";
import { PlaceItemSkeleton } from "../places/PlaceItemSkeleton";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Typography } from "@mui/material";

export const MapPlaceEmpty = () => (
  <div className="w-full sm:w-1/2">
    <Card
      variant="outlined"
      tabIndex={0}
      className="relative flex flex-col p-0 h-full"
    >
      <div className="z-999 absolute w-full h-full flex flex-col items-center justify-center">
        <TravelExploreIcon sx={{ fontSize: 64 }} />
        <Typography variant="h6" color="text.secondary">
          Ничего не выбрано
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="text-center"
        >
          Кликните по месту, чтобы посмотреть информацию о нём
        </Typography>
      </div>
      <PlaceItemSkeleton invisible />
    </Card>
  </div>
);
