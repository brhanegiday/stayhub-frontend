import { User } from "./auth";
import { Property } from "./property";

export interface Booking {
    id: string;
    propertyId: string;
    property?: Property;
    renterId: string;
    renter?: User;
    hostId: string;
    host?: User;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    numberOfGuests: number;
    status: "pending" | "confirmed" | "canceled" | "completed";
    specialRequests?: string;
    paymentStatus: "pending" | "paid" | "refunded";
    cancellationReason?: string;
    canceledAt?: string;
    canceledBy?: string;
    numberOfNights?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookingRequest {
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    specialRequests?: string;
}

export interface BookingFilters {
    page?: number;
    limit?: number;
    status?: Booking["status"];
}

export interface BookingsResponse {
    bookings: Booking[];
    pagination: {
        currentPage: number;
        totalPages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
