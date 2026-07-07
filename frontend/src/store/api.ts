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
  PlacesListResponse,
  VerifyTokenResponseData,
  MapResponseData,
  ReviewResponseData,
  ReviewPostData,
} from "@/types/api";
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from "@/lib/constants/common";
import { LoginData } from "@/types/login";
import { notify } from "@/lib/utils/notify";
import { GetPlacesParams } from "@/types/place";
import { GetMapParams } from "@/types/map";
import { GetReviewsParams } from "@/types/reviews";

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
    let message = `Ошибка запроса (статус: ${result.error.status})`;
    const errorData = result.error.data as { error: string; message: string };

    if (typeof errorData === "string") {
      message = errorData;
    } else if (errorData?.error) {
      message = errorData.error;
    } else if (errorData?.message) {
      message = errorData.message;
    }

    if (result.error.status === 401) {
      const isLoginPage =
        typeof window !== "undefined" && window.location.pathname === "/login";
      if (!isLoginPage) {
        notify("Токен недействителен или истек", "error");

        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        window.location.href = "/login";
      }
    }

    return { error: { status: result.error.status, message } };
  }

  return { data: result.data };
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Places", "Place", "Reviews"],
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
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
          window.location.href = "/login";
        }
      },
    }),

    verifyToken: builder.query<VerifyTokenResponseData, void>({
      query: () => "/api/verify-token",
    }),

    // ================= Places =================
    getPlaces: builder.query<PlacesListResponse, GetPlacesParams>({
      query: (params) => {
        // Собираем только переданные параметры
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.sort) searchParams.set("sort", params.sort);
        if (params?.order) searchParams.set("order", params.order);
        if (params?.search) searchParams.set("search", params.search);
        if (params?.activity_type)
          searchParams.set("activity_type", params.activity_type);
        if (params?.location_type)
          searchParams.set("location_type", params.location_type);
        if (params?.cover_type)
          searchParams.set("cover_type", params.cover_type);
        if (params?.author) searchParams.set("author", params.author);
        if (params?.is_visited !== undefined) {
          searchParams.set("is_visited", String(params.is_visited));
        }
        if (params?.event_date)
          searchParams.set("event_date", String(params.event_date));
        if (params?.is_expired)
          searchParams.set("is_expired", String(params.is_expired));

        const queryString = searchParams.toString();
        return `/api/places${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Places" as const, id })),
              "Places",
            ]
          : ["Places"],
    }),

    getPlace: builder.query<PlaceResponseData, number>({
      query: (id) => `/api/places/${id}`,
      providesTags: (_, __, id) => [{ type: "Place", id }],
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
      invalidatesTags: (_, __, { id }) => [{ type: "Place", id }, "Places"],
    }),

    deletePlace: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/places/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Place", id }, "Places"],
    }),

    // ================= Map =================
    getMapPlaces: builder.query<MapResponseData, GetMapParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.set("search", params.search);
        if (params?.activity_type)
          searchParams.set("activity_type", params.activity_type);
        if (params?.location_type)
          searchParams.set("location_type", params.location_type);
        if (params?.cover_type)
          searchParams.set("cover_type", params.cover_type);
        if (params?.author) searchParams.set("author", params.author);
        if (params?.is_visited !== undefined)
          searchParams.set("is_visited", String(params.is_visited));
        if (params?.event_date)
          searchParams.set("event_date", String(params.event_date));
        if (params?.is_expired)
          searchParams.set("is_expired", String(params.is_expired));

        const queryString = searchParams.toString();
        return `/api/map${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Places"], // можно инвалидировать при изменениях мест
    }),

    // ================= Reviews =================
    // Получить все отзывы (опционально фильтр по place_id)
    getReviews: builder.query<ReviewResponseData[], GetReviewsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.place_id !== undefined) {
          searchParams.set("place_id", String(params.place_id));
        }
        const queryString = searchParams.toString();
        return `/api/reviews${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Reviews" as const, id })),
              "Reviews",
            ]
          : ["Reviews"],
    }),

    // Получить один отзыв по ID
    getReview: builder.query<ReviewResponseData, number>({
      query: (id) => `/api/reviews/${id}`,
      providesTags: (_, __, id) => [{ type: "Reviews", id }],
    }),

    // Создать отзыв
    createReview: builder.mutation<ReviewResponseData, ReviewPostData>({
      query: (body) => ({
        url: "/api/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"], // инвалидируем список
    }),

    // Обновить отзыв
    updateReview: builder.mutation<
      ReviewResponseData,
      { id: number; data: Partial<ReviewPostData> }
    >({
      query: ({ id, data }) => ({
        url: `/api/reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Reviews", id }, "Reviews"],
    }),

    // Удалить отзыв
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Reviews", id }, "Reviews"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyTokenQuery,

  useGetPlacesQuery,
  useGetPlaceQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,

  useGetMapPlacesQuery,

  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = api;
