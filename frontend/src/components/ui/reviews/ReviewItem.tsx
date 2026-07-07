import Typography from "@mui/material/Typography";
import { Review } from "@/types/reviews";
import { Avatar, Box, Card, IconButton, Stack } from "@mui/material";
import { USERS_MAP } from "@/lib/constants/users";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DeleteWithConfirmButton } from "../common/DeleteWithConfirmButton";
import EditIcon from "@mui/icons-material/Edit";
import { ReviewForm } from "./ReviewForm/ReviewForm";
import { useDeleteReviewMutation } from "@/store/api";
import { notify } from "@/lib/utils/notify";

interface ReviewItemProps {
  data: Review;
  placeId: number;
}

export const ReviewItem = ({ data, placeId }: ReviewItemProps) => {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [deleteReview, { isLoading }] = useDeleteReviewMutation();

  const formattedVisitedAt = useMemo(
    () => format(new Date(data.visitedAt), "d MMMM yyyy", { locale: ru }),
    [data.visitedAt],
  );

  const onToggleMode = () => {
    setMode((prev) => (prev === "edit" ? "read" : "edit"));
  };

  const handleDelete = () => {
    deleteReview(data.id)
      .unwrap()
      .then(() => {
        notify("Отзыв успешно удален!", "success");
      })
      .catch((err) => {
        notify(err.message, "error");
        console.error(err.message);
      });
  };

  return (
    <>
      {mode === "read" ? (
        <Card
          variant="outlined"
          className="p-4 flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex flex-col">
            <div className="flex justify-between">
              <Typography variant="h4">{data.title}</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  aria-label="edit"
                  loading={isLoading}
                  onClick={onToggleMode}
                >
                  <EditIcon />
                </IconButton>
                <DeleteWithConfirmButton
                  isIconOnly
                  onDelete={handleDelete}
                  loading={isLoading}
                  dialogContentText="Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить."
                />
              </Stack>
            </div>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {data.description}
            </Typography>
          </div>

          <div className="flex justify-between items-center">
            <Box className="flex items-center gap-2">
              <Avatar
                alt={USERS_MAP[data.author]}
                src={`/images/${data.author}-avatar.png`}
                className="!w-6 !h-6 text-xs"
              >
                {USERS_MAP[data.author]?.[0]}
              </Avatar>
              <Typography variant="caption">
                {USERS_MAP[data.author]}
              </Typography>
            </Box>
            {`Посещено ${formattedVisitedAt}`}
          </div>
        </Card>
      ) : (
        <ReviewForm
          placeId={placeId}
          reviewId={data.id}
          mode="edit"
          defaultValues={data}
          onToggleMode={onToggleMode}
        />
      )}
    </>
  );
};
