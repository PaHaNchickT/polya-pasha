"use client";

import { LOCAL_STORAGE_TOKEN_KEY } from "../constants/common";

export const isAuthentificated = () =>
  Boolean(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY));
