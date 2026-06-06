"use client";

import { useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { Button } from "@mui/material";

export default function HomePage() {
  const loadInitial = useUserStore((s) => s.loadInitial);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return (
    <main className="grow flex flex-col gap-4">
      <h1 className="text-[37px] font-medium">Пользователи</h1>
      <p>Page has been loaded</p>
      <Button
        onClick={() => {
          fetch("https://polya-pasha.vercel.app/api/places")
            .then((res) => res.json())
            .then((places) => console.log("Places:", places))
            .catch((err) => console.error(err));
          console.log("clicked");
        }}
      >
        Get users
      </Button>
    </main>
  );
}
