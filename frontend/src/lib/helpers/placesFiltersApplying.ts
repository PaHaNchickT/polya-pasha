import { Place, PlaceActivityType, PlacesFilterParams } from "@/types/place";

export const placesFiltersApplying = (
  data: Place[],
  activityType: PlaceActivityType | "all",
  filters: PlacesFilterParams,
): Place[] => {
  return data.filter((place) => {
    // Фильтр по типу активности
    if (activityType !== "all" && !place.activityType.includes(activityType)) {
      return false;
    }

    // Фильтр по типу локации
    if (
      filters.locationType !== "all" &&
      place.locationType !== filters.locationType
    ) {
      return false;
    }

    // Фильтр по типу местности
    if (filters.coverType !== "all" && place.coverType !== filters.coverType) {
      return false;
    }

    // Фильтр по автору
    if (filters.author !== "all" && place.author !== filters.author) {
      return false;
    }

    // Фильтр по посещению
    if (filters.isVisited !== "all") {
      const visited = filters.isVisited === "true";
      if (place.isVisited !== visited) {
        return false;
      }
    }

    return true;
  });
};
