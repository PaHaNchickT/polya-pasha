"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/constants/common";
import { LoginPage } from "@/components/auth/LoginPage/LoginPage";
import { Loader } from "@/components/ui/Loader";

export default function LoginPageServer() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    if (token) {
      router.replace("/places");
    } else {
      setLoading(false);
    }
  }, [router]);

  return <>{loading ? <Loader /> : <LoginPage />}</>;
}
