import { enqueueSnackbar } from "notistack";

type NotifyType = "success" | "error" | "warning" | "info";

export const notify = (message: string, type: NotifyType = "info") => {
  enqueueSnackbar(message, { variant: type });
};
