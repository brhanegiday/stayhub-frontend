/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";

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
                url: `/auth/reset-password/${data.token}`,
                method: "POST",
                body: { password: data.password },
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

        verifyEmail: builder.mutation<ApiResponse, { token: string }>({
            query: ({ token }) => ({
                url: `/auth/verify-email?token=${token}`,
                method: "GET",
            }),
            invalidatesTags: ["User"],
        }),

        resendVerification: builder.mutation<ApiResponse, { email: string }>({
            query: (data) => ({
                url: "/auth/resend-verification",
                method: "POST",
                body: data,
            }),
        }),

        changePassword: builder.mutation<ApiResponse, { currentPassword: string; newPassword: string }>({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: data,
            }),
        }),

        refreshToken: builder.mutation<ApiResponse<{ token: string }>, void>({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
            }),
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
    useVerifyEmailMutation,
    useResendVerificationMutation,
    useChangePasswordMutation,
    useRefreshTokenMutation,
    useGoogleAuthMutation,
    useGetMeQuery,
    useUpdateProfileMutation,
    useLogoutMutation,
} = authApi;
