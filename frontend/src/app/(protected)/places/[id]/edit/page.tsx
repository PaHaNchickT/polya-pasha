"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/common/Loader";
import { useParams, useRouter } from "next/navigation";
import { PlaceEditPage } from "@/components/places/PlaceEditPage/PlaceEditPage";
import { PlaceResponseData } from "@/types/api";
import { api } from "@/lib/api";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";

export default function PlaceEditPageServer() {
  const router = useRouter();
  const [data, setData] = useState<PlaceResponseData | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api
      .getPlace(+id)
      .then(setData)
      .catch((err) => {
        console.error(err.message);
        router.push(`/places/${id}`);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading || !data ? (
        <Loader />
      ) : (
        <PlaceEditPage
          id={id}
          data={transformPlaceData(data as PlaceResponseData)}
        />
      )}
    </>
  );
}
