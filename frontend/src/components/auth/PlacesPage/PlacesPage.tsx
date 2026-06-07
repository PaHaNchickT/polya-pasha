"use client";

import { PlaceItem } from "@/components/ui/PlaceItem";
import { Tabs } from "@/components/ui/Tabs";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { getRandomPhrase } from "@/lib/helpers/getRandomPhrase";
import { Place } from "@/types/place";
import { Typography } from "@mui/material";

type IPlacesPage = {
  data: Place[];
};

export const PlacesPage = ({ data }: IPlacesPage) => {
  console.log(data);

  const username = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  const phrase =
    username === "admin" || username === "polinka"
      ? getRandomPhrase(username)
      : null;

  return (
    <main className="grow flex flex-col gap-4">
      <div>
        <Typography variant="h1" gutterBottom>
          Список мест
        </Typography>
        {phrase && <Typography>{phrase}</Typography>}
      </div>
      <Tabs />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {data.map((item) => (
          <PlaceItem key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
};
