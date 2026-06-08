import { PlaceCreateFormData } from "@/components/ui/places/PlaceForm/schema";
import { Box, Grid, Paper, TextField } from "@mui/material";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

export const YMPickerInput: FC = () => {
  const { control } = useFormContext<PlaceCreateFormData>();
  return (
    <Controller
      name="coordinates"
      control={control}
      defaultValue={[0, 0]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const [lat, lng] = value;
        const handleLat = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newLat = e.target.value === "" ? 0 : Number(e.target.value);
          onChange([newLat, lng]);
        };
        const handleLng = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newLng = e.target.value === "" ? 0 : Number(e.target.value);
          onChange([lat, newLng]);
        };
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Широта"
                  type="number"
                  value={lat}
                  onChange={handleLat}
                  fullWidth
                  error={!!error}
                  helperText={error?.message || ""}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Долгота"
                  type="number"
                  value={lng}
                  onChange={handleLng}
                  fullWidth
                  error={!!error}
                  helperText={error?.message || ""}
                />
              </Grid>
            </Grid>
            <Paper
              variant="outlined"
              sx={{
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
                color: "text.disabled",
                borderStyle: "dashed",
              }}
            >
              Яндекс.Карта (добавьте позже)
            </Paper>
          </Box>
        );
      }}
    />
  );
};
