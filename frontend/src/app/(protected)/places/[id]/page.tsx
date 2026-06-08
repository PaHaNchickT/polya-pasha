"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/common/Loader";
import { Button } from "@mui/material";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { PlaceResponseData } from "@/types/api";

export default function PlacePageServer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PlaceResponseData | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setLoading(false);

    api
      .getPlace(+id)
      .then(setData)
      .catch((err) => {
        router.push("/places");
        console.error(err.message);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    console.log("clicked");

    api
      .createPlace({
        title: "Кафе «Ромашка»",
        description: "Уютное кафе в центре",
        event_date: "2026-06-10T18:00:00.000Z",
        author: "admin",
        location_type: "walk",
        activity_type: ["food", "action"],
        cover_type: "open",
        comment: "Можно с собаками",
        address: "ул. Ленина, 10",
        coordinates: [55.7558, 37.6173],
        link: null,
        rating: 0,
        images: [],
        is_visited: false,
      })
      .then((data) => console.log(data, "success"))
      .catch((err) => console.error(err.message));
  };

  console.log(data);

  return (
    <>
      {loading || !data ? (
        <Loader />
      ) : (
        <div>
          <p>Скоро тут будет контент!</p>
          <Button onClick={() => router.push(`/places/${id}/edit`)}>
            Edit place
          </Button>
          <Button onClick={handleClick}>Add test place</Button>
        </div>
      )}
    </>
  );
}
