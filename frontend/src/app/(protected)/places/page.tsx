"use client";

import { Button } from "@mui/material";

export default function HomePage() {
  return (
    <main className="grow flex flex-col gap-4">
      <h1 className="text-[37px] font-medium">Пользователи</h1>
      <p>Page has been loaded</p>
      <Button
        onClick={() => {
          fetch("https://polya-pasha-api.vercel.app/api/places")
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
