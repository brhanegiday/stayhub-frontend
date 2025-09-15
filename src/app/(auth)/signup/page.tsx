/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { useRegisterMutation } from "@/store/api/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
        role: z.enum(["host", "renter"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: "renter",
        },
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            // Remove confirmPassword and send firstName/lastName as expected by RTK Query
            const { confirmPassword, ...registerData } = data;

            await register(registerData).unwrap();
            toast.success("Account created successfully! Please check your email to verify your account.");
            router.push("/verify-email");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create account");
        }
    };

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
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                        <CardDescription>Join StayHub and start your journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Lock"
                                    {...formRegister("name")}
                                    className={errors.name ? "border-destructive" : ""}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    {...formRegister("email")}
                                    className={errors.email ? "border-destructive" : ""}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        {...formRegister("password")}
                                        className={errors.password ? "border-destructive pr-10" : "pr-10"}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        {...formRegister("confirmPassword")}
                                        className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>I want to</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        variant={watch("role") === "renter" ? "default" : "outline"}
                                        onClick={() => formRegister("role").onChange({ target: { value: "renter" } })}
                                        className="h-auto py-3 flex-col"
                                    >
                                        <span className="font-semibold">Book Places</span>
                                        <span className="text-xs opacity-70">I want to rent properties</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={watch("role") === "host" ? "default" : "outline"}
                                        onClick={() => formRegister("role").onChange({ target: { value: "host" } })}
                                        className="h-auto py-3 flex-col"
                                    >
                                        <span className="font-semibold">Host Places</span>
                                        <span className="text-xs opacity-70">I want to list properties</span>
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <GoogleAuthButton role={watch("role")} />

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                                Sign in
                            </Link>
                        </p>
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
