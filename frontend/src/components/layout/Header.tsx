"use client";

import { usePathname } from "next/navigation";
import { Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { api } from "@/lib/api";
import { notify } from "@/lib/utils/notify";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/constants/common";

export const Header = () => {
  const pathname = usePathname();
  const [isLogoutButton, setIsLogoutButton] = useState(false);

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
    setIsLogoutButton(Boolean(token));
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
      {isLogoutButton && (
        <Button
          size="large"
          disableElevation
          onClick={handleLogout}
          className="h-[52px] text-white opacity-90 hover:opacity-100"
        >
          <LogoutIcon className="h-16 text-white opacity-90 hover:opacity-100" />
        </Button>
      )}
    </header>
  );
};
