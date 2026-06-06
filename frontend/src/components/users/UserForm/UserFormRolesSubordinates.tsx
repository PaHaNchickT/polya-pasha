import { UserFormData } from "@/schemas/user";
import { User } from "@/types/user";
import {
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";

type UserFormRolesSubordinatesProps = {
  users: User[];
  selectedSubs: string[];
  potentialSubs: User[];
  setValue: UseFormSetValue<UserFormData>;
};

export const UserFormRolesSubordinates = ({
  users,
  selectedSubs,
  potentialSubs,
  setValue,
}: UserFormRolesSubordinatesProps) => {
  const handleChange = useCallback(
    (event: SelectChangeEvent<string[]>) =>
      setValue("subordinates", event.target.value as unknown as string[]),
    [setValue]
  );

  return (
    <div className="w-full relative">
      <InputLabel
        id="subordinates"
        sx={{ padding: "0 5px", backgroundColor: "white", left: "-5px" }}
      >
        Подчинённые
      </InputLabel>
      <Select
        id="subordinates"
        multiple
        value={selectedSubs}
        onChange={handleChange}
        renderValue={(selected) =>
          users
            .filter((user) => selected.includes(user.id))
            .map((user) => user.name)
            .join(", ")
        }
        className="w-full"
      >
        {potentialSubs.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            <Checkbox checked={selectedSubs.includes(user.id)} />
            <ListItemText primary={user.name} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
