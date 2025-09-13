/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useGoogleAuthMutation } from "@/store/api/auth-api";
import { setCredentials } from "@/store/slices/auth-slice";
import { toast } from "sonner";
import { Chrome, Loader2 } from "lucide-react";

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
                <Chrome className="w-5 h-5 mr-2" />
            )}
            Continue with Google
        </Button>
    );
}
