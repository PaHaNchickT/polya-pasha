"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/ui/common/Loader";
import { useGetMapPlacesQuery } from "@/store/api";
import { useRouter, useSearchParams } from "next/navigation";
import { notify } from "@/lib/utils/notify";
import { GetMapParams } from "@/types/map";
import { MapPage } from "@/components/map/MapPage/MapPage";
import { mapSearchParamsBuilder } from "@/lib/helpers/mapSearchParamsBuilder";

export default function MapPageServer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialParams: GetMapParams = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,

      activity_type: searchParams.get("activity_type") || undefined,
      location_type: searchParams.get("location_type") || undefined,
      cover_type: searchParams.get("cover_type") || undefined,
      author: searchParams.get("author") || undefined,

      is_visited:
        searchParams.get("is_visited") === "true"
          ? "true"
          : searchParams.get("is_visited") === "false"
            ? "false"
            : undefined,
      event_date:
        searchParams.get("event_date") === "true"
          ? "true"
          : searchParams.get("event_date") === "false"
            ? "false"
            : undefined,
      is_expired:
        searchParams.get("is_expired") === "true"
          ? "true"
          : searchParams.get("is_expired") === "false"
            ? "false"
            : undefined,
    }),
    [searchParams],
  );

  const [params, setParams] = useState<GetMapParams>(initialParams);
  const { data, error, isLoading, isFetching } = useGetMapPlacesQuery(params);

  // Синхронизация параметров с URL (чтобы можно было делиться ссылкой)
  useEffect(() => {
    if (!data) return;

    const newUrl = `?${mapSearchParamsBuilder(params).toString()}`;

    if (window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [params, router, data]);

  // Обработчик ошибок
  useEffect(() => {
    if (error) {
      notify(error.message || "Не удалось загрузить карту", "error");
    }
  }, [error]);

  const setFilter = useCallback(
    (key: keyof GetMapParams, value: string | boolean | undefined) => {
      setParams((prev) => ({
        ...prev,
        [key]: value === "all" ? undefined : value,
        page: 1,
      }));
    },
    [],
  );

  return (
    <>
      {isLoading || !data ? (
        <Loader />
      ) : (
        <MapPage
          data={data.data}
          params={params}
          isFetching={isFetching}
          onFilterChange={setFilter}
        />
      )}
    </>
  );
}
