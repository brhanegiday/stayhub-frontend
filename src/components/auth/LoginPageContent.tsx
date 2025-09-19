"use client";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoginForm } from "./login-form";

// Loading component for Suspense fallback
export function LoginPageLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Home className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">StayHub</span>
                    </Link>
                </div>

                {/* Loading skeleton for form */}
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-primary/20 rounded animate-pulse"></div>
                </div>

                <div className="text-center mt-6">
                    <Button variant="ghost" asChild>
                        <Link href="/" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Main login content component
export function LoginPageContent() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Home className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">StayHub</span>
                    </Link>
                </div>
                <LoginForm />
                <div className="text-center mt-6">
                    <Button variant="ghost" asChild>
                        <Link href="/" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
