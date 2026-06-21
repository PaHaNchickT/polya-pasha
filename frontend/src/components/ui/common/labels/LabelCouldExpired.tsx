import { Chip } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { format } from "date-fns";
import { useMemo } from "react";
import { ru } from "date-fns/locale";

interface LabelCouldExpiredProps {
  eventDate: string;
  className?: string;
  withIcon?: boolean;
}

export const LabelCouldExpired = ({
  eventDate,
  className = "",
  withIcon = false,
}: LabelCouldExpiredProps) => {
  const formattedDate = useMemo(
    () => format(new Date(eventDate), "d MMMM", { locale: ru }),
    [eventDate],
  );

  return (
    <Chip
      {...(withIcon && { icon: <EventBusyIcon /> })}
      label={`До ${formattedDate}`}
      color="error"
      size="small"
      className={className}
    />
  );
};
