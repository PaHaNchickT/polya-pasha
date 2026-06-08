"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Box, Grid } from "@mui/material";
import { TextInput } from "@/components/ui/form/TextInput";
import { DatePickerInput } from "@/components/ui/form/DatePickerInput";
import { PlaceTypeSelect } from "@/components/ui/form/PlaceTypeSelect";
import { PlaceCoverSelect } from "@/components/ui/form/PlaceCoverSelect";
import { ActivityTypeSelect } from "@/components/ui/form/ActivityTypeSelect";
import { VisitedRatingGroupInput } from "@/components/ui/form/VisitedRatingGroupInput";
import { ImagePickerInput } from "@/components/ui/form/ImagePickerInput";
import { YMPickerInput } from "@/components/ui/form/YMPickerInput";
import {
  PlaceFormData,
  placeFormSchema,
} from "@/components/ui/places/PlaceForm/schema";
import { DeleteWithConfirmButton } from "../../common/DeleteWithConfirmButton";
import { AuthorSelect } from "../../form/AuthorSelect";

interface PlaceFormProps {
  mode: "create" | "edit";
  defaultValues: PlaceFormData;
  formLoading: boolean;
  onSubmit: (data: PlaceFormData) => void;
  onDelete?: () => void | Promise<void>;
}

export default function PlaceForm({
  mode,
  defaultValues,
  formLoading,
  onSubmit,
  onDelete,
}: PlaceFormProps) {
  const methods = useForm<PlaceFormData>({
    resolver: zodResolver(placeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, control } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        <Grid container spacing={3}>
          {/* Левая колонка */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" flexDirection="column" gap={2} height="100%">
              <TextInput
                control={control}
                name="title"
                label="Название"
                fullWidth
              />
              <TextInput
                control={control}
                name="description"
                label="Описание"
                multiline
                rows={4}
                fullWidth
              />
              <DatePickerInput control={control} name="eventDate" />
              <PlaceTypeSelect
                control={control}
                name="locationType"
                label="Тип локации"
              />
              <ActivityTypeSelect
                control={control}
                name="activityType"
                label="Активности"
              />
              <PlaceCoverSelect
                control={control}
                name="coverType"
                label="Тип покрытия"
              />
              <AuthorSelect control={control} name="author" label="Автор" />
              <TextInput
                control={control}
                name="comment"
                label="Комментарий"
                multiline
                minRows={3}
                fullWidth
                nullifyEmpty
                sx={{
                  flexGrow: 1,
                  "& .MuiInputBase-root": {
                    height: "100%",
                    alignItems: "flex-start",
                  },
                  "& .MuiInputBase-input": {
                    height: "100% !important",
                    overflow: "auto !important",
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Правая колонка */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" flexDirection="column" gap={2} height="100%">
              <TextInput
                control={control}
                name="address"
                label="Адрес"
                fullWidth
                nullifyEmpty
              />
              <YMPickerInput />
              <TextInput
                control={control}
                name="link"
                label="Ссылка"
                fullWidth
                nullifyEmpty
              />
              <VisitedRatingGroupInput
                control={control}
                visitedName="isVisited"
                ratingName="rating"
              />
              <ImagePickerInput />
            </Box>
          </Grid>
        </Grid>

        <Box
          mt={3}
          display="flex"
          flexDirection="row-reverse"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={formLoading}
          >
            {mode === "create" ? "Создать" : "Сохранить"}
          </Button>
          {mode === "edit" && onDelete && (
            <DeleteWithConfirmButton
              onDelete={onDelete}
              dialogContentText="Вы уверены, что хотите удалить это место? Это действие нельзя отменить."
              loading={formLoading}
            />
          )}
        </Box>
      </form>
    </FormProvider>
  );
}
