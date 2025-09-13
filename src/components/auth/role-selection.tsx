/* eslint-disable react/no-unescaped-entities */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home } from "lucide-react";
import { useState } from "react";
import { GoogleAuthButton } from "./google-auth-button";

interface RoleSelectionProps {
    onRoleSelect?: (role: "renter" | "host") => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
    const [selectedRole, setSelectedRole] = useState<"renter" | "host" | null>(null);

    const roles = [
        {
            id: "renter" as const,
            title: "Find a place to stay",
            description: "Book unique accommodations from verified hosts worldwide",
            icon: Home,
            features: ["Browse properties", "Book instantly", "Secure payments", "24/7 support"],
        },
        {
            id: "host" as const,
            title: "Become a host",
            description: "Earn money by hosting travelers on your property",
            icon: Building,
            features: ["List your space", "Set your price", "Manage bookings", "Earn income"],
        },
    ];

    const handleRoleSelect = (role: "renter" | "host") => {
        setSelectedRole(role);
        onRoleSelect?.(role);
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Join StayHub</h2>
                <p className="text-muted-foreground">Choose how you'd like to use our platform</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => (
                    <Card
                        key={role.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedRole === role.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                        }`}
                        onClick={() => handleRoleSelect(role.id)}
                    >
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <role.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{role.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {role.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedRole && (
                <div className="space-y-4">
                    <GoogleAuthButton role={selectedRole} />
                    <p className="text-xs text-center text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <a href="/terms" className="text-primary hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
