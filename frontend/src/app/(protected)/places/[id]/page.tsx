"use client";

import { useEffect } from "react";
import { Loader } from "@/components/ui/common/Loader";
import { useParams, useRouter } from "next/navigation";
import { PlacePage } from "@/components/places/PlacePage/PlacePage";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";
import { useGetPlaceQuery, useGetReviewsQuery } from "@/store/api";
import { notify } from "@/lib/utils/notify";
import { transformReviewData } from "@/lib/helpers/transformReviewData";

export default function PlacePageServer() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    data: placeData,
    error: placeError,
    isLoading: isPlaceLoading,
  } = useGetPlaceQuery(+id);

  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: isReviewsLoading,
  } = useGetReviewsQuery({ place_id: +id });

  useEffect(() => {
    if (placeError || reviewsError) {
      router.push("/places");
      notify(
        placeError?.message ||
          reviewsError?.message ||
          "Не удалось загрузить место",
        "error",
      );
      console.error(placeError?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeError, reviewsError]);

  return (
    <>
      {isPlaceLoading || isReviewsLoading || !placeData || !reviewsData ? (
        <Loader />
      ) : (
        <PlacePage
          placeData={transformPlaceData(placeData)}
          reviewsData={reviewsData.map((review) => transformReviewData(review))}
        />
      )}
    </>
  );
}
