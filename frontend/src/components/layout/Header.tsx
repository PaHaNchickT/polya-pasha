"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, Typography, AppBar, Toolbar, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { api } from "@/lib/api";
import { notify } from "@/lib/utils/notify";
import { useEffect, useState } from "react";
import {
  HEADER_TABS,
  HEADER_TABS_MAP,
  LOCAL_STORAGE_USERNAME_KEY,
} from "@/lib/constants/common";
import { UserTypes } from "@/types/common";
import { isAuthentificated } from "@/lib/helpers/isAuthentificated";
import { USERS_MAP } from "@/lib/constants/users";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState<UserTypes>("guest");

  const handleClick = (route: string) => {
    const predictPathname = `/${route}`;

    if (predictPathname !== pathname) {
      router.push(`/${route}`);
    }
  };

  const handleLogout = () => {
    api
      .logout()
      .then(() => {
        notify("Вы успешно вышли из аккаунта!", "success");
      })
      .catch((err) => notify(err.message, "error"));
  };

  useEffect(() => {
    setIsSignedIn(isAuthentificated());

    const username = localStorage.getItem(
      LOCAL_STORAGE_USERNAME_KEY,
    ) as UserTypes;

    setUsername(username || "guest");
  }, [pathname]);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      className="!shadow-none !bg-transparent !bg-none !mt-[28px]"
    >
      {isSignedIn && (
        <Container maxWidth="lg" className="!px-[32px] !m-0 !max-w-full">
          <Toolbar
            variant="dense"
            disableGutters
            className="flex items-center justify-between shrink-0 !rounded-2xl !backdrop-blur-xl !border !border-solid !border-[hsla(220,20%,25%,0.6)] !bg-[rgba(5,7,10,0.4)] !shadow-[hsla(220,30%,5%,0.7)_0px_4px_16px_0px,hsla(220,25%,10%,0.8)_0px_8px_16px_-5px] !px-3 !py-2"
          >
            <Typography component="h1" variant="h4">
              ПоляПаша❤
            </Typography>
            <div className="grow flex justify-center items-center px-0 text-white">
              <div className="flex gap-4">
                {HEADER_TABS.map((route) => (
                  <Button
                    key={`${route}-tav`}
                    variant="text"
                    size="small"
                    className="!text-white"
                    onClick={() => handleClick(route)}
                  >
                    {HEADER_TABS_MAP[route]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <p className="whitespace-nowrap flex items-center">
                {`Привет, ${USERS_MAP[username]}!`}
              </p>
              <Button
                size="large"
                disableElevation
                onClick={handleLogout}
                className="text-white opacity-90 hover:opacity-100 !min-w-0"
              >
                <LogoutIcon className="h-16 text-white opacity-90 hover:opacity-100" />
              </Button>
            </div>
          </Toolbar>
        </Container>
      )}
    </AppBar>
  );
};
