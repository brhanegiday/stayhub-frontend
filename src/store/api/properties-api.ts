/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreatePropertyRequest, PropertiesResponse, Property, PropertyFilters } from "@/types/property";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";
import { ApiResponse } from "@/types/auth";

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

export const propertiesApi = createApi({
    reducerPath: "propertiesApi",
    baseQuery,
    tagTypes: ["Property", "HostProperties"],
    endpoints: (builder) => ({
        getProperties: builder.query<ApiResponse<PropertiesResponse>, PropertyFilters>({
            query: (filters = {}) => {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== "") {
                        params.append(key, value.toString());
                    }
                });
                return `/properties?${params.toString()}`;
            },
            providesTags: ["Property"],
        }),

        getProperty: builder.query<ApiResponse<{ property: Property; bookings: any[] }>, string>({
            query: (id) => `/properties/${id}`,
            providesTags: (result, error, id) => [{ type: "Property", id }],
        }),

        createProperty: builder.mutation<ApiResponse<{ property: Property }>, CreatePropertyRequest>({
            query: (data) => ({
                url: "/properties",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Property", "HostProperties"],
        }),

        updateProperty: builder.mutation<
            ApiResponse<{ property: Property }>,
            { id: string; data: Partial<CreatePropertyRequest> }
        >({
            query: ({ id, data }) => ({
                url: `/properties/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Property", id }, "Property", "HostProperties"],
        }),

        deleteProperty: builder.mutation<ApiResponse, string>({
            query: (id) => ({
                url: `/properties/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Property", "HostProperties"],
        }),

        getHostProperties: builder.query<ApiResponse<{ properties: Property[]; pagination: any }>, {
            page?: number;
            limit?: number;
            status?: string;
            search?: string;
        }>({
            query: (params) => ({
                url: "/properties/host",
                params,
            }),
            providesTags: ["HostProperties"],
        }),

        getHostDashboard: builder.query<ApiResponse<{
            totalProperties: number;
            totalBookings: number;
            totalRevenue: number;
            averageRating: number;
            occupancyRate: number;
            monthlyRevenue: any[];
        }>, void>({
            query: () => "/properties/host/dashboard",
        }),

        getHostAnalytics: builder.query<ApiResponse<{
            overview: {
                totalRevenue: number;
                totalBookings: number;
                averageRating: number;
                occupancyRate: number;
                viewsToBookingRate: number;
            };
            monthlyRevenue: any[];
            propertyPerformance: any[];
            bookingTrends: any[];
            guestInsights: {
                averageStayDuration: number;
                repeatGuestRate: number;
                averageGroupSize: number;
            };
        }>, void>({
            query: () => "/properties/host/analytics",
        }),
    }),
});

export const {
    useGetPropertiesQuery,
    useGetPropertyQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
    useGetHostPropertiesQuery,
    useGetHostDashboardQuery,
    useGetHostAnalyticsQuery,
} = propertiesApi;
