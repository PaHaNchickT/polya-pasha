"use client";

import { usePathname } from "next/navigation";
import { Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export const Header = () => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const handleLogout = () => {
    console.log("logout");
  };

  return (
    <header className="py-5 flex justify-between items-center">
      <Typography
        component="h1"
        variant="h4"
        className="w-full h-[52px] !text-[34px]"
      >
        ПоляПаша❤
      </Typography>
      {!isLoginPage && (
        <Button
          size="large"
          disableElevation
          onClick={handleLogout}
          className="h-[52px] text-white opacity-90 hover:opacity-100"
        >
          <LogoutIcon className="h-16 text-white opacity-90 hover:opacity-100" />
        </Button>
      )}
      <Button
        size="large"
        disableElevation
        onClick={handleLogout}
        className="h-[52px] text-white opacity-90 hover:opacity-100"
      >
        <LogoutIcon className="h-16 text-white opacity-90 hover:opacity-100" />
      </Button>
    </header>
  );
};
