import { useCallback, useEffect, useState } from "react";
import { CardMedia, Dialog, DialogContent } from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { ImageData } from "@/types/place";
import { ImageGalleryControlButtons } from "./ImageGalleryControlButtons";

interface ImageGalleryProps {
  images: ImageData[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const currentImage = images[currentIndex];

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToPrev, goToNext]);

  return (
    <>
      {Boolean(images.length) ? (
        <>
          {/* Превью */}
          <div className="group relative h-full overflow-hidden">
            <CardMedia
              component="img"
              alt={currentImage.name || "Place image"}
              image={currentImage.uri}
              className="!aspect-video !w-full !h-full !object-cover cursor-pointer"
              onClick={handleOpen}
            />

            {images.length > 1 && (
              <ImageGalleryControlButtons
                goToPrev={goToPrev}
                goToNext={goToNext}
              />
            )}

            {/* Индикатор текущего слайда */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-1.5 py-0.5 rounded text-xs">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Полноразмерный просмотр */}
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            BackdropProps={{
              sx: {
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            }}
          >
            <DialogContent sx={{ p: 0, textAlign: "center" }}>
              <div className="relative w-full sm:h-[90vh]">
                <CardMedia
                  component="img"
                  alt={currentImage.name || "Full size Place Image"}
                  image={currentImage.uri}
                  className="max-w-full max-h-[90vh] object-contain"
                />
              </div>
            </DialogContent>

            {images.length > 1 && (
              <div className="fixed bottom-[30px] sm:top-1/2 left-0 right-0 -translate-y-1/2 z-[999]">
                <ImageGalleryControlButtons
                  isFullScreen={open}
                  goToPrev={goToPrev}
                  goToNext={goToNext}
                />
              </div>
            )}
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
