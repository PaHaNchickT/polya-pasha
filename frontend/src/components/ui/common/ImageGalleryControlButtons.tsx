import { clsx as cn } from "clsx";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

interface ImageGalleryControlButtonsProps {
  isFullScreen?: boolean;
  goToPrev: () => void;
  goToNext: () => void;
}

export const ImageGalleryControlButtons = ({
  isFullScreen = false,
  goToPrev,
  goToNext,
}: ImageGalleryControlButtonsProps) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const buttonsProps = [
    {
      onClick: goToPrev,
      horizOffset: !isSmUp && isFullScreen ? "left-[35%]" : "left-[8px]",
      icon: <ChevronLeftIcon />,
    },
    {
      onClick: goToNext,
      horizOffset: !isSmUp && isFullScreen ? "right-[35%]" : "right-[8px]",
      icon: <ChevronRightIcon />,
    },
  ];

  return (
    <>
      {buttonsProps.map((item, idx) => (
        <IconButton
          key={idx}
          className={cn(
            "gallery-buttons invert !absolute top-[50%] -translate-y-1/2 opacity-[0.7] !transition !duration-200 !bg-black/75 hover:!bg-black/95",
            item.horizOffset,
          )}
          onClick={item.onClick}
        >
          {item.icon}
        </IconButton>
      ))}
    </>
  );
};
