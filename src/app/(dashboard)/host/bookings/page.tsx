/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetHostBookingsQuery, useUpdateBookingMutation } from "@/store/api/bookings-api";
import { AlertCircle, Calendar, CheckCircle, Filter, MessageCircle, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookingFilters {
    page?: number;
    limit?: number;
    status?: "pending" | "confirmed" | "cancelled" | "completed";
    search?: string;
}

export default function HostBookingsPage() {
    const [filters, setFilters] = useState<BookingFilters>({
        page: 1,
        limit: 20,
    });

    const { data, isLoading, error, refetch } = useGetHostBookingsQuery(filters);
    const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

    const handleFilterChange = (key: keyof BookingFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined,
            page: key !== "page" ? 1 : value,
        }));
    };

    const handleStatusUpdate = async (bookingId: string, status: string) => {
        try {
            await updateBooking({ id: bookingId, status }).unwrap();
            toast.success(`Booking ${status} successfully`);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update booking");
        }
    };

    const bookings = data?.data?.bookings || [];
    const pagination = data?.data?.pagination;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "confirmed": return "default";
            case "pending": return "secondary";
            case "cancelled": return "destructive";
            case "completed": return "outline";
            default: return "secondary";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-green-600 dark:text-green-400";
            case "pending": return "text-yellow-600 dark:text-yellow-400";
            case "cancelled": return "text-red-600 dark:text-red-400";
            case "completed": return "text-blue-600 dark:text-blue-400";
            default: return "text-gray-600 dark:text-gray-400";
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
                <p className="text-muted-foreground">Manage your property reservations and guest communications</p>
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
                                    placeholder="Search by guest name or property..."
                                    value={filters.search || ""}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={filters.status || ""}
                            onValueChange={(value) => handleFilterChange("status", value || undefined)}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>
                                {pagination ? `${pagination.total} total bookings` : "Your property reservations"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 p-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                            <h3 className="text-lg font-semibold mb-2">Failed to load bookings</h3>
                            <p className="text-muted-foreground mb-4">Please try again later</p>
                            <Button onClick={() => refetch()}>Retry</Button>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                            <p className="text-muted-foreground">
                                {filters.search || filters.status
                                    ? "Try adjusting your filters"
                                    : "Your booking requests will appear here"
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Guest</TableHead>
                                            <TableHead>Property</TableHead>
                                            <TableHead>Dates</TableHead>
                                            <TableHead>Guests</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking: any) => (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{booking.guestName}</p>
                                                        <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{booking.propertyTitle}</p>
                                                        <p className="text-sm text-muted-foreground">{booking.propertyLocation}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm">
                                                            {new Date(booking.checkIn).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm">
                                                            {new Date(booking.checkOut).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {Math.ceil(
                                                                (new Date(booking.checkOut).getTime() -
                                                                    new Date(booking.checkIn).getTime()) /
                                                                    (1000 * 60 * 60 * 24)
                                                            )}{" "}
                                                            nights
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{booking.numberOfGuests}</TableCell>
                                                <TableCell className="font-medium">${booking.totalPrice}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(booking.status)}>
                                                        {booking.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {booking.status === "pending" && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                                                                    disabled={isUpdating}
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                                                                    disabled={isUpdating}
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button size="sm" variant="outline">
                                                            <MessageCircle className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-4">
                                {bookings.map((booking: any) => (
                                    <Card key={booking.id}>
                                        <CardContent className="pt-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-medium">{booking.guestName}</p>
                                                    <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                                                </div>
                                                <Badge variant={getStatusVariant(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium">{booking.propertyTitle}</span>
                                                    <p className="text-muted-foreground">{booking.propertyLocation}</p>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span>Check-in:</span>
                                                    <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span>Check-out:</span>
                                                    <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span>Guests:</span>
                                                    <span>{booking.numberOfGuests}</span>
                                                </div>

                                                <div className="flex justify-between font-medium">
                                                    <span>Total:</span>
                                                    <span>${booking.totalPrice}</span>
                                                </div>
                                            </div>

                                            {booking.status === "pending" && (
                                                <div className="flex space-x-2 mt-4">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                                                        disabled={isUpdating}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="flex-1"
                                                        onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                                                        disabled={isUpdating}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Decline
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex justify-center mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
                                        disabled={(filters.page || 1) >= pagination.totalPages}
                                    >
                                        Load More Bookings
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}