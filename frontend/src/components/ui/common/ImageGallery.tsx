import { useState } from "react";
import { CardMedia, Dialog, DialogContent, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

interface ImageGalleryProps {
  images: { uri: string; name: string; type: string }[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const currentImage = images[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {Boolean(images.length && images) ? (
        <>
          <div className="group relative h-full overflow-hidden">
            <CardMedia
              component="img"
              alt={currentImage.name || "Place image"}
              image={currentImage.uri}
              className="!aspect-video !w-full !h-full !object-cover cursor-pointer"
              onClick={handleOpen}
            />

            {/* Кнопки листания */}
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

            {/* Индикатор текущего слайда */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-1.5 py-0.5 rounded text-xs">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Модальное окно с оригинальным размером */}
          <Dialog open={open} onClose={handleClose} maxWidth="lg">
            <DialogContent sx={{ p: 0, textAlign: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage.uri}
                alt={currentImage.name || "Full size"}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="h-full flex items-center justify-center">
          <ImageNotSupportedIcon color="disabled" fontSize="large" />
        </div>
      )}
    </>
  );
};
