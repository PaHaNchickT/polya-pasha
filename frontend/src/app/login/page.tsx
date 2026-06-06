"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const l = form.get("login") as string;
    const p = form.get("password") as string;
    try {
      await login(l, p);
      router.push("/places");
    } catch (err: any) {
      setError(err.message);
    }
  }

  // useEffect(() => {
  //   const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  //   if (token) router.replace("/places");
  // }, [router]);

  return (
    <form onSubmit={handleSubmit}>
      <input name="login" placeholder="Логин" required />
      <input name="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
