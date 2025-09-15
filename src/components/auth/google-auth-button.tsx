/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useGoogleAuthMutation } from "@/store/api/auth-api";
import { setCredentials } from "@/store/slices/auth-slice";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface GoogleAuthButtonProps {
    role: "renter" | "host";
    onSuccess?: () => void;
}

export function GoogleAuthButton({ role, onSuccess }: GoogleAuthButtonProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [googleAuth, { isLoading }] = useGoogleAuthMutation();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleAuth = async () => {
        try {
            setIsGoogleLoading(true);

            // Simulate Google OAuth flow (replace with actual Google OAuth)
            // In a real app, you'd use Google OAuth SDK or NextAuth.js
            const mockGoogleUser = {
                googleId: `google_${Date.now()}`,
                email: `user_${Date.now()}@gmail.com`,
                name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
                avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
                role: role,
            };

            const response = await googleAuth(mockGoogleUser).unwrap();

            if (response.success && response.data) {
                dispatch(
                    setCredentials({
                        user: response.data.user,
                        token: response.data.token,
                    })
                );

                toast.success(`Welcome ${response.data.user.name}!`);
                onSuccess?.();

                // Redirect based on role
                if (role === "host") {
                    router.push("/host/dashboard");
                } else {
                    router.push("/");
                }
            }
        } catch (error: any) {
            console.error("Google auth error:", error);
            toast.error(error.data?.message || "Authentication failed");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <Button
            onClick={handleGoogleAuth}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            size="lg"
        >
            {isLoading || isGoogleLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
            )}
            Continue with Google
        </Button>
    );
}
