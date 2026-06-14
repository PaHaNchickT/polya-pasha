"use client";

import {
  LoginResponseData,
  PlacePostData,
  PlaceResponseData,
} from "@/types/api";
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from "./constants/common";
import { LoginData } from "@/types/login";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Вспомогательная функция для защищённых запросов ---
const authFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.error || `Request failed with status ${res.status}`,
    );
  }

  return res.json();
};

// POST /api/login – логин
const login = async (loginData: LoginData): Promise<LoginResponseData> => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Ошибка входа");
  }

  const data: LoginResponseData = await res.json();

  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
  localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, data.user.login);

  return data;
};

// POST /api/logout – разлогин
const logout = async (): Promise<void> => {
  try {
    await authFetch("/api/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    window.location.href = "/login";
  }
};

// GET /api/places – список всех мест
const getPlaces = async (): Promise<PlaceResponseData[]> => {
  return authFetch<PlaceResponseData[]>("/api/places");
};

// GET /api/places/:id – одно место
const getPlace = async (id: number): Promise<PlaceResponseData> => {
  return authFetch<PlaceResponseData>(`/api/places/${id}`);
};

// POST /api/places – создать новое место
const createPlace = async (data: PlacePostData): Promise<PlaceResponseData> => {
  return authFetch<PlaceResponseData>("/api/places", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// PATCH /api/places/:id – обновить место (только разрешённые поля)
const updatePlace = async (
  id: number,
  data: Partial<PlacePostData>,
): Promise<PlaceResponseData> => {
  return authFetch<PlaceResponseData>(`/api/places/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// DELETE /api/places/:id – удалить одно место
const deletePlace = async (id: number): Promise<void> => {
  await authFetch(`/api/places/${id}`, { method: "DELETE" });
};

// DELETE /api/places – удалить несколько мест (массив id в теле)
const deletePlaces = async (ids: number[]): Promise<{ deleted: number }> => {
  return authFetch<{ deleted: number }>("/api/places", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
};

export const api = {
  login,
  logout,
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  deletePlaces,
};
