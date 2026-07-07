import { z } from "zod";

export const reviewFormSchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  description: z.string().min(1, "Обязательное поле"),
  visitedAt: z.string().min(1, "Обязательное поле"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
