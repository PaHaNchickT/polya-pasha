"use client";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import {
  Place,
  PlaceActivityType,
  PlaceCoverType,
  PlaceLocationType,
} from "@/types/place";
import { api } from "@/lib/api";
import { Breadcrumbs } from "@/components/ui/common/Breadcrumbs";
import EditIcon from "@mui/icons-material/Edit";
import YMap from "@/components/ui/common/YMap";
import { ProgressLink } from "@/components/ui/common/ProgressLink";
import { DeleteWithConfirmButton } from "@/components/ui/common/DeleteWithConfirmButton";
import { notify } from "@/lib/utils/notify";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { ImageGallery } from "@/components/ui/common/ImageGallery";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { USERS_MAP } from "@/lib/constants/users";

import { LabelNew } from "@/components/ui/common/labels/LabelNew";
import { LabelVisited } from "@/components/ui/common/labels/LabelVisited";
import { LabelExpired } from "@/components/ui/common/labels/LabelExpired";

// common icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import LinkIcon from "@mui/icons-material/Link";
import PushPinIcon from "@mui/icons-material/PushPin";
import StarIcon from "@mui/icons-material/Star";

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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// cover icons
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import {
  ACTIVITY_TYPE_MAP,
  COVER_TYPE_MAP,
  LOCATION_TYPE_MAP,
} from "@/lib/constants/place";

interface PlacePageProps {
  data: Place;
}

// Сопоставления для иконок
const locationIcons: Record<PlaceLocationType, React.ReactElement> = {
  home: <HomeIcon fontSize="small" />,
  walk: <DirectionsWalkIcon fontSize="small" />,
  ride: <DirectionsCarIcon fontSize="small" />,
  travel_internal: <DirectionsRailwayIcon fontSize="small" />,
  travel_external: <FlightTakeoffIcon fontSize="small" />,
};

const activityIcons: Record<PlaceActivityType, React.ReactElement> = {
  food: <RestaurantIcon fontSize="small" />,
  rich_food: <DinnerDiningIcon fontSize="small" />,
  movie: <MovieIcon fontSize="small" />,
  music: <MusicNoteIcon fontSize="small" />,
  action: <DirectionsRunIcon fontSize="small" />,
  animals: <PetsIcon fontSize="small" />,
  other: <MoreHorizIcon fontSize="small" />,
};

const coverIcons: Record<PlaceCoverType, React.ReactElement> = {
  open: <WbSunnyIcon fontSize="small" />,
  close: <MeetingRoomIcon fontSize="small" />,
  hybrid: <CompareArrowsIcon fontSize="small" />,
};

export const PlacePage = ({ data }: PlacePageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    api
      .deletePlace(data.id)
      .then(() => {
        notify("Место успешно удалено!", "success");
        nProgress.start();
        router.push("/places");
      })
      .catch((err) => {
        notify(err.message, "error");
        console.error(err.message);
      })
      .finally(() => setLoading(false));
  };

  const formattedCreatedAt = useMemo(
    () => format(new Date(data.createdAt), "d MMMM yyyy", { locale: ru }),
    [data.createdAt],
  );

  const formattedEventDate = useMemo(
    () =>
      data.eventDate
        ? format(new Date(data.eventDate), "d MMMM yyyy", { locale: ru })
        : "Не указано",
    [data.eventDate],
  );

  return (
    <Box component="main" className="flex flex-col gap-8">
      {/* Заголовок и кнопки действий */}
      <div>
        <Breadcrumbs />
        <div className="flex items-center gap-3 mb-2">
          {data.isNew && <LabelNew withIcon />}
          {data.isVisited && <LabelVisited withIcon />}
          {data.isExpired && <LabelExpired withIcon />}
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "no-wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold">
              {data.title}
            </Typography>
            <Typography>{data.description}</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <ProgressLink href={`/places/${data.id}/edit`}>
              <IconButton aria-label="edit" loading={loading}>
                <EditIcon />
              </IconButton>
            </ProgressLink>
            <DeleteWithConfirmButton
              isIconOnly
              onDelete={handleDelete}
              loading={loading}
              dialogContentText="Вы уверены, что хотите удалить это место? Это действие нельзя отменить."
            />
          </Stack>
        </Box>
      </div>

      <div className="flex gap-4">
        {/* Левая колонка */}
        <div className="flex flex-col gap-2 w-[70%]">
          <Card variant="outlined">
            <CardContent className="!py-4 flex flex-col gap-8">
              <div className="flex gap-2">
                <Chip
                  icon={locationIcons[data.locationType]}
                  label={LOCATION_TYPE_MAP[data.locationType]}
                  variant="outlined"
                  size="small"
                  className="!px-1 !border-lime-500"
                  sx={{ "& .MuiChip-icon": { color: "#84cc16 !important" } }}
                />
                {data.activityType.map((act) => (
                  <Chip
                    key={act}
                    icon={activityIcons[act]}
                    label={ACTIVITY_TYPE_MAP[act]}
                    variant="outlined"
                    size="small"
                    className="!px-1 !border-blue-500"
                    sx={{ "& .MuiChip-icon": { color: "#3b82f6 !important" } }}
                  />
                ))}
                <Chip
                  icon={coverIcons[data.coverType]}
                  label={COVER_TYPE_MAP[data.coverType]}
                  variant="outlined"
                  size="small"
                  className="!px-1 !border-yellow-500"
                  sx={{ "& .MuiChip-icon": { color: "#eab308 !important" } }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <PlaceIcon color="action" />
                  <Typography variant="body2">{data.address}</Typography>
                </div>

                <div className="flex gap-2 items-center">
                  <PushPinIcon color="action" />
                  <Typography variant="body2">
                    {data.coordinates.join(" ")}
                  </Typography>
                </div>

                {data.link && (
                  <div className="flex gap-2 items-center">
                    <LinkIcon color="action" />
                    <Typography
                      variant="body1"
                      component="a"
                      href={data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: "none", color: "primary.main" }}
                    >
                      {data.link}
                    </Typography>
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <CalendarTodayIcon color="action" />
                  <Typography variant="body2">
                    Дата события: {formattedEventDate}
                  </Typography>
                </div>

                {Boolean(data.rating) && (
                  <div className="flex gap-2 items-center">
                    <StarIcon color="action" />
                    <Typography variant="body2">Рейтинг:</Typography>
                    <Rating
                      value={(data.rating / 10) * 5}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={USERS_MAP[data.author]}
                    src={`/images/${data.author}-avatar.png`}
                    className="!w-6 !h-6 text-xs"
                  >
                    {USERS_MAP[data.author]?.[0]}
                  </Avatar>
                  <Typography variant="body2">
                    Создано: {formattedCreatedAt}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Комментарий</Typography>
              <Typography variant="body2" color="text.secondary">
                {data.comment || "—"}
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка */}
        <div className="flex flex-col gap-2">
          <Card variant="outlined" className="grow">
            <CardContent className="!p-0 overflow-hidden h-full">
              <ImageGallery images={data.images} />
            </CardContent>
          </Card>
        </div>
      </div>

      <CardContent sx={{ p: 0, overflow: "hidden", borderRadius: 1 }}>
        <YMap center={data.coordinates} readOnly />
      </CardContent>
    </Box>
  );
};
