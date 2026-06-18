import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../styles/globals.css";
import { ReactNode } from "react";
import AppTheme from "@/components/AppTheme";
import { ProgressBarController } from "@/components/ProgressBarController";
import { ReduxProvider } from "@/store/Provider";

export const metadata = {
  title: "Polya Pasha",
  description: "Приложение для выбора места для свиданий",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-mui-color-scheme="dark" suppressHydrationWarning>
      <body className="flex flex-col justify-between min-h-screen px-8 bg-[radial-gradient(at_50%_50%,hsla(210,100%,16%,0.5),hsl(220,30%,5%))]">
        <ReduxProvider>
          <ProgressBarController />
          <AppTheme>
            <Header />
            <div className="grow flex flex-col justify-between my-28">
              {children}
            </div>
            <Footer />
          </AppTheme>
        </ReduxProvider>
      </body>
    </html>
  );
}

// ReduxProvider
