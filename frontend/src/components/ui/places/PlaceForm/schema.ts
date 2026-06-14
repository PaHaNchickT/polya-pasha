import { z } from "zod";
import { MAX_IMAGES } from "../../form/ImagePickerInput";

export const placeFormSchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  description: z.string().min(1, "Обязательное поле"),
  eventDate: z.string().nullable().optional(),
  locationType: z.enum([
    "home",
    "walk",
    "ride",
    "travel_internal",
    "travel_external",
  ]),
  activityType: z
    .array(
      z.enum([
        "food",
        "rich_food",
        "movie",
        "music",
        "action",
        "animals",
        "nature",
        "walk",
        "other",
      ]),
    )
    .min(1, "Выберите хотя бы один тип активности"),
  coverType: z.enum(["open", "close", "hybrid"]),
  author: z.enum(["admin", "polinka"]),
  comment: z.string().nullable().optional(),
  address: z.string().min(1, "Обязательное поле"),
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
