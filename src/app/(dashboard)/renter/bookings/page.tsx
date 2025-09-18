/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCancelBookingMutation, useGetRenterBookingsQuery } from "@/store/api/bookings-api";
import { AlertCircle, Calendar, Clock, Filter, MapPin, MessageCircle, Search, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface BookingFilters {
    page?: number;
    limit?: number;
    status?: "upcoming" | "completed" | "cancelled";
    search?: string;
}

export default function RenterBookingsPage() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [filters, setFilters] = useState<BookingFilters>({
        page: 1,
        limit: 12,
        status: "upcoming",
    });

    const { data, isLoading, error, refetch } = useGetRenterBookingsQuery({
        ...filters,
        status: activeTab as any,
    });
    const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

    const handleFilterChange = (key: keyof BookingFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
            page: key !== "page" ? 1 : value,
        }));
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            await cancelBooking(bookingId).unwrap();
            toast.success("Booking cancelled successfully");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to cancel booking");
        }
    };

    const bookings = data?.data?.bookings || [];
    const pagination = data?.data?.pagination;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "confirmed":
                return "default";
            case "pending":
                return "secondary";
            case "cancelled":
                return "destructive";
            case "completed":
                return "outline";
            default:
                return "secondary";
        }
    };

    const canCancelBooking = (booking: any) => {
        const checkInDate = new Date(booking.checkIn);
        const now = new Date();
        const hoursDiff = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursDiff > 24; // Can cancel if check-in is more than 24 hours away
    };

    const renderBookingCard = (booking: any) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="flex space-x-4">
                    <div className="w-32 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {booking.propertyImage ? (
                            <Image
                                src={booking.propertyImage}
                                alt={booking.propertyTitle}
                                className="object-cover rounded-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{booking.propertyTitle}</h3>
                                <p className="text-muted-foreground">{booking.propertyLocation}</p>
                                {booking.propertyRating && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm">{booking.propertyRating}</span>
                                    </div>
                                )}
                            </div>
                            <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Check-in</span>
                                </div>
                                <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Check-out</span>
                                </div>
                                <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="font-medium">Guests: </span>
                                {booking.numberOfGuests}
                            </div>
                            <div>
                                <span className="font-medium">Nights: </span>
                                {Math.ceil(
                                    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div>
                                <p className="text-lg font-semibold">${booking.totalPrice}</p>
                                <p className="text-sm text-muted-foreground">Total price</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
                                </Button>
                                <Button size="sm" variant="outline">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Contact Host
                                </Button>
                                {activeTab === "upcoming" && canCancelBooking(booking) && (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleCancelBooking(booking.id)}
                                        disabled={isCancelling}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                )}
                                {activeTab === "completed" && !booking.hasReviewed && (
                                    <Button size="sm" variant="outline">
                                        <Star className="w-4 h-4 mr-2" />
                                        Write Review
                                    </Button>
                                )}
                            </div>
                        </div>

                        {activeTab === "upcoming" && booking.status === "confirmed" && (
                            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                        {Math.ceil(
                                            (new Date(booking.checkIn).getTime() - new Date().getTime()) /
                                                (1000 * 60 * 60 * 24)
                                        )}{" "}
                                        days until check-in
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
                <p className="text-muted-foreground">Manage your travel reservations and trip history</p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by property name or location..."
                                    value={filters.search || ""}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Trips</CardTitle>
                            <CardDescription>
                                {pagination ? `${pagination.total} upcoming bookings` : "Your confirmed reservations"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-6">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Card key={i}>
                                            <CardContent className="pt-6">
                                                <div className="flex space-x-4">
                                                    <Skeleton className="w-32 h-24 rounded" />
                                                    <div className="flex-1 space-y-4">
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-6 w-48" />
                                                            <Skeleton className="h-4 w-32" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-4 w-24" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                                    <h3 className="text-lg font-semibold mb-2">Failed to load bookings</h3>
                                    <p className="text-muted-foreground mb-4">Please try again later</p>
                                    <Button onClick={() => refetch()}>Retry</Button>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
                                    <p className="text-muted-foreground mb-6">
                                        {filters.search
                                            ? "Try adjusting your search"
                                            : "Start planning your next adventure!"}
                                    </p>
                                    <Button asChild>
                                        <Link href="/search">
                                            <Search className="w-4 h-4 mr-2" />
                                            Browse Properties
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">{bookings.map(renderBookingCard)}</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completed" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Trips</CardTitle>
                            <CardDescription>Your travel history and past stays</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-6">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Card key={i}>
                                            <CardContent className="pt-6">
                                                <div className="flex space-x-4">
                                                    <Skeleton className="w-32 h-24 rounded" />
                                                    <div className="flex-1 space-y-4">
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-6 w-48" />
                                                            <Skeleton className="h-4 w-32" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-4 w-24" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">No completed trips</h3>
                                    <p className="text-muted-foreground">Your trip history will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-6">{bookings.map(renderBookingCard)}</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cancelled" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cancelled Bookings</CardTitle>
                            <CardDescription>Your cancelled reservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-6">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <Card key={i}>
                                            <CardContent className="pt-6">
                                                <div className="flex space-x-4">
                                                    <Skeleton className="w-32 h-24 rounded" />
                                                    <div className="flex-1 space-y-4">
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-6 w-48" />
                                                            <Skeleton className="h-4 w-32" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-4 w-24" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <X className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">No cancelled bookings</h3>
                                    <p className="text-muted-foreground">You haven&apos;t cancelled any reservations</p>
                                </div>
                            ) : (
                                <div className="space-y-6">{bookings.map(renderBookingCard)}</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
                        disabled={(filters.page || 1) >= pagination.totalPages}
                    >
                        Load More Bookings
                    </Button>
                </div>
            )}
        </div>
    );
}
