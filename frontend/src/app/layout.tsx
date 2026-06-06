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
      <body className="flex flex-col justify-between min-h-screen px-8">
        <Header />
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
