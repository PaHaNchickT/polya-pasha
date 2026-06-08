"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Paper, Typography } from "@mui/material";
import PlaceForm from "@/components/ui/places/PlaceForm/PlaceForm";
import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { preparePlaceData } from "@/lib/helpers/preparePlaceData";
import { PlaceAuthorType } from "@/types/place";
import { api } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlaceResponseData } from "@/types/api";
import { notify } from "@/lib/utils/notify";

export const PlaceCreatePage = () => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);

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
    setFormLoading(true);

    const postData = preparePlaceData({
      ...data,
      eventDate: data.eventDate ?? null,
      comment: data.comment ?? null,
      link: data.link ?? null,
      rating: data.isVisited ? data.rating : 0,
      images: data.images ?? [],
    });

    api
      .createPlace(postData)
      .then((resp: PlaceResponseData) => {
        notify("Место успешно добавлено!", "success");
        router.push(`/places/${resp.id}`);
      })
      .catch((err) => {
        notify(err.message, "error");
        console.error(err.message);
      })
      .finally(() => setFormLoading(false));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography variant="h2" gutterBottom>
          Добавить место
        </Typography>
        <PlaceForm
          mode="create"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          formLoading={formLoading}
        />
      </Paper>
    </LocalizationProvider>
  );
};
