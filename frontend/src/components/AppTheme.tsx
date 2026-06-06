"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import type { ThemeOptions } from "@mui/material/styles";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Loader } from "./ui/Loader";

interface AppThemeProps {
  children: ReactNode;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, themeComponents } = props;
  const [loading, setLoading] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "data-mui-color-scheme",
          cssVarPrefix: "template",
        },
        colorSchemes: {
          dark: colorSchemes.dark,
        },
        defaultColorScheme: "dark",
        typography,
        shadows,
        shape,
        components: {
          ...themeComponents,
        },
      }),
    [themeComponents],
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline enableColorScheme />
      {loading ? <Loader /> : children}
    </ThemeProvider>
  );
}
