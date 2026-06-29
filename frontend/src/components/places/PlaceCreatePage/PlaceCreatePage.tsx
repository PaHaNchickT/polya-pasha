"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Paper, Typography } from "@mui/material";
import PlaceForm from "@/components/ui/places/PlaceForm/PlaceForm";
import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { preparePlaceData } from "@/lib/helpers/preparePlaceData";
import { PlaceAuthorType } from "@/types/place";
import { useRouter } from "next/navigation";
import { PlaceResponseData } from "@/types/api";
import { notify } from "@/lib/utils/notify";
import { Breadcrumbs } from "@/components/ui/common/Breadcrumbs";
import nProgress from "nprogress";
import { useCreatePlaceMutation } from "@/store/api";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export const PlaceCreatePage = () => {
  const router = useRouter();

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [createPlace, { isLoading }] = useCreatePlaceMutation();

  const author = localStorage.getItem(
    LOCAL_STORAGE_USERNAME_KEY,
  ) as PlaceAuthorType;

  const defaultValues = {
    title: "",
    description: "",
    eventDate: null,
    locationType: "walk" as const,
    activityType: [],
    coverType: "open" as const,
    author,
    comment: "",
    address: "",
    coordinates: [0, 0] as [number, number],
    link: "",
    rating: 5,
    images: [],
    isVisited: false,
  };

  const handleSubmit = (data: PlaceFormData) => {
    const postData = preparePlaceData({
      ...data,
      eventDate: data.eventDate ?? null,
      comment: data.comment ?? null,
      link: data.link ?? null,
      rating: data.isVisited ? data.rating : 0,
      images: data.images ?? [],
    });

    createPlace(postData)
      .unwrap()
      .then((resp: PlaceResponseData) => {
        notify("Место успешно добавлено!", "success");
        nProgress.start();
        router.push(`/places/${resp.id}`);
      })
      .catch((err) => {
        notify(err.message, "error");
        console.error(err.message);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Breadcrumbs />
      <Paper
        sx={{
          p: isSmUp ? 3 : 2,
          width: "100%",
          mx: "auto",
          mt: isSmUp ? 4 : 1,
        }}
      >
        <Typography
          variant={isSmUp ? "h2" : "h3"}
          gutterBottom
          className="text-center sm:text-start"
        >
          Добавить место
        </Typography>
        <PlaceForm
          mode="create"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          formLoading={isLoading}
        />
      </Paper>
    </LocalizationProvider>
  );
};
