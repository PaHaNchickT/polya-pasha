import { Chip } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { clsx as cn } from "clsx";

interface LabelNewProps {
  className?: string;
  withIcon?: boolean;
}

export const LabelNew = ({
  className = "",
  withIcon = false,
}: LabelNewProps) => (
  <Chip
    {...(withIcon && { icon: <NewReleasesIcon /> })}
    label="Новое"
    color="success"
    size="small"
    className={cn(
      "flex items-center gap-1 bg-[#2e7d32] px-2 py-0.5",
      className,
    )}
  />
);
