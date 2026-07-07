"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Stack,
  IconButton,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { TextInput } from "@/components/ui/form/TextInput";
import { DatePickerInput } from "@/components/ui/form/DatePickerInput";
import {
  ReviewFormData,
  reviewFormSchema,
} from "@/components/ui/reviews/ReviewForm/schema";
import { prepareReviewData } from "@/lib/helpers/prepareReviewData";
import { useCreateReviewMutation, useUpdateReviewMutation } from "@/store/api";
import { notify } from "@/lib/utils/notify";
import { LOCAL_STORAGE_USERNAME_KEY } from "@/lib/constants/common";
import { PlaceAuthorType } from "@/types/place";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { USERS_MAP } from "@/lib/constants/users";

interface ReviewFormProps {
  placeId: number;
  reviewId?: number;
  mode: "create" | "edit";
  defaultValues: ReviewFormData;
  onToggleMode?: () => void;
}

export const ReviewForm = ({
  placeId,
  reviewId = 0,
  mode,
  defaultValues,
  onToggleMode,
}: ReviewFormProps) => {
  const methods = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, control, reset } = methods;

  const [createReview, { isLoading: isCreateLoading }] =
    useCreateReviewMutation();
  const [editReview, { isLoading: isEditLoading }] = useUpdateReviewMutation();

  const author = localStorage.getItem(
    LOCAL_STORAGE_USERNAME_KEY,
  ) as PlaceAuthorType;

  const handleFormSubmit = (data: ReviewFormData) => {
    const postData = prepareReviewData({
      ...data,
      placeId,
      author,
    });

    if (mode === "create") {
      createReview(postData)
        .unwrap()
        .then(() => {
          notify("Отзыв успешно добавлен!", "success");
          reset();
        })
        .catch((err) => {
          notify(err.message, "error");
          console.error(err.message);
        });
    } else {
      editReview({ id: reviewId, data: postData })
        .unwrap()
        .then(() => {
          notify("Отзыв успешно отредактирован!", "success");
          onToggleMode?.();
        })
        .catch((err) => {
          notify(err.message, "error");
          console.error(err.message);
        });
    }
  };

  return (
    <FormProvider {...methods}>
      <Card variant="outlined" className="p-4">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-3"
        >
          <div className="flex justify-between">
            <TextInput
              control={control}
              name="title"
              label="Название отзыва"
              size="small"
              disabled={isCreateLoading || isEditLoading}
            />
            <Stack direction="row" spacing={1} height={40}>
              <IconButton
                aria-label="submit"
                type="submit"
                loading={isCreateLoading || isEditLoading}
              >
                <CheckIcon />
              </IconButton>
              {mode === "edit" && (
                <IconButton
                  aria-label="close"
                  loading={isCreateLoading || isEditLoading}
                  color="error"
                  onClick={onToggleMode}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          </div>
          <TextInput
            control={control}
            name="description"
            label="Описание"
            fullWidth
            size="small"
            disabled={isCreateLoading || isEditLoading}
          />

          <div className="flex justify-between items-end">
            <Box className="flex items-center gap-2">
              <Avatar
                alt={USERS_MAP[author]}
                src={`/images/${author}-avatar.png`}
                className="!w-6 !h-6 text-xs"
              >
                {USERS_MAP[author]?.[0]}
              </Avatar>
              <Typography variant="caption">{USERS_MAP[author]}</Typography>
            </Box>
            <DatePickerInput
              control={control}
              name="visitedAt"
              label="Дата посещения"
              size="small"
              disabled={isCreateLoading}
            />
          </div>
        </form>
      </Card>
    </FormProvider>
  );
};
