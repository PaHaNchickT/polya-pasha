import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ImageGalleryControlButtonsProps {
  goToPrev: () => void;
  goToNext: () => void;
}

export const ImageGalleryControlButtons = ({
  goToPrev,
  goToNext,
}: ImageGalleryControlButtonsProps) => (
  <>
    <IconButton
      className="gallery-buttons"
      onClick={goToPrev}
      sx={{
        position: "absolute",
        left: 8,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0,0,0,0.75)",
        opacity: 0.7,
        transition: "opacity 0.2s",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.95)",
        },
      }}
    >
      <ChevronLeftIcon />
    </IconButton>

    <IconButton
      className="gallery-buttons"
      onClick={goToNext}
      sx={{
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0,0,0,0.75)",
        opacity: 0.7,
        transition: "opacity 0.2s",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.95)",
        },
      }}
    >
      <ChevronRightIcon />
    </IconButton>
  </>
);
