import { persist } from "zustand/middleware";
import { create } from "zustand";

import { seedUsers } from "@/data/users";
import { DeleteCheckResult, UserState } from "@/types/store";

import { checkBeforeDeletion } from "./helpers/checkBeforeDeletion";

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      loadInitial: () => {
        if (get().users.length === 0) {
          set({ users: seedUsers });
        }
      },

      addUser: (u) => set((s) => ({ users: [u, ...s.users] })),

      updateUser: (id, patch) =>
        set((s) => ({
          users: s.users.map((user) =>
            user.id === id ? { ...user, ...patch } : user
          ),
        })),

      checkBeforeDeletion: (userId: string): DeleteCheckResult => {
        const users = get().users;

        return checkBeforeDeletion(users, userId);
      },

      deleteUser: (userId: string) => {
        const users = get().users;

        const updatedUsers = users
          .filter((u) => u.id !== userId)
          .map((u) => (u.managerId === userId ? { ...u, managerId: null } : u));

        set({ users: updatedUsers });
      },

      getUserById: (id: string | null) =>
        get().users.find((u) => u.id === id) ?? null,
    }),

    { name: "users-storage" }
  )
);
