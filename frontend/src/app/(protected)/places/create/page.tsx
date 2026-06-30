"use client";

import { PlaceCreatePage } from "@/components/places/PlaceCreatePage/PlaceCreatePage";
import { Loader } from "@/components/ui/common/Loader";
import { useVerifyTokenQuery } from "@/store/api";

export default function PlacesCreatePageServer() {
  const { isLoading } = useVerifyTokenQuery();

  return <>{isLoading ? <Loader /> : <PlaceCreatePage />}</>;
}
