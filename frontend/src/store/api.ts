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
  GetPlacesParams,
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
  tagTypes: ["Places", "Place"],
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
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetPlacesQuery,
  useGetPlaceQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
} = api;
