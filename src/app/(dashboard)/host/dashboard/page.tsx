/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGetHostDashboardQuery } from "@/store/api/properties-api";
import { useGetHostBookingsQuery } from "@/store/api/bookings-api";
import {
    BarChart3,
    Building2,
    Calendar,
    DollarSign,
    Eye,
    Plus,
    Star,
    TrendingUp,
    Users
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function HostDashboard() {
    const { data: dashboardData, isLoading: isDashboardLoading } = useGetHostDashboardQuery();
    const { data: bookingsData, isLoading: isBookingsLoading } = useGetHostBookingsQuery({
        page: 1,
        limit: 5,
    });

    const stats = dashboardData?.data || {
        totalProperties: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
        occupancyRate: 0,
        monthlyRevenue: [],
    };

    const recentBookings = bookingsData?.data?.bookings || [];

    if (isDashboardLoading) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's how your properties are performing.</p>
                </div>
                <Button asChild>
                    <Link href="/host/properties/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Properties</CardDescription>
                        <CardTitle className="text-3xl">{stats.totalProperties}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span>Active listings</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Bookings</CardDescription>
                        <CardTitle className="text-3xl">{stats.totalBookings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>All time</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-3xl">${stats.totalRevenue.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>Lifetime earnings</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Average Rating</CardDescription>
                        <CardTitle className="text-3xl flex items-center">
                            {stats.averageRating.toFixed(1)}
                            <Star className="w-6 h-6 ml-2 text-yellow-500 fill-current" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Guest satisfaction</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Occupancy Rate</CardTitle>
                        <CardDescription>Your properties are {stats.occupancyRate}% booked this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Progress value={stats.occupancyRate} className="h-3" />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">0%</span>
                                <span className="text-muted-foreground">100%</span>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">
                                    {stats.occupancyRate > 75 ? "Excellent" : stats.occupancyRate > 50 ? "Good" : "Needs improvement"}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {stats.occupancyRate > 75
                                    ? "Your properties are performing very well!"
                                    : "Consider adjusting pricing or improving listings."
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your hosting business</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild className="w-full justify-start">
                            <Link href="/host/properties">
                                <Building2 className="w-4 h-4 mr-2" />
                                Manage Properties
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/host/bookings">
                                <Calendar className="w-4 h-4 mr-2" />
                                View Bookings
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/host/analytics">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>Your latest guest reservations</CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/host/bookings">
                                <Eye className="w-4 h-4 mr-2" />
                                View All
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isBookingsLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No recent bookings</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentBookings.map((booking: any) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{booking.guestName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.propertyTitle}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                                                {new Date(booking.checkOut).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={
                                                booking.status === "confirmed"
                                                    ? "default"
                                                    : booking.status === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                            }
                                        >
                                            {booking.status}
                                        </Badge>
                                        <p className="text-sm font-medium mt-1">${booking.totalPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}