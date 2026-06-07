"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";

export default function RandomizerPageServer() {
  // const [data, setData] = useState<PlaceResponseData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);

    // api
    //   .getPlaces()
    //   .then(setData)
    //   .catch((err) => console.error(err.message))
    //   .finally(() => setLoading(false));
  }, []);

  return <>{loading ? <Loader /> : <p>Скоро тут будет контент!</p>}</>;
}
