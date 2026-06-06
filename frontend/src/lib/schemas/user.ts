import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Имя должно быть минимум 2 символа"),
  email: z.string().email("Неверный формат email"),
  phone: z
    .string()
    .regex(
      /^(?:\+7|8)\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      "Неверный формат телефона"
    ),
  role: z.enum(["Admin", "Manager", "User"]),
  subordinates: z.array(z.string()),
});

export type UserFormData = z.infer<typeof userSchema>;
