/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/auth";
import { Booking, BookingFilters, BookingsResponse, CreateBookingRequest } from "@/types/booking";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
    

export const bookingsApi = createApi({
    reducerPath: "bookingsApi",
    baseQuery:baseQuery,
    tagTypes: ["Booking"],
    endpoints: (builder) => ({
        getUserBookings: builder.query<ApiResponse<BookingsResponse>, BookingFilters>({
            query: (filters = {}) => {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== "") {
                        params.append(key, value.toString());
                    }
                });
                return `/bookings?${params.toString()}`;
            },
            providesTags: ["Booking"],
        }),

        getBooking: builder.query<ApiResponse<{ booking: Booking }>, string>({
            query: (id) => `/bookings/${id}`,
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),

        createBooking: builder.mutation<ApiResponse<{ booking: Booking }>, CreateBookingRequest>({
            query: (data) => ({
                url: "/bookings",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),

        updateBookingStatus: builder.mutation<
            ApiResponse<{ booking: Booking }>,
            { id: string; status: Booking["status"]; cancellationReason?: string }
        >({
            query: ({ id, ...data }) => ({
                url: `/bookings/${id}/status`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }, "Booking"],
        }),

        cancelBooking: builder.mutation<ApiResponse<{ booking: Booking }>, string>({
            query: (id) => ({
                url: `/bookings/${id}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Booking", id }, "Booking"],
        }),

        updateBooking: builder.mutation<ApiResponse<{ booking: Booking }>, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/bookings/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }, "Booking"],
        }),

        // Host specific endpoints
        getHostBookings: builder.query<ApiResponse<{ bookings: Booking[]; pagination: any }>, {
            page?: number;
            limit?: number;
            status?: string;
            search?: string;
        }>({
            query: (params) => ({
                url: "/bookings/host",
                params,
            }),
            providesTags: ["Booking"],
        }),

        // Renter specific endpoints
        getRenterBookings: builder.query<ApiResponse<{ bookings: Booking[]; pagination: any }>, {
            page?: number;
            limit?: number;
            status?: string;
            search?: string;
        }>({
            query: (params) => ({
                url: "/bookings/renter",
                params,
            }),
            providesTags: ["Booking"],
        }),

        getRenterDashboard: builder.query<ApiResponse<{
            totalBookings: number;
            upcomingBookings: number;
            completedBookings: number;
            totalSpent: number;
            favoriteProperties: number;
        }>, void>({
            query: () => "/bookings/renter/dashboard",
        }),
    }),
});

export const {
    useGetUserBookingsQuery,
    useGetBookingQuery,
    useCreateBookingMutation,
    useUpdateBookingStatusMutation,
    useCancelBookingMutation,
    useUpdateBookingMutation,
    useGetHostBookingsQuery,
    useGetRenterBookingsQuery,
    useGetRenterDashboardQuery,
} = bookingsApi;
