"use client";

import { useRequireAuth } from "@/hooks/use-auth-redirect";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const { isAuthenticated, status } = useRequireAuth();

    if (status === "loading") {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            )
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in the hook
    }

    return <>{children}</>;
}
