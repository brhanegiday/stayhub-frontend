import { Booking, BookingFilters, BookingsResponse, CreateBookingRequest } from "@/types/booking";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";
import { ApiResponse } from "./auth-api";

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

export const bookingsApi = createApi({
    reducerPath: "bookingsApi",
    baseQuery,
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

        cancelBooking: builder.mutation<ApiResponse<{ booking: Booking }>, { id: string; cancellationReason?: string }>(
            {
                query: ({ id, cancellationReason }) => ({
                    url: `/bookings/${id}/cancel`,
                    method: "PUT",
                    body: { cancellationReason },
                }),
                invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }, "Booking"],
            }
        ),
    }),
});

export const {
    useGetUserBookingsQuery,
    useGetBookingQuery,
    useCreateBookingMutation,
    useUpdateBookingStatusMutation,
    useCancelBookingMutation,
} = bookingsApi;
