"use client";

import { usePathname } from "next/navigation";
import { Button, AppBar, Toolbar, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { notify } from "@/lib/utils/notify";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { UserTypes } from "@/types/common";
import { isAuthentificated } from "@/lib/helpers/isAuthentificated";
import { USERS_MAP } from "@/lib/constants/users";
import { ProgressLink } from "../ui/common/ProgressLink";
import nProgress from "nprogress";
import { useLogoutMutation } from "@/store/api";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { HeaderTabs } from "./HeaderTabs";
import { BurgerMenu } from "./BurgerMenu";

export const Header = () => {
  const pathname = usePathname();
  const [logout, { isLoading }] = useLogoutMutation();

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState<UserTypes | null>(null);

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        nProgress.start();
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
        <Container maxWidth="lg" className="px-4 sm:px-8 !m-0 !max-w-full">
          <Toolbar
            variant="dense"
            disableGutters
            className="flex items-center justify-between shrink-0 !rounded-2xl !backdrop-blur-xl !border !border-solid !border-[hsla(220,20%,25%,0.6)] !bg-[rgba(5,7,10,0.4)] !shadow-[hsla(220,30%,5%,0.7)_0px_4px_16px_0px,hsla(220,25%,10%,0.8)_0px_8px_16px_-5px] !px-3 !py-2"
          >
            {pathname === "/places" ? (
              <Image
                src="/images/logo.png"
                alt="ПоляПаша"
                width={782}
                height={500}
                priority
                className="cursor-pointer w-[62px]"
              />
            ) : (
              <ProgressLink href="/places">
                <Image
                  src="/images/logo.png"
                  alt="ПоляПаша"
                  width={782}
                  height={500}
                  priority
                  className="cursor-pointer w-[62px]"
                />
              </ProgressLink>
            )}

            {isSmUp && <HeaderTabs />}
            {isSmUp && (
              <div className="flex gap-4">
                {username && (
                  <p className="whitespace-nowrap flex items-center">
                    {`Привет, ${USERS_MAP[username]}!`}
                  </p>
                )}
                <Button
                  size="large"
                  disableElevation
                  onClick={handleLogout}
                  loading={isLoading}
                  className="text-white opacity-90 hover:opacity-100 !min-w-0"
                >
                  <LogoutIcon className="h-16 text-white opacity-90 hover:opacity-100" />
                </Button>
              </div>
            )}

            {!isSmUp && (
              <BurgerMenu username={username} onLogout={handleLogout} />
            )}
          </Toolbar>
        </Container>
      )}
    </AppBar>
  );
};
