/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";
import { ApiResponse, User } from "@/types/auth";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export interface UpdateUserRequest {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    location?: string;
    dateOfBirth?: string;
}

export interface Favorite {
    id: string;
    userId: string;
    propertyId: string;
    property: any; // Property interface from properties-api
    createdAt: string;
}

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery,
    tagTypes: ["User", "Favorite"],
    endpoints: (builder) => ({
        updateUser: builder.mutation<ApiResponse<User>, UpdateUserRequest>({
            query: ({ id, ...data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        getFavorites: builder.query<
            ApiResponse<{ favorites: Favorite[]; pagination: any }>,
            {
                page?: number;
                limit?: number;
                propertyType?: string;
                search?: string;
            }
        >({
            query: (params) => ({
                url: "/users/favorites",
                params,
            }),
            providesTags: ["Favorite"],
        }),

        addToFavorites: builder.mutation<ApiResponse, string>({
            query: (propertyId) => ({
                url: "/users/favorites",
                method: "POST",
                body: { propertyId },
            }),
            invalidatesTags: ["Favorite"],
        }),

        removeFromFavorites: builder.mutation<ApiResponse, string>({
            query: (propertyId) => ({
                url: `/users/favorites/${propertyId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Favorite"],
        }),

        checkFavorite: builder.query<ApiResponse<{ isFavorite: boolean }>, string>({
            query: (propertyId) => `/users/favorites/check/${propertyId}`,
            providesTags: ["Favorite"],
        }),
    }),
});

export const {
    useUpdateUserMutation,
    useGetFavoritesQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation,
    useCheckFavoriteQuery,
} = usersApi;
