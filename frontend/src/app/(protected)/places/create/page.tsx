"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@mui/material";
import { api } from "@/lib/api";

export default function PlacesCreatePageServer() {
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

  const handleClick = () => {
    console.log("clicked");

    api
      .createPlace({
        title: "Кафе «Ромашка»",
        description: "Уютное кафе в центре",
        event_date: "2026-06-10T18:00:00.000Z",
        author: "Pasha",
        location_type: "walk",
        activity_type: ["food"],
        cover_type: "open",
        comment: "Можно с собаками",
        address: "ул. Ленина, 10",
        coordinates: [55.7558, 37.6173],
        link: null,
        rating: 5,
        images: [],
        is_visited: false,
      })
      .then((data) => console.log(data, "success"))
      .catch((err) => console.error(err.message));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <p>Скоро тут будет контент!</p>
          <Button onClick={handleClick}>Add test user</Button>
        </div>
      )}
    </>
  );
}
