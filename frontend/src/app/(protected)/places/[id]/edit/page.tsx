"use client";

import { useEffect } from "react";
import { Loader } from "@/components/ui/common/Loader";
import { useParams, useRouter } from "next/navigation";
import { PlaceEditPage } from "@/components/places/PlaceEditPage/PlaceEditPage";
import { PlaceResponseData } from "@/types/api";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";
import { useGetPlaceQuery } from "@/store/api";
import { notify } from "@/lib/utils/notify";

export default function PlaceEditPageServer() {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetPlaceQuery(+id);

  useEffect(() => {
    if (error) {
      router.push("/places");
      notify(error.message || "Не удалось загрузить место", "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      {isLoading || !data ? (
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
