import { User } from "./user";

export type UserState = {
  users: User[];
  loadInitial: () => void;
  addUser: (u: User) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  checkBeforeDeletion: (id: string) => DeleteCheckResult;
  deleteUser: (id: string) => void;
  getUserById: (id: string | null) => User | null;
};

export type DeleteCheckResult =
  | { type: "ok" }
  | { type: "hasManager"; manager: User }
  | { type: "hasSubordinates"; subordinates: User[] }
  | { type: "hasBoth"; manager: User; subordinates: User[] };
