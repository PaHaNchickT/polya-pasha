"use client";

import { Place } from "@/types/place";

type IPlacesPage = {
  data: Place[];
};

export const PlacesPage = ({ data }: IPlacesPage) => {
  console.log(data);

  return (
    <main className="grow flex flex-col gap-4">
      <h1 className="text-[37px] font-medium">Пользователи</h1>
      <p>Page has been loaded</p>
    </main>
  );
};
