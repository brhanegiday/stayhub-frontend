"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    Home,
    MapPin,
    MessageCircle,
    Phone,
    Shield,
    Star,
    Users
} from "lucide-react";
import Link from "next/link";

import { Booking } from "@/types/booking";

interface BookingConfirmationProps {
    booking: Booking & {
        confirmationCode?: string;
        pricing?: {
            basePrice: number;
            nights: number;
            subtotal: number;
            cleaningFee: number;
            serviceFee: number;
            taxes: number;
            total: number;
        };
        cancellationPolicy?: {
            freeCancellationUntil: string;
            refundPercentage: number;
            conditions: string[];
        };
    };
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
    const isConfirmed = booking.status === "confirmed";
    const isPending = booking.status === "pending";

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Status Header */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    {isConfirmed ? (
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    ) : isPending ? (
                        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {isConfirmed
                            ? "Booking Confirmed!"
                            : isPending
                            ? "Booking Request Sent"
                            : "Booking Cancelled"
                        }
                    </h1>
                    <p className="text-muted-foreground">
                        {isConfirmed
                            ? "Your reservation is confirmed. Get ready for your stay!"
                            : isPending
                            ? "We've sent your request to the host. You'll hear back within 24 hours."
                            : "Your booking has been cancelled."
                        }
                    </p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                    <Badge variant={isConfirmed ? "default" : isPending ? "secondary" : "destructive"}>
                        {booking.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        Confirmation #{booking.confirmationCode || booking.id.slice(-8)}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Property Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Reservation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex space-x-4">
                                <div className="w-24 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    {booking.property?.images?.[0] ? (
                                        <img
                                            src={booking.property.images[0]}
                                            alt={booking.property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Home className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{booking.property?.title}</h3>
                                    <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{booking.property?.location?.address}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                                        <span className="font-medium">4.8</span>
                                        <span className="text-muted-foreground text-sm">
                                            (124 reviews)
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="mt-2 capitalize">
                                        {booking.property?.propertyType}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            {/* Booking Details */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Check-in</div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(booking.checkInDate), "EEEE, MMMM d, yyyy")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Guests</div>
                                            <div className="text-sm text-muted-foreground">
                                                {booking.numberOfGuests} {booking.numberOfGuests === 1 ? "guest" : "guests"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Check-out</div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(booking.checkOutDate), "EEEE, MMMM d, yyyy")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Duration</div>
                                            <div className="text-sm text-muted-foreground">
                                                {booking.pricing?.nights || booking.numberOfNights || 1} {(booking.pricing?.nights || booking.numberOfNights || 1) === 1 ? "night" : "nights"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {booking.specialRequests && (
                                <>
                                    <Separator />
                                    <div>
                                        <h4 className="font-medium mb-2">Special Requests</h4>
                                        <p className="text-muted-foreground text-sm">{booking.specialRequests}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Check-in Instructions */}
                    {isConfirmed && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5" />
                                    <span>Check-in Instructions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm">Check-in time: {booking.property?.checkInTime || '3:00 PM'}. Please contact the host upon arrival.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Cancellation Policy */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cancellation Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <div className="font-medium">Free cancellation</div>
                                    <div className="text-sm text-muted-foreground">
                                        Until {format(new Date(booking.cancellationPolicy?.freeCancellationUntil || booking.checkInDate), "MMM d, yyyy")}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                <p>
                                    After the free cancellation period, you can still cancel and get a{" "}
                                    {booking.cancellationPolicy?.refundPercentage || 50}% refund up to 5 days before check-in.
                                </p>
                            </div>

                            <ul className="text-sm text-muted-foreground space-y-1">
                                {(booking.cancellationPolicy?.conditions || [
                                    "Free cancellation for 48 hours after booking",
                                    "After that, cancel up to 5 days before check-in for a partial refund",
                                    "Guest fees are refunded when cancellation happens before check-in"
                                ]).map((condition, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                        <span>{condition}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Price Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <CreditCard className="w-5 h-5" />
                                <span>Price Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span>${booking.pricing?.basePrice || Math.floor(booking.totalPrice * 0.8)} × {booking.pricing?.nights || booking.numberOfNights || 1} nights</span>
                                <span>${booking.pricing?.subtotal || Math.floor(booking.totalPrice * 0.8)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cleaning fee</span>
                                <span>${booking.pricing?.cleaningFee || 50}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Service fee</span>
                                <span>${booking.pricing?.serviceFee || 25}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes</span>
                                <span>${booking.pricing?.taxes || 15}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>${booking.pricing?.total || booking.totalPrice}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Host Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Host</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarImage src={booking.property?.host?.avatar || booking.host?.avatar} alt={booking.property?.host?.name || booking.host?.name} />
                                    <AvatarFallback>
                                        {(booking.property?.host?.name || booking.host?.name || 'Host').split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{booking.property?.host?.name || booking.host?.name || 'Host'}</div>
                                    <div className="text-sm text-muted-foreground">Host</div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Button className="flex-1" size="sm">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                                {(booking.property?.host?.phone || booking.host?.phone) && (
                                    <Button variant="outline" size="sm">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardContent className="pt-6 space-y-3">
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download Confirmation
                            </Button>

                            <Button asChild variant="outline" className="w-full">
                                <Link href="/renter/bookings">
                                    View All Bookings
                                </Link>
                            </Button>

                            {isConfirmed && (
                                <Button asChild className="w-full">
                                    <Link href={`/properties/${booking.propertyId}`}>
                                        View Property
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}