import { Chip } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

interface LabelNewProps {
  className?: string;
  withIcon?: boolean;
}

export const LabelNew = ({ className = "", withIcon = false }: LabelNewProps) => (
  <Chip
    {...(withIcon && { icon: <NewReleasesIcon /> })}
    label="Новое"
    color="success"
    size="small"
    className={className}
  />
);
