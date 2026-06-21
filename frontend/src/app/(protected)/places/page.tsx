"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlacesPage } from "@/components/places/PlacesPage/PlacesPage";
import { Loader } from "@/components/ui/common/Loader";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";
import { useGetPlacesQuery } from "@/store/api";
import { notify } from "@/lib/utils/notify";
import type { GetPlacesParams } from "@/types/api";
import { placesSearchParamsBuilder } from "@/lib/helpers/placesSearchParamsBuilder";

export default function PlacesPageServer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialParams: GetPlacesParams = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 12,
    sort: (searchParams.get("sort") as "title" | "created_at") || "created_at",
    order: (searchParams.get("order") as "asc" | "desc") || "desc",

    search: searchParams.get("search") || undefined,

    activity_type: searchParams.get("activity_type") || undefined,
    location_type: searchParams.get("location_type") || undefined,
    cover_type: searchParams.get("cover_type") || undefined,
    author: searchParams.get("author") || undefined,

    is_visited: Boolean(searchParams.get("is_visited")) || undefined,
    event_date: Boolean(searchParams.get("event_date")) || undefined,
    is_expired: Boolean(searchParams.get("is_expired")) || undefined,
  };

  const [params, setParams] = useState<GetPlacesParams>(initialParams);
  const { data, error, isLoading, isFetching } = useGetPlacesQuery(params);

  // Синхронизация параметров с URL (чтобы можно было делиться ссылкой)
  useEffect(() => {
    const newUrl = `?${placesSearchParamsBuilder(params).toString()}`;

    if (window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [params, router]);

  // Обработчик ошибок
  useEffect(() => {
    if (error) {
      notify(error.message || "Не удалось загрузить список мест", "error");
    }
  }, [error]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const setFilter = useCallback(
    (key: keyof GetPlacesParams, value: string | boolean | undefined) => {
      setParams((prev) => ({
        ...prev,
        [key]: value === "all" ? undefined : value,
        page: 1,
      }));
    },
    [],
  );

  // На будущее
  // const setSorting = useCallback(
  //   (sort: "title" | "created_at", order: "asc" | "desc") => {
  //     setParams((prev) => ({ ...prev, sort, order }));
  //   },
  //   [],
  // );

  return (
    <>
      {isLoading || !data ? (
        <Loader />
      ) : (
        <PlacesPage
          data={data.data.map((item) => transformPlaceData(item))}
          meta={data.meta}
          params={params}
          isFetching={isFetching}
          onPageChange={setPage}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
        />
      )}
    </>
  );
}
