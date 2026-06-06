import { ModalMode } from "@/types/usersTable";
import { Button } from "@mui/material";

type UserFormActionButtonsProps = {
  mode: ModalMode;
  onSave: () => void;
};

export const UserFormActionButtons = ({
  mode,
  onSave,
}: UserFormActionButtonsProps) => (
  <div className="w-full flex gap-4">
    <Button
      onClick={onSave}
      variant="contained"
      color="secondary"
      className="grow"
    >
      Отмена
    </Button>
    <Button type="submit" variant="contained" color="primary" className="grow">
      {mode === "create" ? "Создать" : "Сохранить"}
    </Button>
  </div>
);
