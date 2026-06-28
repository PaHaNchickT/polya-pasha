import { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { UserTypes } from "@/types/common";
import { USERS_MAP } from "@/lib/constants/users";
import { HeaderTabs } from "./HeaderTabs";

interface BurgerMenuProps {
  username: UserTypes | null;
  onLogout: () => void;
}

export const BurgerMenu = ({ username, onLogout }: BurgerMenuProps) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const handleLogout = () => {
    toggleDrawer(false);
    onLogout();
  };

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="открыть меню"
        onClick={toggleDrawer(true)}
        className="text-white"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        hideBackdrop
        slotProps={{
          paper: {
            elevation: 0,
            className:
              "w-screen h-screen bg-transparent bg-none backdrop-blur-[12px] text-white",
          },
        }}
      >
        <div className="flex flex-col h-full p-4" role="presentation">
          <div className="flex justify-between items-center mb-4">
            {username && (
              <p className="whitespace-nowrap flex items-center">
                {`Привет, ${USERS_MAP[username]}!`}
              </p>
            )}
            <IconButton onClick={toggleDrawer(false)} color="inherit">
              <CloseIcon />
            </IconButton>
          </div>
          <Divider className="border-white/20" />
          <HeaderTabs onClose={toggleDrawer(false)} />
          <Divider className="border-white/20" />
          <List className="flex flex-col gap-4 items-center">
            <ListItemButton
              onClick={handleLogout}
              className="rounded hover:bg-white/10"
            >
              <ListItemText primary={"Выйти"} />
            </ListItemButton>
          </List>
        </div>
      </Drawer>
    </>
  );
};
