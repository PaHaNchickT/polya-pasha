"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/constants/common";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!token) {
      router.replace("/login");
    }
    // Если токен есть — ничего не делаем, компонент просто отрендерит children
  }, [router]);

  // Пока эффект не отработал (или если токен был, но проверка ещё не прошла),
  // мы не показываем содержимое, чтобы избежать мигания защищённых данных.
  // Можно проверить наличие токена синхронно прямо здесь, чтобы не ждать эффекта:
  const hasToken =
    typeof window !== "undefined" &&
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  if (!hasToken) {
    // Токена нет — редирект запущен в эффекте, пока возвращаем null (или спиннер)
    return null;
  }

  // Токен есть — рендерим защищённый контент
  return <>{children}</>;
}
