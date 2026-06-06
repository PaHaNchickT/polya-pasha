import { LoginResponse, Place } from "@/types/api";
import { LOCAL_STORAGE_TOKEN_KEY } from "./constants/common";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Вспомогательная функция для защищённых запросов ---
async function authFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
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
}

// --- Логин ---
export async function login(
  login: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Ошибка входа");
  }

  const data: LoginResponse = await res.json();
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
  return data;
}

// --- Получить места ---
export async function getPlaces(): Promise<Place[]> {
  return authFetch<Place[]>("/api/places");
}

// --- Выход ---
export async function logout(): Promise<void> {
  try {
    await authFetch("/api/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    window.location.href = "/login";
  }
}
