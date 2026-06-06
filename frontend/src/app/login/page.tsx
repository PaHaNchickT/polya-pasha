"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/auth/LoginPage/LoginPage";
import { Loader } from "@/components/ui/Loader";
import { isAuthentificated } from "@/lib/helpers/isAuthentificated";

export default function LoginPageServer() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthentificated()) {
      router.replace("/places");
    } else {
      setLoading(false);
    }
  }, [router]);

  return <>{loading ? <Loader /> : <LoginPage />}</>;
}
