"use client";

import { usePathname } from "next/navigation";
import { Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { api } from "@/lib/api";
import { notify } from "@/lib/utils/notify";
import { useEffect, useState } from "react";
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
  USERS_MAP,
} from "@/lib/constants/common";
import { UserTypes } from "@/types/common";

export const Header = () => {
  const pathname = usePathname();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState<UserTypes>("guest");

  const handleLogout = () => {
    api
      .logout()
      .then(() => {
        notify("Вы успешно вышли из аккаунта!", "success");
      })
      .catch((err) => notify(err.message, "error"));
  };

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    const username = localStorage.getItem(
      LOCAL_STORAGE_USERNAME_KEY,
    ) as UserTypes;

    setIsSignedIn(Boolean(token));
    setUsername(username || "guest");
  }, [pathname]);

  return (
    <header className="py-5 flex justify-between items-center">
      <Typography
        component="h1"
        variant="h4"
        className="w-full h-[52px] !text-[34px]"
      >
        ПоляПаша❤
      </Typography>
      {isSignedIn && (
        <div className="flex gap-2 ">
          <p className="whitespace-nowrap flex items-center">{`Привет, ${USERS_MAP[username]}!`}</p>
          <Button
            size="large"
            disableElevation
            onClick={handleLogout}
            className="h-[52px] text-white opacity-90 hover:opacity-100"
          >
            <LogoutIcon className="h-16 text-white opacity-90 hover:opacity-100" />
          </Button>
        </div>
      )}
    </header>
  );
};
