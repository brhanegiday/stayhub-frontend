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

export interface Location {
    address: string;
    city: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface Property {
    id: string;
    title: string;
    description: string;
    pricePerNight: number;
    location: Location;
    images: string[];
    amenities: string[];
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    propertyType: "apartment" | "house" | "villa" | "condo" | "studio";
    hostId: string;
    host?: User;
    isActive: boolean;
    rules: string[];
    checkInTime: string;
    checkOutTime: string;
    createdAt: string;
    updatedAt: string;
}

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
    createdAt: string;
    updatedAt: string;
    numberOfNights?: number;
}

export interface PropertyFilters {
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: Property["propertyType"];
    bedrooms?: number;
    maxGuests?: number;
    search?: string;
    page?: number;
    limit?: number;
}

export interface BookingFilters {
    status?: Booking["status"];
    page?: number;
    limit?: number;
}
