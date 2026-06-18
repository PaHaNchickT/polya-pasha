// location icons
import HomeIcon from "@mui/icons-material/Home";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

// activity icons
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MovieIcon from "@mui/icons-material/Movie";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PetsIcon from "@mui/icons-material/Pets";
import ForestIcon from "@mui/icons-material/Forest";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// cover icons
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import {
  PlaceActivityType,
  PlaceCoverType,
  PlaceLocationType,
} from "@/types/place";
import { ReactElement } from "react";

export const LOCATION_ICONS_MAP: Record<PlaceLocationType, ReactElement> = {
  home: <HomeIcon fontSize="small" />,
  walk: <DirectionsWalkIcon fontSize="small" />,
  ride: <DirectionsCarIcon fontSize="small" />,
  travel_internal: <DirectionsRailwayIcon fontSize="small" />,
  travel_external: <FlightTakeoffIcon fontSize="small" />,
};

export const ACTIVITY_ICONS_MAP: Record<PlaceActivityType, ReactElement> = {
  food: <RestaurantIcon fontSize="small" />,
  rich_food: <DinnerDiningIcon fontSize="small" />,
  movie: <MovieIcon fontSize="small" />,
  music: <MusicNoteIcon fontSize="small" />,
  action: <DirectionsRunIcon fontSize="small" />,
  animals: <PetsIcon fontSize="small" />,
  nature: <ForestIcon fontSize="small" />,
  walk: <DirectionsWalkIcon fontSize="small" />,
  other: <MoreHorizIcon fontSize="small" />,
};

export const COVER_ICONS_MAP: Record<PlaceCoverType, ReactElement> = {
  open: <WbSunnyIcon fontSize="small" />,
  close: <MeetingRoomIcon fontSize="small" />,
  hybrid: <CompareArrowsIcon fontSize="small" />,
};
