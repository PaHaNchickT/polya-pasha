import { USERS_MAP } from "@/lib/constants/users";

export type UserTypes = keyof typeof USERS_MAP;

export type DefaultBooleanKeys = "true" | "false";

export type DefaultSortingOrder = "asc" | "desc";

export type HeaderNavKeys = "places" | "randomizer" | "map";
