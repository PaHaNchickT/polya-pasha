"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";
import { MaterialDesignContent, SnackbarProvider } from "notistack";
import styled from "@emotion/styled";

const theme = createTheme({
  palette: {
    primary: {
      main: "#daff45",
      dark: "#c4e83a",
    },
    secondary: {
      main: "#000000",
      dark: "#222222",
      contrastText: "#ffffff",
    },
  },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000000",
            borderWidth: "2px",
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#000000",
          },
        },
      },
    },
  },
  typography: { fontFamily: "TTHoves, sans-serif" },
});

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    backgroundColor: "#daff45",
    color: "black",
    maxWidth: "300px",
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "#ff4574",
    maxWidth: "300px",
  },
}));

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        autoHideDuration={2000}
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
        }}
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
}
