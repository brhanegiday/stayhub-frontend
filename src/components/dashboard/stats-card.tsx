"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className
}: StatsCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardDescription className="flex items-center">
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {title}
                </CardDescription>
                <CardTitle className="text-3xl">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {trend && (
                    <div className={`flex items-center space-x-2 text-sm ${
                        trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                        <span className={trend.isPositive ? '↗' : '↙'}>
                            {trend.isPositive ? '+' : ''}{trend.value}%
                        </span>
                        <span>{trend.label}</span>
                    </div>
                )}
                {description && !trend && (
                    <div className="text-sm text-muted-foreground">
                        {description}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}