/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
import {
    ApiResponse,
    AuthResponse,
    ForgotPasswordRequest,
    GoogleAuthRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    User,
} from "@/types/auth";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),

        register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
        }),

        forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
            query: (data) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: data,
            }),
        }),

        resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: data,
            }),
        }),

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

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGoogleAuthMutation,
    useGetMeQuery,
    useUpdateProfileMutation,
    useLogoutMutation,
} = authApi;
