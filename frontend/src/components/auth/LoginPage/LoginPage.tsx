"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "./schema";

import { notify } from "@/lib/utils/notify";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import nProgress from "nprogress";

export const LoginPage = () => {
  const router = useRouter();
  const [formLoading, isFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    isFormLoading(true);

    api
      .login(data)
      .then(() => {
        notify("Вы успешно вошли в аккаунт!", "success");
        nProgress.start();
        router.push("/places");
      })
      .catch((err) => notify(err.message, "error"))
      .finally(() => isFormLoading(false));
  };

  return (
    <Stack
      direction="column"
      sx={{ justifyContent: "space-between" }}
      className="relative min-h-full grow flex !justify-center items-center p-2 sm:p-4"
    >
      <MuiCard
        variant="outlined"
        className="flex flex-col self-center w-full p-8 gap-4 mx-auto 
          sm:max-w-[450px]
          shadow-[hsla(220,30%,5%,0.5)_0px_5px_15px_0px,hsla(220,25%,10%,0.08)_0px_15px_35px_-5px]"
      >
        <Typography
          component="h1"
          variant="h4"
          className="w-full !text-[clamp(2rem,10vw,2.15rem)]"
        >
          Вход в аккаунт
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl error={!!errors.login}>
            <FormLabel htmlFor="login">Логин</FormLabel>
            <TextField
              id="login"
              type="text"
              placeholder="polinka"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
              {...register("login")}
              error={!!errors.login}
              helperText={errors.login?.message}
              color={errors.login ? "error" : "primary"}
            />
          </FormControl>

          <FormControl error={!!errors.password}>
            <FormLabel htmlFor="password">Пароль</FormLabel>
            <TextField
              id="password"
              type="password"
              placeholder="••••••"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              color={errors.password ? "error" : "primary"}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            loading={formLoading}
            sx={{ marginTop: 2 }}
          >
            Войти
          </Button>
        </Box>
      </MuiCard>
    </Stack>
  );
};
