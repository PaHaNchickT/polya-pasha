import { z } from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});
