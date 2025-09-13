"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
    Calendar,
    CheckCircle,
    DollarSign,
    Heart,
    MessageCircle,
    Star,
    User,
    XCircle
} from "lucide-react";

interface ActivityItem {
    id: string;
    type: 'booking' | 'review' | 'message' | 'payment' | 'favorite' | 'cancellation';
    title: string;
    description: string;
    timestamp: string;
    user?: {
        name: string;
        avatar?: string;
    };
    property?: {
        name: string;
    };
    amount?: number;
    status?: 'success' | 'pending' | 'failed';
}

interface RecentActivityProps {
    activities: ActivityItem[];
    title?: string;
    showViewAll?: boolean;
    className?: string;
}

const activityIcons = {
    booking: Calendar,
    review: Star,
    message: MessageCircle,
    payment: DollarSign,
    favorite: Heart,
    cancellation: XCircle,
};

const activityColors = {
    booking: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
    review: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20',
    message: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
    payment: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20',
    favorite: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
    cancellation: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20',
};

export function RecentActivity({
    activities,
    title = "Recent Activity",
    showViewAll = true,
    className
}: RecentActivityProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>Your latest actions and updates</CardDescription>
                    </div>
                    {showViewAll && (
                        <a href="#" className="text-sm text-primary hover:text-primary/80">
                            View all
                        </a>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {activities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-6 h-6" />
                        </div>
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => {
                            const Icon = activityIcons[activity.type];
                            const colorClasses = activityColors[activity.type];

                            return (
                                <div key={activity.id} className="flex items-start space-x-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {activity.title}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                {activity.amount && (
                                                    <Badge variant="outline" className="text-xs">
                                                        ${activity.amount}
                                                    </Badge>
                                                )}
                                                {activity.status && (
                                                    <Badge
                                                        variant={
                                                            activity.status === 'success' ? 'default' :
                                                            activity.status === 'pending' ? 'secondary' :
                                                            'destructive'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {activity.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                        {activity.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground mt-1">
                                            {activity.description}
                                        </p>

                                        <div className="flex items-center space-x-4 mt-2">
                                            {activity.user && (
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="w-5 h-5">
                                                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                                                        <AvatarFallback className="text-xs">
                                                            {activity.user.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs text-muted-foreground">
                                                        {activity.user.name}
                                                    </span>
                                                </div>
                                            )}

                                            {activity.property && (
                                                <span className="text-xs text-muted-foreground">
                                                    {activity.property.name}
                                                </span>
                                            )}

                                            <span className="text-xs text-muted-foreground ml-auto">
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}