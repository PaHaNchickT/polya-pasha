import { Box, Modal as MUIModal } from "@mui/material";
import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, handleClose, children }: ModalProps) => {
  return (
    <MUIModal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "15px",
          boxShadow: 24,
          p: 4,
        }}
      >
        {children}
      </Box>
    </MUIModal>
  );
};
