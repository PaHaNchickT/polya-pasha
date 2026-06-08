"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Paper, Typography } from "@mui/material";
import PlaceForm from "@/components/ui/places/PlaceForm/PlaceForm";
import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useState } from "react";
import { notify } from "@/lib/utils/notify";
import { preparePlaceData } from "@/lib/helpers/preparePlaceData";
import { PlaceResponseData } from "@/types/api";

interface PlaceEditPageProps {
  id: string;
  data: Place;
}

export const PlaceEditPage = ({ id, data }: PlaceEditPageProps) => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);

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
      .updatePlace(+id, postData)
      .then((resp: PlaceResponseData) => {
        notify("Место успешно обновлено!", "success");
        router.push(`/places/${resp.id}`);
      })
      .catch((err) => {
        notify(err.message, "error");
        console.error(err.message);
      })
      .finally(() => setFormLoading(false));
  };

  const handleDelete = () => {
    setFormLoading(true);

    api
      .deletePlace(+id)
      .then(() => {
        notify("Место успешно удалено!", "success");
        router.push("/places");
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
          Редактировать место
        </Typography>
        <PlaceForm
          mode="edit"
          defaultValues={data}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          formLoading={formLoading}
        />
      </Paper>
    </LocalizationProvider>
  );
};
