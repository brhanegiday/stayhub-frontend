"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordMutation } from "@/store/api/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Home, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPassword(data).unwrap();
            setEmailSent(true);
            toast.success("Password reset email sent successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send reset email");
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
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

                    <Card className="shadow-xl">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Email Sent!</h2>
                                    <p className="text-muted-foreground">
                                        We've sent password reset instructions to{" "}
                                        <span className="font-medium text-foreground">{getValues("email")}</span>
                                    </p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                                    <div className="flex items-start space-x-2">
                                        <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-foreground">Check your email</p>
                                            <p>Click the reset link in the email to create a new password. If you don't see it, check your spam folder.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <Button asChild className="w-full">
                                        <Link href="/login">Back to Sign In</Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setEmailSent(false)}
                                        className="w-full"
                                    >
                                        Try Different Email
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
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

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
                        <CardDescription>
                            No worries! Enter your email address and we'll send you instructions to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    {...register("email")}
                                    className={errors.email ? "border-destructive" : ""}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Reset Instructions
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

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