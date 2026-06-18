import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  CustomError,
  LoginResponseData,
  PlacePostData,
  PlaceResponseData,
} from "@/types/api";
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from "@/lib/constants/common";
import { LoginData } from "@/types/login";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Кастомный baseQuery с добавлением токена и обработкой 401
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  CustomError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    // Формируем читаемое сообщение
    let message = `Ошибка запроса (статус: ${result.error.status})`;
    const errorData = result.error.data as { error: string; message: string };

    if (typeof errorData === "string") {
      message = errorData;
    } else if (errorData?.error) {
      message = errorData.error;
    } else if (errorData?.message) {
      message = errorData.message;
    }

    // Обработка 401
    if (result.error.status === 401) {
      const isLoginPage =
        typeof window !== "undefined" && window.location.pathname === "/login";
      if (!isLoginPage) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        window.location.href = "/login";
      }
    }

    return { error: { status: result.error.status, message } };
  }

  // Успех – возвращаем data
  return { data: result.data };
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Places", "Place"], // теги для инвалидации кэша
  endpoints: (builder) => ({
    // ================= Auth =================
    login: builder.mutation<LoginResponseData, LoginData>({
      query: (credentials) => ({
        url: "/api/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
          localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, data.user.login);
        } catch {}
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/logout",
        method: "POST",
      }),
      // после разлогина чистим токен и редиректим
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
          window.location.href = "/login";
        }
      },
    }),

    // ================= Places =================
    getPlaces: builder.query<PlaceResponseData[], void>({
      query: () => "/api/places",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Places" as const, id })),
              "Places",
            ]
          : ["Places"],
    }),

    getPlace: builder.query<PlaceResponseData, number>({
      query: (id) => `/api/places/${id}`,
      providesTags: (_, __, id) => [{ type: "Places", id }],
    }),

    createPlace: builder.mutation<PlaceResponseData, PlacePostData>({
      query: (body) => ({
        url: "/api/places",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Places"],
    }),

    updatePlace: builder.mutation<
      PlaceResponseData,
      { id: number; data: Partial<PlacePostData> }
    >({
      query: ({ id, data }) => ({
        url: `/api/places/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Places", id }, "Places"],
    }),

    deletePlace: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/places/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Places", id }, "Places"],
    }),

    // ================= Upload =================
    uploadImages: builder.mutation<{ urls: string[] }, FormData>({
      query: (formData) => ({
        url: "/api/upload",
        method: "POST",
        body: formData,
        // Не устанавливаем Content-Type, fetch сам добавит с boundary для FormData
        formData: true,
      }),
    }),
  }),
});

// Готовые хуки для использования в компонентах
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetPlacesQuery,
  useGetPlaceQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useUploadImagesMutation,
} = api;
