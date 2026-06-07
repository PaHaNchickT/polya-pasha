import { FC } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

export const AddButton: FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/places/create");
  };

  return (
    <IconButton onClick={handleClick} aria-label="add">
      <AddIcon />
    </IconButton>
  );
};
