"use client";

import { useEffect, useState } from "react";
import { PlacesPage } from "@/components/places/PlacesPage/PlacesPage";
import { api } from "@/lib/api";
import { Loader } from "@/components/ui/common/Loader";
import { PlaceResponseData } from "@/types/api";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";

export default function PlacesPageServer() {
  const [data, setData] = useState<PlaceResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPlaces()
      .then(setData)
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <PlacesPage data={data.map((item) => transformPlaceData(item))} />
      )}
    </>
  );
}
