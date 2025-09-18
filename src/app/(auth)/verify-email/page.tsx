/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResendVerificationMutation, useVerifyEmailMutation } from "@/store/api/auth-api";
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [verifyEmail] = useVerifyEmailMutation();
    const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

    const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
    const [email, setEmail] = useState("");

    // Auto-verify if token is present in URL
    useEffect(() => {
        if (token) {
            handleVerification();
        }
    }, [token]);

    const handleVerification = async () => {
        if (!token) return;

        try {
            await verifyEmail({ token }).unwrap();
            setVerificationStatus("success");
            toast.success("Email verified successfully!");

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error: any) {
            setVerificationStatus("error");
            toast.error(error?.data?.message || "Email verification failed");
        }
    };

    const handleResendVerification = async () => {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            await resendVerification({ email }).unwrap();
            toast.success("Verification email sent! Please check your inbox.");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send verification email");
        }
    };

    // Auto-verification in progress
    if (token && verificationStatus === "idle") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                            </div>
                        </div>
                        <CardTitle>Verifying Your Email</CardTitle>
                        <CardDescription>Please wait while we verify your email address...</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    // Verification successful
    if (verificationStatus === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <CardTitle>Email Verified!</CardTitle>
                        <CardDescription>
                            Your email has been successfully verified. You can now sign in to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Redirecting to sign in page in 3 seconds...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Verification failed or manual resend
    if (verificationStatus === "error" || !token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <CardTitle>
                            {verificationStatus === "error" ? "Verification Failed" : "Verify Your Email"}
                        </CardTitle>
                        <CardDescription>
                            {verificationStatus === "error"
                                ? "The verification link is invalid or has expired. You can request a new one below."
                                : "Enter your email address to receive a new verification link."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isResending}
                            />
                        </div>

                        <Button onClick={handleResendVerification} disabled={isResending || !email} className="w-full">
                            {isResending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Verification Email
                                </>
                            )}
                        </Button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                                    Sign In
                                </Link>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                                </div>
                            </div>
                            <CardTitle>Loading...</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
