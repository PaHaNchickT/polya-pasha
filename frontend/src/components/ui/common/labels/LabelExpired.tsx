import { Chip } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";

interface LabelExpiredProps {
  className?: string;
  withIcon?: boolean;
}

export const LabelExpired = ({
  className = "",
  withIcon = false,
}: LabelExpiredProps) => (
  <Chip
    {...(withIcon && { icon: <EventBusyIcon /> })}
    label="Прошло"
    color="error"
    size="small"
    className={className}
  />
);
