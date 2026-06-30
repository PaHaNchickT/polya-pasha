import { clsx as cn } from "clsx";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ImageGalleryControlButtonProps {
  direction: "left" | "right";
  horizOffset: string;
  onClick: () => void;
}

export const ImageGalleryControlButton = ({
  direction,
  horizOffset,
  onClick,
}: ImageGalleryControlButtonProps) => (
  <IconButton
    className={cn(
      "gallery-buttons invert !absolute top-[50%] -translate-y-1/2 opacity-[0.7] !transition !duration-200 !bg-black/75 hover:!bg-black/95",
      horizOffset,
    )}
    onClick={onClick}
  >
    {direction === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
  </IconButton>
);
