"use client";

import { BookingWidget } from "@/components/booking/booking-widget";
import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { PropertyDetails } from "@/components/property/property-details";
import { PropertyReviews } from "@/components/property/property-reviews";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { Button } from "@/components/ui/button";
import { useGetPropertyQuery } from "@/store/api/properties-api";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyPage() {
    const params = useParams();
    const propertyId = params.id as string;

    const { data, isLoading, error, refetch } = useGetPropertyQuery(propertyId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-1/4" />
                        <div className="h-64 bg-muted rounded" />
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="h-6 bg-muted rounded w-3/4" />
                                <div className="h-4 bg-muted rounded w-1/2" />
                                <div className="space-y-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-4 bg-muted rounded" />
                                    ))}
                                </div>
                            </div>
                            <div className="h-96 bg-muted rounded" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-4">Property not found</h1>
                        <p className="text-muted-foreground mb-6">
                            The property you&apos;re looking for doesn&apos;t exist or has been removed.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Link>
                            </Button>
                            <Button onClick={() => refetch()}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const property = data?.data?.property;
    const bookings = data?.data?.bookings || [];

    if (!property) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/" className="hover:text-foreground">
                        Properties
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{property.title}</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Property Details */}
                    <div className="lg:col-span-2">
                        <PropertyDetails property={{
                            ...property,
                            location: property.location?.address || '',
                            price: property.pricePerNight,
                            rating: 4.8,
                            reviewCount: 124,
                            city: property.location?.city || '',
                            country: property.location?.country || '',
                            instantBook: true,
                            cleaningFee: 50,
                            serviceFee: 25,
                            host: property.host ? {
                                id: property.host.id,
                                name: property.host.name,
                                avatar: property.host.avatar,
                                joinedAt: property.host.createdAt,
                                verified: property.host.isVerified,
                                rating: 4.8,
                                reviewCount: 45
                            } : {
                                id: property.hostId,
                                name: 'Host',
                                joinedAt: new Date().toISOString(),
                                verified: true,
                                rating: 4.8,
                                reviewCount: 45
                            }
                        }} />
                    </div>

                    {/* Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BookingWidget
                                property={{
                                    id: property.id,
                                    title: property.title,
                                    pricePerNight: property.pricePerNight,
                                    maxGuests: property.maxGuests,
                                    cleaningFee: 50,
                                    serviceFee: 25,
                                    instantBook: true
                                }}
                                bookedDates={bookings.map(booking => ({
                                    checkInDate: booking.checkInDate,
                                    checkOutDate: booking.checkOutDate,
                                    status: booking.status
                                }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Sections */}
                <div className="mt-16 space-y-16">
                    {/* Availability Calendar */}
                    <BookingCalendar
                        bookedDates={bookings.map(booking => ({
                            checkIn: booking.checkInDate,
                            checkOut: booking.checkOutDate,
                            status: booking.status,
                            guestName: booking.renter?.name
                        }))}
                        showBookingDetails={false}
                        minDate={new Date()}
                    />

                    {/* Property Reviews */}
                    <PropertyReviews
                        reviews={[]}
                        overallRating={4.8}
                        totalReviews={124}
                        ratingBreakdown={{ 5: 85, 4: 25, 3: 10, 2: 3, 1: 1 }}
                        categoryAverages={{
                            cleanliness: 4.9,
                            communication: 4.8,
                            checkIn: 4.7,
                            accuracy: 4.8,
                            location: 4.9,
                            value: 4.6,
                        }}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
