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
