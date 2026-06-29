"use client";

import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  IconButton,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { ImageData } from "@/types/place";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_IMAGES = 3;

export const ImagePickerInput: FC = () => {
  const { control } = useFormContext<PlaceFormData>();

  return (
    <Box className="grow flex flex-col justify-end">
      <Typography variant="subtitle2" gutterBottom>
        {`Изображения (JPEG, до ${MAX_IMAGES})`}
      </Typography>
      <Controller
        name="images"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const images: ImageData[] = value ?? [];
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [loading, setLoading] = useState(false);

          const handleFileChange = (
            event: React.ChangeEvent<HTMLInputElement>,
          ) => {
            const files = event.target.files;
            if (!files) return;

            const remainingSlots = MAX_IMAGES - images.length;
            if (files.length > remainingSlots) {
              event.target.value = "";
              return;
            }

            setLoading(true);

            const newImages: ImageData[] = [];
            let hasError = false;

            Promise.all(
              Array.from(files).map((file) => {
                return new Promise<void>((resolve) => {
                  if (file.type !== "image/jpeg") {
                    hasError = true;
                    resolve();
                    return;
                  }
                  if (file.size > MAX_FILE_SIZE) {
                    hasError = true;
                    resolve();
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    // Генерируем временный отрицательный id для нового изображения
                    const tempId =
                      -Date.now() - Math.floor(Math.random() * 1000);
                    newImages.push({
                      id: tempId, // уникальное отрицательное число
                      uri: reader.result as string,
                      name: file.name,
                      type: file.type,
                    });
                    resolve();
                  };
                  reader.onerror = () => {
                    hasError = true;
                    resolve();
                  };
                  reader.readAsDataURL(file);
                });
              }),
            ).then(() => {
              if (!hasError && newImages.length > 0) {
                const updated = [...images, ...newImages].slice(0, MAX_IMAGES);
                onChange(updated);
              }
              setLoading(false);
            });

            event.target.value = "";
          };

          // Удаление теперь по id (стабильно)
          const handleRemove = (imageId: number) => {
            const updated = images.filter((img) => img.id !== imageId);
            onChange(updated);
          };

          const handleDownload = (image: ImageData) => {
            const link = document.createElement("a");
            link.href = image.uri;
            link.download = image.name || "image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          return (
            <Box>
              {loading && (
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">
                    Обработка изображений...
                  </Typography>
                </Box>
              )}

              {images.length > 0 && (
                <>
                  <Box className="flex flex-wrap gap-2 sm:gap-3 mb-2">
                    {images.map((img) => (
                      <Box
                        key={img.id.toString()} // стабильный ключ (id уникально)
                        position="relative"
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: "hidden",
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {img.uri ? (
                          <Box
                            component="img"
                            src={img.uri}
                            alt={img.name}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <InsertPhotoIcon color="disabled" />
                        )}
                        {/* Кнопка удаления */}
                        <IconButton
                          size="small"
                          aria-label="Удалить изображение"
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            backgroundColor: "rgba(0,0,0,0.75)",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.95)",
                            },
                            width: 24,
                            height: 24,
                          }}
                          onClick={() => handleRemove(img.id)} // передаём id
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        {/* Кнопка скачивания */}
                        {img.uri && (
                          <IconButton
                            size="small"
                            aria-label="Скачать изображение"
                            sx={{
                              position: "absolute",
                              top: 2,
                              left: 2,
                              backgroundColor: "rgba(0,0,0,0.75)",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.95)",
                              },
                              width: 24,
                              height: 24,
                            }}
                            onClick={() => handleDownload(img)}
                          >
                            <DownloadIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" display="block" mb={0.5}>
                    {`Загружено ${images.length}/${MAX_IMAGES} изображений`}
                  </Typography>
                </>
              )}

              <Button
                variant="outlined"
                component="label"
                disabled={loading || images.length >= MAX_IMAGES}
                startIcon={loading ? <CircularProgress size={16} /> : null}
                className="!text-white w-full"
              >
                {images.length > 0 ? "Добавить ещё" : "Выбрать изображения"}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              {error && <FormHelperText error>{error.message}</FormHelperText>}
            </Box>
          );
        }}
      />
    </Box>
  );
};
