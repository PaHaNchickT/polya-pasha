"use client";

import { useEffect } from "react";
import { PlacesPage } from "@/components/places/PlacesPage/PlacesPage";
import { Loader } from "@/components/ui/common/Loader";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";
import { useGetPlacesQuery } from "@/store/api";
import { notify } from "@/lib/utils/notify";

export default function PlacesPageServer() {
  const { data, error, isLoading } = useGetPlacesQuery();

  useEffect(() => {
    if (error) {
      notify(error.message || "Не удалось загрузить список мест", "error");
    }
  }, [error]);

  return (
    <>
      {isLoading || !data ? (
        <Loader />
      ) : (
        <PlacesPage data={data.map((item) => transformPlaceData(item))} />
      )}
    </>
  );
}
