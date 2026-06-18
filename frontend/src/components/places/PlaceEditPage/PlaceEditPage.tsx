"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Paper, Typography } from "@mui/material";
import PlaceForm from "@/components/ui/places/PlaceForm/PlaceForm";
import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/utils/notify";
import { preparePlaceData } from "@/lib/helpers/preparePlaceData";
import { PlaceResponseData } from "@/types/api";
import { Breadcrumbs } from "@/components/ui/common/Breadcrumbs";
import nProgress from "nprogress";
import { useDeletePlaceMutation, useUpdatePlaceMutation } from "@/store/api";

interface PlaceEditPageProps {
  id: string;
  data: Place;
}

export const PlaceEditPage = ({ id, data }: PlaceEditPageProps) => {
  const router = useRouter();

  const [deletePlace, { isLoading: isDeleteLoading }] =
    useDeletePlaceMutation();
  const [updatePlace, { isLoading: isUpdateLoading }] =
    useUpdatePlaceMutation();

  const handleSubmit = (data: PlaceFormData) => {
    const postData = preparePlaceData({
      ...data,
      eventDate: data.eventDate ?? null,
      comment: data.comment ?? null,
      link: data.link ?? null,
      rating: data.isVisited ? data.rating : 0,
      images: data.images ?? [],
    });

    updatePlace({ id: +id, data: postData })
      .unwrap()
      .then((resp: PlaceResponseData) => {
        notify("Место успешно обновлено!", "success");
        nProgress.start();
        router.push(`/places/${resp.id}`);
      })
      .catch((err) => {
        notify(err.message, "error");
      });
  };

  const handleDelete = () => {
    deletePlace(data.id)
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Breadcrumbs />
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography variant="h2" gutterBottom>
          Редактировать место
        </Typography>
        <PlaceForm
          mode="edit"
          defaultValues={data}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          formLoading={isUpdateLoading || isDeleteLoading}
        />
      </Paper>
    </LocalizationProvider>
  );
};
