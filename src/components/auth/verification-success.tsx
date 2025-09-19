"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VerificationSuccessProps {
    email?: string;
    showRedirectTimer?: boolean;
}

export function VerificationSuccess({ email, showRedirectTimer = false }: VerificationSuccessProps) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(showRedirectTimer ? 10 : 0);

    useEffect(() => {
        if (showRedirectTimer && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (showRedirectTimer && countdown === 0) {
            router.push("/login");
        }
    }, [countdown, showRedirectTimer, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Check Your Email!
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground mt-2">
                        We&apos;ve sent a verification link to {email && <span className="font-medium text-foreground">{email}</span>}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg p-4 border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    What&apos;s next?
                                </p>
                                <ol className="text-sm text-green-700 dark:text-green-300 space-y-1 list-decimal list-inside">
                                    <li>Check your inbox (and spam folder)</li>
                                    <li>Click the verification link</li>
                                    <li>Start booking amazing places!</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <Button asChild className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0">
                            <Link href="/login" className="flex items-center justify-center">
                                Sign In After Verification
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>

                        {showRedirectTimer && countdown > 0 && (
                            <p className="text-center text-sm text-muted-foreground">
                                Redirecting to sign in page in {countdown} seconds...
                            </p>
                        )}
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Didn&apos;t receive the email?{" "}
                            <Link href="/verify-email" className="text-primary hover:text-primary/80 font-medium">
                                Resend verification
                            </Link>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Need help?{" "}
                            <Link href="/support" className="text-primary hover:text-primary/80 font-medium">
                                Contact support
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}