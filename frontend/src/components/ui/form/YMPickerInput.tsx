import { useEffect, useRef, useCallback } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TextInput } from "./TextInput";
import YMap from "../common/YMap";
import { PlaceFormData } from "@/components/ui/places/PlaceForm/schema";
import { geocodeAddress, reverseGeocode } from "@/lib/geocoder";

let debounceTimer: NodeJS.Timeout | null = null;

const GEOCODER_KEY = process.env.NEXT_PUBLIC_YANDEX_GEOCODER_API_KEY as string;

export const YMPickerInput = () => {
  const { control, setValue } = useFormContext<PlaceFormData>();
  const mapIframeRef = useRef<HTMLIFrameElement | null>(null);

  const postToMap = useCallback((message: unknown) => {
    if (mapIframeRef.current?.contentWindow) {
      mapIframeRef.current.contentWindow.postMessage(message, "*");
    }
  }, []);

  // Дебаунс‑обёртка для любого действия
  const debounced = useCallback((fn: () => void, delay = 500) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, delay);
  }, []);

  // Прямое геокодирование (адрес → координаты)
  const handleAddressChange = useCallback(
    (address: string) => {
      if (!address || !address.trim()) return;
      debounced(async () => {
        try {
          const result = await geocodeAddress(address, GEOCODER_KEY);
          if (result) {
            setValue("coordinates", [result.lat, result.lon], {
              shouldValidate: true,
            });
            postToMap({ type: "updateMap", center: [result.lat, result.lon] });
          }
        } catch (err) {
          console.error("Ошибка прямого геокодирования:", err);
        }
      });
    },
    [debounced, setValue, postToMap],
  );

  // Обратное геокодирование (координаты → адрес)
  const handleCoordsChange = useCallback(
    (lat: number, lng: number) => {
      if (lat === 0 && lng === 0) return; // игнорируем нулевые координаты по умолчанию
      debounced(async () => {
        try {
          const result = await reverseGeocode([lat, lng], GEOCODER_KEY);
          if (result) {
            setValue("address", result.address, { shouldValidate: true });
          }
        } catch (err) {
          console.error("Ошибка обратного геокодирования:", err);
        }
      });
    },
    [debounced, setValue],
  );

  // Приём координат от iframe (после перетаскивания метки)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.source !== mapIframeRef.current?.contentWindow) return;
      if (event.data?.type === "updateCoords") {
        const coords: [number, number] = event.data.coords;
        if (coords) {
          setValue("coordinates", [coords[0], coords[1]], {
            shouldValidate: true,
          });
          // Обратное геокодирование для получения адреса
          try {
            const result = await reverseGeocode(
              [coords[0], coords[1]],
              GEOCODER_KEY,
            );
            if (result) {
              setValue("address", result.address, { shouldValidate: true });
            }
          } catch (err) {
            console.error("Ошибка обратного геокодирования (из карты):", err);
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setValue]);

  return (
    <Controller
      name="coordinates"
      control={control}
      defaultValue={[0, 0]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const [lat, lng] = value || [0, 0];

        const handleLat = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newLat = e.target.value === "" ? 0 : Number(e.target.value);
          onChange([newLat, lng]);
          handleCoordsChange(newLat, lng);
        };

        const handleLng = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newLng = e.target.value === "" ? 0 : Number(e.target.value);
          onChange([lat, newLng]);
          handleCoordsChange(lat, newLng);
        };

        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextInput
              control={control}
              name="address"
              label="Адрес"
              fullWidth
              nullifyEmpty
              onChangeExtra={(e) => handleAddressChange(e.target.value)}
            />
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
            <Box sx={{ height: 140 }}>
              <YMap ref={mapIframeRef} center={[lat, lng]} height={140} />
            </Box>
          </Box>
        );
      }}
    />
  );
};
