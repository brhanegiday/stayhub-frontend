/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetRenterDashboardQuery } from "@/store/api/bookings-api";
import { useGetRenterBookingsQuery } from "@/store/api/bookings-api";
import { Calendar, Heart, MapPin, Search, Star, Ticket, Plane, Clock } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function RenterDashboard() {
    const { data: dashboardData, isLoading: isDashboardLoading } = useGetRenterDashboardQuery();
    const { data: bookingsData, isLoading: isBookingsLoading } = useGetRenterBookingsQuery({
        page: 1,
        limit: 3,
        status: "upcoming",
    });

    const stats = dashboardData?.data || {
        totalBookings: 0,
        upcomingBookings: 0,
        completedBookings: 0,
        totalSpent: 0,
        favoriteProperties: 0,
    };

    const upcomingBookings = bookingsData?.data?.bookings || [];

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
                    <p className="text-muted-foreground">Welcome back! Plan your next amazing trip.</p>
                </div>
                <Button asChild>
                    <Link href="/search">
                        <Search className="w-4 h-4 mr-2" />
                        Search Properties
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <CardDescription>Upcoming Trips</CardDescription>
                        <CardTitle className="text-3xl">{stats.upcomingBookings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Plane className="w-4 h-4" />
                            <span>Ready to go</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Spent</CardDescription>
                        <CardTitle className="text-3xl">${stats.totalSpent.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Ticket className="w-4 h-4" />
                            <span>Lifetime bookings</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Saved Favorites</CardDescription>
                        <CardTitle className="text-3xl">{stats.favoriteProperties}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Heart className="w-4 h-4" />
                            <span>Wishlist items</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions and Upcoming Trips */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>What would you like to do today?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild className="w-full justify-start">
                            <Link href="/search">
                                <Search className="w-4 h-4 mr-2" />
                                Search for Properties
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/renter/bookings">
                                <Calendar className="w-4 h-4 mr-2" />
                                View My Bookings
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/renter/favorites">
                                <Heart className="w-4 h-4 mr-2" />
                                Browse Favorites
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Upcoming Trips</CardTitle>
                                <CardDescription>Your next adventures await</CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/renter/bookings">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isBookingsLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <div className="flex space-x-4">
                                            <Skeleton className="h-16 w-24 rounded" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : upcomingBookings.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No upcoming trips</p>
                                <p className="text-sm">Start planning your next adventure!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking: any) => (
                                    <div
                                        key={booking.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex space-x-4">
                                            <div className="w-24 h-16 bg-muted rounded-lg overflow-hidden">
                                                {booking.propertyImage ? (
                                                    <Image
                                                        src={booking.propertyImage}
                                                        alt={booking.propertyTitle}
                                                        width={96}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                                        <MapPin className="w-6 h-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{booking.propertyTitle}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.propertyLocation}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                                                            {new Date(booking.checkOut).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline">{booking.status}</Badge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${booking.totalPrice}</p>
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {Math.ceil(
                                                            (new Date(booking.checkIn).getTime() -
                                                                new Date().getTime()) /
                                                                (1000 * 60 * 60 * 24)
                                                        )}{" "}
                                                        days to go
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Travel Inspiration */}
            <Card>
                <CardHeader>
                    <CardTitle>Travel Inspiration</CardTitle>
                    <CardDescription>Discover amazing destinations for your next trip</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg overflow-hidden">
                                <div className="h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                                        <h3 className="font-semibold">Beach Destinations</h3>
                                        <p className="text-sm opacity-90">Relax by the ocean</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group cursor-pointer">
                            <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 rounded-lg overflow-hidden">
                                <div className="h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                                        <h3 className="font-semibold">Mountain Retreats</h3>
                                        <p className="text-sm opacity-90">Fresh air and nature</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group cursor-pointer">
                            <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg overflow-hidden">
                                <div className="h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                                        <h3 className="font-semibold">City Adventures</h3>
                                        <p className="text-sm opacity-90">Urban exploration</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Booking confirmed</p>
                                <p className="text-xs text-muted-foreground">
                                    Your booking at Ocean View Villa was confirmed
                                </p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Added to favorites</p>
                                <p className="text-xs text-muted-foreground">
                                    You saved Mountain Cabin Retreat to your favorites
                                </p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                                <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Review submitted</p>
                                <p className="text-xs text-muted-foreground">
                                    You left a 5-star review for Downtown Loft
                                </p>
                                <p className="text-xs text-muted-foreground">3 days ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
