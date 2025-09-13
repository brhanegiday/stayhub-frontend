"use client";

import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { Button } from "@/components/ui/button";
import { useGetBookingQuery } from "@/store/api/bookings-api";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("booking");

    const { data, isLoading, error, refetch } = useGetBookingQuery(bookingId || "", {
        skip: !bookingId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse space-y-8">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full mx-auto" />
                                <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
                                <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                            </div>
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="h-64 bg-muted rounded" />
                                    <div className="h-48 bg-muted rounded" />
                                </div>
                                <div className="space-y-6">
                                    <div className="h-48 bg-muted rounded" />
                                    <div className="h-32 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !bookingId) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            {!bookingId ? "Missing Booking Information" : "Booking Not Found"}
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            {!bookingId
                                ? "We couldn't find the booking ID. Please check your link or try again."
                                : "The booking you're looking for doesn't exist or has been removed."
                            }
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/">
                                    <Home className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Link>
                            </Button>
                            {bookingId && (
                                <Button onClick={() => refetch()}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const booking = data?.data?.booking;

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <BookingConfirmation booking={booking} />
            </main>
            <Footer />
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse space-y-8">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full mx-auto" />
                                <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
                                <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        }>
            <BookingSuccessContent />
        </Suspense>
    );
}