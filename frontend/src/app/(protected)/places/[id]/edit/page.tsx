"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { useParams } from "next/navigation";

export default function PlaceEditPageServer() {
  // const [data, setData] = useState<PlaceResponseData[]>([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams<{ id: string }>(); // id будет string или string[]
  console.log(id);

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
