export type ModalMode = "create" | "edit" | "delete" | null;

export type DeleteStatus = {
  type: null | "ok" | "hasManager" | "hasSubordinates" | "hasBoth";
  errorText: string;
};

export type ModalState = {
  isOpen: boolean;
  mode: ModalMode;
  editingUserId: string | null;
  innerText: string;
};
