import { Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface LabelVisitedProps {
  className?: string;
  withIcon?: boolean;
}

export const LabelVisited = ({
  className = "",
  withIcon = false,
}: LabelVisitedProps) => (
  <Chip
    {...(withIcon && { icon: <VisibilityIcon /> })}
    label="Посещено"
    color="primary"
    size="small"
    className={className}
  />
);
