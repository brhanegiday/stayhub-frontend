export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: "renter" | "host";
    phone?: string;
    bio?: string;
    location?: string;
    dateOfBirth?: string;
    isVerified: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface GoogleAuthRequest {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
    role: "renter" | "host";
}

export interface LoginRequest {
    email: string;
    password: string;
    role: "renter" | "host";
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: "renter" | "host";
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    errors?: unknown[];
}
