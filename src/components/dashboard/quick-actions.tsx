"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickAction {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    variant?: "default" | "outline" | "secondary";
    disabled?: boolean;
}

interface QuickActionsProps {
    actions: QuickAction[];
    title?: string;
    description?: string;
    className?: string;
}

export function QuickActions({
    actions,
    title = "Quick Actions",
    description = "Common tasks and shortcuts",
    className
}: QuickActionsProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <Button
                            key={index}
                            asChild={!action.disabled}
                            variant={action.variant || "outline"}
                            className="w-full justify-start h-auto py-3"
                            disabled={action.disabled}
                        >
                            {action.disabled ? (
                                <div className="flex items-center space-x-3">
                                    <Icon className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-medium">{action.title}</div>
                                        <div className="text-sm opacity-70">{action.description}</div>
                                    </div>
                                </div>
                            ) : (
                                <Link href={action.href} className="flex items-center space-x-3 w-full">
                                    <Icon className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-medium">{action.title}</div>
                                        <div className="text-sm opacity-70">{action.description}</div>
                                    </div>
                                </Link>
                            )}
                        </Button>
                    );
                })}
            </CardContent>
        </Card>
    );
}