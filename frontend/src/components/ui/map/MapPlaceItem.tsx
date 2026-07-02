import { notify } from "@/lib/utils/notify";
import { useGetPlaceQuery } from "@/store/api";
import { useEffect } from "react";
import { PlaceItem } from "../places/PlaceItem";
import { transformPlaceData } from "@/lib/helpers/transformPlaceData";
import { PlaceResponseData } from "@/types/api";
import { PlaceItemSkeleton } from "../places/PlaceItemSkeleton";

interface MapPlaceItemProps {
  selectedId: number;
  setSelectedId: (value: number | null) => void;
}

export const MapPlaceItem = ({
  selectedId,
  setSelectedId,
}: MapPlaceItemProps) => {
  const { data, error, isLoading, isFetching } = useGetPlaceQuery(selectedId);

  console.log(data);

  useEffect(() => {
    if (error) {
      setSelectedId(null);
      notify(error.message || "Не удалось загрузить место", "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="w-full sm:w-1/2">
      {isLoading || isFetching ? (
        <PlaceItemSkeleton />
      ) : (
        <PlaceItem item={transformPlaceData(data as PlaceResponseData)} />
      )}
    </div>
  );
};
