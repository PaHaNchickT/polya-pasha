"use client";

import { PlaceItem } from "@/components/ui/PlaceItem";
import { Tabs } from "@/components/ui/Tabs";
import { Place } from "@/types/place";
import { Typography } from "@mui/material";

type IPlacesPage = {
  data: Place[];
};

export const PlacesPage = ({ data }: IPlacesPage) => {
  console.log(data);

  return (
    <main className="grow flex flex-col gap-4">
      <div>
        <Typography variant="h1" gutterBottom>
          Список мест
        </Typography>
        <Typography>
          Я рад, что именно ты стала моей спутницей для посещения всех этих мест
        </Typography>
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
