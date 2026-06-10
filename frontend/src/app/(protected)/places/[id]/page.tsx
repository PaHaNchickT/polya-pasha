"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/common/Loader";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { PlaceResponseData } from "@/types/api";
import { PlacePage } from "@/components/places/PlacePage/PlacePage";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";

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

  return (
    <>
      {loading || !data ? (
        <Loader />
      ) : (
        <PlacePage data={transformPlaceData(data)} />
      )}
    </>
  );
}
