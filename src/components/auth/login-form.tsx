/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { useLoginMutation } from "@/store/api/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["host", "renter"]),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            role: "renter",
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data).unwrap();
            toast.success("Welcome back!");

            // Redirect based on role
            if (data.role === "host") {
                router.push("/host/dashboard");
            } else {
                router.push("/");
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to sign in";

            // Handle specific error cases
            if (errorMessage.includes("verify") || errorMessage.includes("verification")) {
                toast.error("Please verify your email before signing in");
                router.push("/verify-email");
            } else if (errorMessage.includes("credentials") || errorMessage.includes("password")) {
                toast.error("Invalid email or password");
            } else {
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Role Selection */}
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label className="text-base font-medium">I am a...</Label>
                        <RadioGroup
                            value={selectedRole}
                            onValueChange={(value) => setValue("role", value as "host" | "renter")}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="renter" id="renter" className="sr-only" />
                                <Label
                                    htmlFor="renter"
                                    className={`
                                        flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                                        ${
                                            selectedRole === "renter"
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border hover:border-primary/50"
                                        }
                                    `}
                                >
                                    <User className="w-8 h-8 mb-2" />
                                    <span className="font-medium">Guest</span>
                                    <span className="text-xs text-center text-muted-foreground mt-1">
                                        I want to book properties
                                    </span>
                                </Label>
                            </div>

                            <div>
                                <RadioGroupItem value="host" id="host" className="sr-only" />
                                <Label
                                    htmlFor="host"
                                    className={`
                                        flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                                        ${
                                            selectedRole === "host"
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border hover:border-primary/50"
                                        }
                                    `}
                                >
                                    <Mail className="w-8 h-8 mb-2" />
                                    <span className="font-medium">Host</span>
                                    <span className="text-xs text-center text-muted-foreground mt-1">
                                        I want to list my properties
                                    </span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            {/* Login Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...register("email")}
                                className={errors.email ? "border-red-500" : ""}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className={errors.password ? "border-red-500" : ""}
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:text-primary/80 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <GoogleAuthButton role={selectedRole} />

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
