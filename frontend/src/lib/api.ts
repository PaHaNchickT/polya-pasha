"use client";

import { LoginResponse } from "@/types/api";
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from "./constants/common";
import { LoginData } from "@/types/login";
import { Place } from "@/types/place";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Вспомогательная функция для защищённых запросов ---
const authFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  // Создаём объект Headers, который правильно обрабатывает любые ключи
  const headers = new Headers(options.headers);

  // Добавляем Content-Type, если его ещё нет
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Если токен есть, добавляем Authorization
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers, // теперь это Headers, а не литерал
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

// --- Логин ---
const login = async (loginData: LoginData): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Ошибка входа");
  }

  const data: LoginResponse = await res.json();

  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
  localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, data.user.login);

  return data;
};

// --- Выход ---
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

// Получить все места
const getPlaces = async (): Promise<Place[]> => {
  return authFetch<Place[]>("/api/places");
};

// Получить одно место по id
const getPlace = async (id: number): Promise<Place> => {
  return authFetch<Place>(`/api/places/${id}`);
};

// Создать место (отправляем Omit<Place, 'id' | 'created_at' | 'is_new' | 'is_expired'>)
const createPlace = async (
  data: Omit<Place, "id" | "created_at" | "is_new" | "is_expired">,
): Promise<Place> => {
  return authFetch<Place>("/api/places", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Обновить место (можно отправлять только изменённые поля)
const updatePlace = async (
  id: number,
  data: Partial<Omit<Place, "id" | "created_at" | "is_new" | "is_expired">>,
): Promise<Place> => {
  return authFetch<Place>(`/api/places/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// Удалить одно место
const deletePlace = async (id: number): Promise<void> => {
  await authFetch(`/api/places/${id}`, { method: "DELETE" });
};

// Удалить несколько мест (передаём массив id)
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
