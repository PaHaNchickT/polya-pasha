"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Paper, Typography } from "@mui/material";
import PlaceForm from "@/components/ui/places/PlaceForm/PlaceForm";
import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";

export const PlaceCreatePage = () => {
  const defaultValues = {
    title: "",
    description: "",
    eventDate: null,
    locationType: "walk" as const,
    activityType: [],
    coverType: "open" as const,
    comment: "",
    address: "",
    coordinates: [0, 0] as [number, number],
    link: "",
    rating: 5,
    images: [],
    isVisited: false,
  };

  const handleSubmit = (data: PlaceFormData) => {
    console.log("Создание:", data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Добавить место
        </Typography>
        <PlaceForm
          mode="create"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </Paper>
    </LocalizationProvider>
  );
};
