import React, { FC, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteWithConfirmButtonProps {
  onDelete: () => void | Promise<void>;
  buttonText?: string;
  dialogTitle?: string;
  dialogContentText?: string;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  color?: "error";
  withIcon?: boolean;
}

export const DeleteWithConfirmButton: FC<DeleteWithConfirmButtonProps> = ({
  onDelete,
  buttonText = "Удалить",
  dialogTitle = "Подтверждение удаления",
  dialogContentText = "Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.",
  confirmText = "Удалить",
  cancelText = "Отмена",
  disabled = false,
  color = "error",
  withIcon = true,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color={color}
        size="large"
        onClick={handleOpen}
        startIcon={withIcon ? <DeleteIcon /> : undefined}
        disabled={disabled}
      >
        {buttonText}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {dialogContentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="gap-2">
          <Button onClick={handleClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            color={color}
            variant="contained"
            disabled={loading}
            autoFocus
            className="!ml-0"
          >
            {loading ? "Удаление…" : confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
