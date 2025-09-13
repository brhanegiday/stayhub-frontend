import { User } from "./auth";

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

export interface CreatePropertyRequest {
    title: string;
    description: string;
    pricePerNight: number;
    location: Location;
    images: string[];
    amenities: string[];
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    propertyType: Property["propertyType"];
    rules: string[];
    checkInTime: string;
    checkOutTime: string;
}

export interface PropertyFilters {
    page?: number;
    limit?: number;
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: Property["propertyType"];
    bedrooms?: number;
    maxGuests?: number;
    search?: string;
}

export interface PropertiesResponse {
    properties: Property[];
    pagination: {
        currentPage: number;
        totalPages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
