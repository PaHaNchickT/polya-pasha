import React, { FC, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteWithConfirmButtonProps {
  onDelete: () => void | Promise<void>;
  loading?: boolean;
  buttonText?: string;
  dialogTitle?: string;
  dialogContentText?: string;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  color?: "error";
  withIcon?: boolean;
  isIconOnly?: boolean;
}

export const DeleteWithConfirmButton: FC<DeleteWithConfirmButtonProps> = ({
  onDelete,
  loading,
  buttonText = "Удалить",
  dialogTitle = "Подтверждение удаления",
  dialogContentText = "Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.",
  confirmText = "Удалить",
  cancelText = "Отмена",
  disabled = false,
  color = "error",
  withIcon = true,
  isIconOnly = false,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      await onDelete();
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      {isIconOnly ? (
        <IconButton disabled={disabled} loading={loading}>
          <DeleteIcon color={color} onClick={handleOpen} />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          color={color}
          size="large"
          onClick={handleOpen}
          startIcon={withIcon ? <DeleteIcon /> : undefined}
          disabled={disabled}
          loading={loading}
        >
          {buttonText}
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            margin: 2,
          },
        }}
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
          <Button onClick={handleClose} disabled={loading} loading={loading}>
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
