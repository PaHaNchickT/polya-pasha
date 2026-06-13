"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/constants/common";
import nProgress from "nprogress";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!token) {
      nProgress.start();
      router.replace("/login");
    } else {
      // Откладываем обновление состояния, чтобы избежать синхронного setState в эффекте
      queueMicrotask(() => setAuthorized(true));
    }
  }, [router]);

  if (!authorized) {
    return null; // одинаково на сервере и при первом клиентском рендере
  }

  return <>{children}</>;
}
