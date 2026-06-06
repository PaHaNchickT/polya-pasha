import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Polya Pasha",
  description: "Приложение для выбора места для свиданий",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="flex flex-col min-h-screen px-8">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
