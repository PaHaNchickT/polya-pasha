"use client";

import { useEffect, useState } from "react";
import { PlacesPage } from "@/components/auth/PlacesPage/PlacesPage";
import { api } from "@/lib/api";
import { Loader } from "@/components/ui/Loader";
import { Place } from "@/types/place";

export default function HomePage() {
  const [data, setData] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPlaces()
      .then(setData)
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return <>{loading ? <Loader /> : <PlacesPage data={data} />}</>;
}
