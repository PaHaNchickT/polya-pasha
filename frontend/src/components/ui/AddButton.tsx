import { FC } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

export const AddButton: FC = () => {
  const handleClick = () => {
    console.log("add");
  };

  return (
    <IconButton onClick={handleClick} aria-label="add">
      <AddIcon />
    </IconButton>
  );
};
