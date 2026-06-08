"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Paper, Typography } from "@mui/material";
import PlaceForm from "@/components/ui/places/PlaceForm/PlaceForm";
import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface PlaceEditPageProps {
  id: string;
  data: Place;
}

export const PlaceEditPage = ({ id, data }: PlaceEditPageProps) => {
  const router = useRouter();

  const handleSubmit = (data: PlaceFormData) => {
    console.log("Редактирование:", data);
  };

  const handleDelete = () => {
    api
      .deletePlace(+id)
      .then(() => router.push("/places"))
      .catch((err) => console.error(err.message));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Редактировать место
        </Typography>
        <PlaceForm
          mode="edit"
          defaultValues={data}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </Paper>
    </LocalizationProvider>
  );
};
