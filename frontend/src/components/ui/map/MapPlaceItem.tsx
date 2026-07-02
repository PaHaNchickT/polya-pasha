import { Button } from "@mui/material";

interface MapPlaceItemProps {
  selectedId: number;
  setSelectedId: (value: number | null) => void;
}

export const MapPlaceItem = ({
  selectedId,
  setSelectedId,
}: MapPlaceItemProps) => {
  const handleReset = () => {
    setSelectedId(null);
  };

  return (
    <div key={selectedId}>
      <Button variant="contained" color="error" onClick={handleReset}>
        Сбросить карту
      </Button>
    </div>
  );
};
