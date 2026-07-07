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
import { Place } from "@/types/place";
import { Breadcrumbs } from "@/components/ui/common/Breadcrumbs";
import EditIcon from "@mui/icons-material/Edit";
import YMap from "@/components/ui/common/YMap";
import { ProgressLink } from "@/components/ui/common/ProgressLink";
import { DeleteWithConfirmButton } from "@/components/ui/common/DeleteWithConfirmButton";
import { notify } from "@/lib/utils/notify";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ImageGallery } from "@/components/ui/common/ImageGallery";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { USERS_MAP } from "@/lib/constants/users";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import { LabelNew } from "@/components/ui/common/labels/LabelNew";
import { LabelVisited } from "@/components/ui/common/labels/LabelVisited";
import { LabelExpired } from "@/components/ui/common/labels/LabelExpired";

// common icons
import PlaceIcon from "@mui/icons-material/Place";
import LinkIcon from "@mui/icons-material/Link";
import PushPinIcon from "@mui/icons-material/PushPin";

import {
  ACTIVITY_TYPE_MAP,
  COVER_TYPE_MAP,
  LOCATION_TYPE_MAP,
} from "@/lib/constants/place";
import { useDeletePlaceMutation } from "@/store/api";
import {
  ACTIVITY_ICONS_MAP,
  COVER_ICONS_MAP,
  LOCATION_ICONS_MAP,
} from "@/lib/constants/placesIconsMapping";
import { Reviews } from "@/components/ui/reviews/Reviews";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Review } from "@/types/reviews";

interface PlacePageProps {
  placeData: Place;
  reviewsData: Review[];
}

export const PlacePage = ({ placeData, reviewsData }: PlacePageProps) => {
  const router = useRouter();

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [deletePlace, { isLoading }] = useDeletePlaceMutation();

  const handleDelete = () => {
    deletePlace(placeData.id)
      .unwrap()
      .then(() => {
        notify("Место успешно удалено!", "success");
        nProgress.start();
        router.push("/places");
      })
      .catch((err) => {
        notify(err.message, "error");
      });
  };

  const formattedCreatedAt = useMemo(
    () => format(new Date(placeData.createdAt), "d MMMM yyyy", { locale: ru }),
    [placeData.createdAt],
  );

  const formattedEventDate = useMemo(
    () =>
      placeData.eventDate
        ? format(new Date(placeData.eventDate), "d MMMM yyyy", { locale: ru })
        : "Не указано",
    [placeData.eventDate],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="main" className="flex flex-col gap-4 sm:gap-8">
        {/* Заголовок и кнопки действий */}
        <div>
          <Breadcrumbs />
          <div className="flex items-center gap-3 mb-2">
            {placeData.isNew && <LabelNew withIcon />}
            {placeData.isVisited && <LabelVisited withIcon />}
            {placeData.isExpired && <LabelExpired withIcon />}
          </div>

          <div className="flex flex-col gap-2 text-justify">
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
                  {placeData.title}
                </Typography>
                {isSmUp && <Typography>{placeData.description}</Typography>}
              </Box>

              <Stack direction="row" spacing={1}>
                <ProgressLink href={`/places/${placeData.id}/edit`}>
                  <IconButton aria-label="edit" loading={isLoading}>
                    <EditIcon />
                  </IconButton>
                </ProgressLink>
                <DeleteWithConfirmButton
                  isIconOnly
                  onDelete={handleDelete}
                  loading={isLoading}
                  dialogContentText="Вы уверены, что хотите удалить это место? Это действие нельзя отменить."
                />
              </Stack>
            </Box>

            {!isSmUp && <Typography>{placeData.description}</Typography>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Левая колонка */}
          <div className="flex flex-col gap-4 sm:gap-2 sm:w-[60%]">
            <Card variant="outlined">
              <CardContent className="!py-4 flex flex-col gap-8">
                <div className="flex gap-2 flex-wrap">
                  <Chip
                    icon={LOCATION_ICONS_MAP[placeData.locationType]}
                    label={LOCATION_TYPE_MAP[placeData.locationType]}
                    variant="outlined"
                    size="small"
                    className="!px-1 !border-lime-500 grow sm:grow-0"
                    sx={{ "& .MuiChip-icon": { color: "#84cc16 !important" } }}
                  />
                  {placeData.activityType.map((act) => (
                    <Chip
                      key={act}
                      icon={ACTIVITY_ICONS_MAP[act]}
                      label={ACTIVITY_TYPE_MAP[act]}
                      variant="outlined"
                      size="small"
                      className="!px-1 !border-blue-500 grow sm:grow-0"
                      sx={{
                        "& .MuiChip-icon": { color: "#3b82f6 !important" },
                      }}
                    />
                  ))}
                  <Chip
                    icon={COVER_ICONS_MAP[placeData.coverType]}
                    label={COVER_TYPE_MAP[placeData.coverType]}
                    variant="outlined"
                    size="small"
                    className="!px-1 !border-yellow-500 grow sm:grow-0"
                    sx={{ "& .MuiChip-icon": { color: "#eab308 !important" } }}
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <PlaceIcon color="action" sx={{ color: "#e11d48" }} />
                      <Typography variant="body2">
                        {placeData.address}
                      </Typography>
                    </div>

                    <div className="flex gap-2 items-center">
                      <PushPinIcon color="action" sx={{ color: "#e11d48" }} />
                      <Typography variant="body2">
                        {placeData.coordinates.join(" ")}
                      </Typography>
                    </div>

                    {placeData.link && (
                      <div className="flex gap-2 items-center">
                        <LinkIcon color="action" sx={{ color: "#e11d48" }} />
                        <Typography
                          variant="body1"
                          component="a"
                          href={placeData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: "none", color: "primary.main" }}
                        >
                          {placeData.link}
                        </Typography>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <Typography variant="body2" className="!font-bold">
                        Дата события:
                      </Typography>
                      <Typography
                        variant="body2"
                        className="italic text-yellow-500"
                      >
                        {formattedEventDate}
                      </Typography>
                    </div>

                    {Boolean(placeData.rating) && (
                      <div className="flex gap-2 items-center">
                        <Typography variant="body2" className="!font-bold">
                          Рейтинг:
                        </Typography>
                        <Rating
                          value={(placeData.rating / 10) * 5}
                          readOnly
                          precision={0.5}
                          size="small"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt={USERS_MAP[placeData.author]}
                      src={`/images/${placeData.author}-avatar.png`}
                      className="!w-6 !h-6 text-xs"
                    >
                      {USERS_MAP[placeData.author]?.[0]}
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
                  {placeData.comment || "—"}
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка */}
          <div className="flex flex-col gap-2 sm:w-[40%]">
            <Card variant="outlined" className="grow">
              <CardContent className="!p-0 overflow-hidden h-full">
                <ImageGallery images={placeData.images} />
              </CardContent>
            </Card>
          </div>
        </div>

        <CardContent sx={{ p: 0, overflow: "hidden", borderRadius: 1 }}>
          <YMap center={placeData.coordinates} readOnly />
        </CardContent>

        <Reviews placeId={placeData.id} data={reviewsData} />
      </Box>
    </LocalizationProvider>
  );
};
