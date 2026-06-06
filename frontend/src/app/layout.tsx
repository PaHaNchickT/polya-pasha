import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../styles/globals.css";
import { ReactNode } from "react";
import AppTheme from "@/components/AppTheme";

export const metadata = {
  title: "Polya Pasha",
  description: "Приложение для выбора места для свиданий",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-mui-color-scheme="dark" suppressHydrationWarning>
      <body className="flex flex-col justify-between min-h-screen px-8 bg-[radial-gradient(at_50%_50%,hsla(210,100%,16%,0.5),hsl(220,30%,5%))]">
        <AppTheme>
          <Header />
          <div className="grow">{children}</div>
          <Footer />
        </AppTheme>
      </body>
    </html>
  );
}
