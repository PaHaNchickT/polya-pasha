import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import { PlacesFilterParams } from "@/types/place";
import { PlaceTypeSelect } from "../form/PlaceTypeSelect";
import { PlaceCoverSelect } from "../form/PlaceCoverSelect";
import { AuthorSelect } from "../form/AuthorSelect";
import { IsVisitedSelect } from "../form/IsVisitedSelect";
import { camelToSnake } from "@/lib/helpers/camelToSnake";
import { IsEventDateSelect } from "../form/IsEventDateSelect";
import { IsExpiredSelect } from "../form/IsExpiredSelect";
import { GetMapParams } from "@/types/map";
import { isEqual } from "lodash";

export const PLACES_FILTERS_DEFAULT_VALUES: PlacesFilterParams = {
  locationType: "all",
  coverType: "all",
  author: "all",
  eventDate: "all",
  isVisited: "all",
  isExpired: "all",
};

interface MapFiltersProps {
  selectedId: number | null;
  filters: PlacesFilterParams;
  onFilterChange: (
    key: keyof GetMapParams,
    value: string | boolean | undefined,
  ) => void;
  handleResetMap: () => void;
  handleResetPlace: () => void;
}

export const MapFilters = ({
  selectedId,
  filters,
  onFilterChange,
  handleResetMap,
  handleResetPlace,
}: MapFiltersProps) => {
  const { control, handleSubmit, reset, watch } = useForm<PlacesFilterParams>({
    defaultValues: filters,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const isFormInInitialState = Object.values(watch()).every(
    (value) => value === "all",
  );
  const isFiltersTheSame = isEqual(filters, watch());

  useEffect(() => {
    reset(filters);
  }, [filters, reset]);

  const onSubmit = (data: PlacesFilterParams) => {
    Object.entries(data).forEach((item) => {
      const [key, value] = item;

      onFilterChange(camelToSnake(key) as keyof GetMapParams, value);
    });
  };

  const handleReset = () => {
    Object.keys(PLACES_FILTERS_DEFAULT_VALUES).forEach((key) => {
      onFilterChange(camelToSnake(key) as keyof GetMapParams, "all");
    });

    reset(PLACES_FILTERS_DEFAULT_VALUES);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-8">
      <div className="flex sm:flex-col gap-2 sm:gap-4 grow">
        {/* Левая колонка */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 grow sm:grow-auto">
          <PlaceTypeSelect
            control={control}
            name="locationType"
            label="Путь"
            isFilter
          />
          <PlaceCoverSelect
            control={control}
            name="coverType"
            label="Местность"
            isFilter
          />
          <AuthorSelect
            control={control}
            name="author"
            label="Автор"
            isFilter
          />
        </div>
        {/* Правая колонка */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 grow sm:grow-auto">
          <IsVisitedSelect
            control={control}
            name="isVisited"
            label="Посещение"
            isFilter
          />
          <IsEventDateSelect
            control={control}
            name="eventDate"
            label="Ограничения по дате"
            isFilter
          />
          <IsExpiredSelect
            control={control}
            name="isExpired"
            label="Прошло ли событие"
            isFilter
          />
        </div>
      </div>
      {/* Кнопки */}
      <div className="flex flex-col justify-between gap-2 sm:gap-4">
        <div className="flex gap-2 sm:gap-4 grow">
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit(onSubmit)}
            className="grow"
            disabled={isFormInInitialState || isFiltersTheSame}
          >
            Применить
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={handleReset}
            className="grow"
            disabled={isFormInInitialState}
          >
            Сбросить фильтры
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 grow">
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={handleResetMap}
          >
            Сбросить карту
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={handleResetPlace}
            disabled={!selectedId}
          >
            Сбросить место
          </Button>
        </div>
      </div>
    </div>
  );
};
