import { z } from "zod";
import { MAX_IMAGES } from "../../form/ImagePickerInput";
import {
  ACTIVITY_TYPE_KEYS,
  COVER_TYPE_KEYS,
  LOCATION_TYPE_KEYS,
} from "@/lib/constants/place";

export const placeFormSchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  description: z.string().min(1, "Обязательное поле"),
  eventDate: z.string().nullable().optional(),
  locationType: z.enum(LOCATION_TYPE_KEYS),
  activityType: z
    .array(z.enum(ACTIVITY_TYPE_KEYS))
    .min(1, "Выберите хотя бы один тип активности"),
  coverType: z.enum(COVER_TYPE_KEYS),
  author: z.enum(["admin", "polinka"]),
  comment: z.string().nullable().optional(),
  address: z.string("Обязательное поле").min(1, "Обязательное поле"),
  coordinates: z.array(z.number()).length(2),
  link: z
    .string()
    .url("Введите корректный URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  rating: z.number().int().min(0, "Минимум 0").max(10, "Максимум 10"),
  images: z
    .array(
      z.object({
        id: z.number(),
        uri: z.string(),
        name: z.string(),
        type: z.string(),
      }),
    )
    .max(MAX_IMAGES, `Максимум ${MAX_IMAGES} изображения`)
    .optional(),
  isVisited: z.boolean(),
});

export type PlaceFormData = z.infer<typeof placeFormSchema>;
