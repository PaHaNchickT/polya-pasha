"use client";

import { getPlaces } from "@/lib/api";
import { Button } from "@mui/material";

export default function HomePage() {
  return (
    <main className="grow flex flex-col gap-4">
      <h1 className="text-[37px] font-medium">Пользователи</h1>
      <p>Page has been loaded</p>
      <Button
        onClick={() => {
          getPlaces().then((data) => console.log(data));
          console.log("clicked");
        }}
      >
        Get users
      </Button>
    </main>
  );
}
