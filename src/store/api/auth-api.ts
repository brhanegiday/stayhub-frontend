/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";

export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: "renter" | "host";
    phone?: string;
    bio?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface GoogleAuthRequest {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
    role: "renter" | "host";
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    errors?: any[];
}

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

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        googleAuth: builder.mutation<ApiResponse<AuthResponse>, GoogleAuthRequest>({
            query: (credentials) => ({
                url: "/auth/google",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),

        getMe: builder.query<ApiResponse<{ user: User }>, void>({
            query: () => "/auth/me",
            providesTags: ["User"],
        }),

        updateProfile: builder.mutation<ApiResponse<{ user: User }>, { phone?: string; bio?: string }>({
            query: (data) => ({
                url: "/auth/profile",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        logout: builder.mutation<ApiResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const { useGoogleAuthMutation, useGetMeQuery, useUpdateProfileMutation, useLogoutMutation } = authApi;
