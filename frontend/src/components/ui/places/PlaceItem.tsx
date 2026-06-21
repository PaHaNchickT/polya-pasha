import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { Place } from "@/types/place";
import { COVER_TYPE_MAP, LOCATION_TYPE_MAP } from "@/lib/constants/place";
import { USERS_MAP } from "@/lib/constants/users";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useMemo } from "react";
import { LabelRating } from "../common/labels/LabelRating";
import { clsx as cn } from "clsx";
import { SignExpired } from "../common/SignExpired";
import { ProgressLink } from "../common/ProgressLink";
import { LabelNew } from "../common/labels/LabelNew";
import { LabelVisited } from "../common/labels/LabelVisited";
import { LabelCouldExpired } from "../common/labels/LabelCouldExpired";

type PlaceItemProps = {
  item: Place;
};

export const PlaceItem = ({ item }: PlaceItemProps) => {
  const { images } = item;

  const formattedDate = useMemo(
    () =>
      item.createdAt
        ? format(new Date(item.createdAt), "d MMMM yyyy", { locale: ru })
        : "",
    [item.createdAt],
  );

  return (
    <ProgressLink href={`/places/${item.id}`}>
      <div className="relative cursor-pointer">
        {item.isExpired && <SignExpired />}
        <Card
          variant="outlined"
          tabIndex={0}
          className={cn(
            "relative flex flex-col p-0 h-full hover:!bg-transparent focus-visible:outline-[3px] focus-visible:outline-[hsla(210,98%,48%,0.5)] focus-visible:outline-offset-2",
            item.isExpired ? "opacity-50" : "hover:opacity-90",
          )}
        >
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1 text-white rounded z-10">
            {item.isVisited && <LabelVisited />}
            {item.isNew && <LabelNew />}
          </div>
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 text-white rounded z-10">
            {item.isVisited && item.rating && (
              <LabelRating rating={item.rating} />
            )}
            {item.eventDate && !item.isExpired && !item.isVisited && (
              <LabelCouldExpired eventDate={item.eventDate} />
            )}
          </div>

          {images.length ? (
            <CardMedia
              component="img"
              alt={images[0].name || "Place image"}
              image={images[0].uri}
              className="h-auto aspect-video md:h-1/2"
            />
          ) : (
            <Box className="h-auto aspect-video md:h-1/2 flex items-center justify-center">
              <ImageNotSupportedIcon color="disabled" fontSize="large" />
            </Box>
          )}

          <CardContent className="flex flex-col gap-4 p-4 flex-grow last:pb-4 border-t border-gray-600">
            <div className="flex gap-2">
              <Chip
                label={LOCATION_TYPE_MAP[item.locationType]}
                variant="outlined"
                size="small"
                className="!border-lime-500 !text-[12px]"
              />
              <Chip
                label={COVER_TYPE_MAP[item.coverType]}
                variant="outlined"
                size="small"
                className="!border-yellow-500 !text-[12px]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="h6" component="div" className="line-clamp-1">
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                className="line-clamp-1 text-[var(--template-palette-text-secondary)]"
              >
                {item.description}
              </Typography>
            </div>
          </CardContent>

          <Box className="flex items-center justify-between gap-2 p-4">
            <Box className="flex items-center gap-2">
              <Avatar
                alt={USERS_MAP[item.author]}
                src={`/images/${item.author}-avatar.png`}
                className="!w-6 !h-6 text-xs"
              >
                {USERS_MAP[item.author]?.[0]}
              </Avatar>
              <Typography variant="caption">
                {USERS_MAP[item.author]}
              </Typography>
            </Box>

            <Typography variant="caption">{formattedDate}</Typography>
          </Box>
        </Card>
      </div>
    </ProgressLink>
  );
};
