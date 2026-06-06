import { Button, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

type ActionButton = ButtonProps & {
  children: ReactNode;
};

export const ActionButton = ({ children, ...props }: ActionButton) => {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        padding: 0,
        minWidth: "36px",
        minHeight: "36px",
        borderRadius: "100%",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
