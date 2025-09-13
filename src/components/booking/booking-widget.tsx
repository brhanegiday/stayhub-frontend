/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/store";
import { useCreateBookingMutation } from "@/store/api/bookings-api";
import { addDays, differenceInDays, format, isAfter, isBefore, isSameDay } from "date-fns";
import {
    AlertCircle,
    Check,
    ChevronDown,
    Clock,
    Loader2,
    Shield,
    Star
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface BookingWidgetProps {
    property: {
        id: string;
        title: string;
        pricePerNight: number;
        cleaningFee?: number;
        serviceFee?: number;
        instantBook?: boolean;
        maxGuests: number;
    };
    bookedDates: Array<{
        checkInDate: string;
        checkOutDate: string;
        status: string;
    }>;
}

export function BookingWidget({ property, bookedDates }: BookingWidgetProps) {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [createBooking, { isLoading }] = useCreateBookingMutation();

    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();
    const [guests, setGuests] = useState(1);
    const [specialRequests, setSpecialRequests] = useState("");
    const [showGuestSelector, setShowGuestSelector] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    // Calculate if a date is booked
    const isDateBooked = (date: Date) => {
        return bookedDates.some((booking) => {
            const bookingStart = new Date(booking.checkInDate);
            const bookingEnd = new Date(booking.checkOutDate);
            return (
                booking.status === "confirmed" &&
                ((isSameDay(date, bookingStart) || isAfter(date, bookingStart)) &&
                    (isSameDay(date, bookingEnd) || isBefore(date, bookingEnd)))
            );
        });
    };

    // Calculate pricing
    const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
    const subtotal = nights * property.pricePerNight;
    const cleaningFee = property.cleaningFee || Math.floor(property.pricePerNight * 0.1);
    const serviceFee = property.serviceFee || Math.floor(subtotal * 0.1);
    const totalPrice = subtotal + cleaningFee + serviceFee;

    const handleBooking = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to make a booking");
            router.push("/login");
            return;
        }

        if (!checkIn || !checkOut) {
            toast.error("Please select check-in and check-out dates");
            return;
        }

        if (nights < 1) {
            toast.error("Stay must be at least 1 night");
            return;
        }

        try {
            const bookingData = {
                propertyId: property.id,
                checkInDate: format(checkIn, "yyyy-MM-dd"),
                checkOutDate: format(checkOut, "yyyy-MM-dd"),
                numberOfGuests: guests,
                specialRequests,
            };

            await createBooking(bookingData).unwrap();
            toast.success("Booking request sent successfully!");
            router.push("/renter/bookings");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create booking");
        }
    };

    const handleDateSelect = (selectedDate: Date | undefined, type: "checkIn" | "checkOut") => {
        if (!selectedDate) return;

        if (type === "checkIn") {
            setCheckIn(selectedDate);
            // Clear checkout if it's before the new checkin
            if (checkOut && isBefore(checkOut, selectedDate)) {
                setCheckOut(undefined);
            }
        } else {
            setCheckOut(selectedDate);
        }
    };

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-bold">${property.pricePerNight}</span>
                        <span className="text-muted-foreground">night</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span className="font-medium">4.8</span>
                        <span className="text-muted-foreground text-sm">(124)</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-0 border rounded-lg overflow-hidden">
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-14 rounded-none border-r justify-start"
                                onClick={() => setShowCalendar(true)}
                            >
                                <div className="text-left">
                                    <div className="text-xs font-medium uppercase text-muted-foreground">Check-in</div>
                                    <div className="text-sm">
                                        {checkIn ? format(checkIn, "MMM d") : "Add date"}
                                    </div>
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={checkIn}
                                onSelect={(date) => handleDateSelect(date, "checkIn")}
                                disabled={(date) =>
                                    isBefore(date, new Date()) ||
                                    isDateBooked(date)
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-14 rounded-none justify-start">
                                <div className="text-left">
                                    <div className="text-xs font-medium uppercase text-muted-foreground">Check-out</div>
                                    <div className="text-sm">
                                        {checkOut ? format(checkOut, "MMM d") : "Add date"}
                                    </div>
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={checkOut}
                                onSelect={(date) => handleDateSelect(date, "checkOut")}
                                disabled={(date) =>
                                    !checkIn ||
                                    isBefore(date, addDays(checkIn, 1)) ||
                                    isDateBooked(date)
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Guests Selection */}
                <Popover open={showGuestSelector} onOpenChange={setShowGuestSelector}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-14 justify-between"
                            onClick={() => setShowGuestSelector(true)}
                        >
                            <div className="text-left">
                                <div className="text-xs font-medium uppercase text-muted-foreground">Guests</div>
                                <div className="text-sm">
                                    {guests} {guests === 1 ? "guest" : "guests"}
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Guests</div>
                                    <div className="text-sm text-muted-foreground">Ages 13 or above</div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        disabled={guests <= 1}
                                    >
                                        -
                                    </Button>
                                    <span className="w-8 text-center">{guests}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                                        disabled={guests >= property.maxGuests}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Special Requests */}
                <div className="space-y-2">
                    <Label htmlFor="special-requests">Special requests (optional)</Label>
                    <Textarea
                        id="special-requests"
                        placeholder="Let the host know about your trip details..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="min-h-[80px]"
                    />
                </div>

                {/* Pricing Breakdown */}
                {nights > 0 && (
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="underline">${property.pricePerNight} × {nights} nights</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Cleaning fee</span>
                            <span>${cleaningFee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Service fee</span>
                            <span>${serviceFee}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                        </div>
                    </div>
                )}

                {/* Booking Button */}
                <div className="space-y-3">
                    <Button
                        onClick={handleBooking}
                        disabled={!checkIn || !checkOut || isLoading}
                        className="w-full h-12"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : property.instantBook ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Reserve
                            </>
                        ) : (
                            "Request to book"
                        )}
                    </Button>

                    {property.instantBook && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>You won&apos;t be charged yet</span>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                        <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                            Your payment information is handled securely. We never store your payment details.
                        </span>
                    </div>

                    {!property.instantBook && (
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">
                                This is a booking request. The host will review and respond within 24 hours.
                            </span>
                        </div>
                    )}
                </div>

                {/* Cancellation Policy */}
                <div className="pt-4 border-t">
                    <div className="text-center text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Free cancellation for 48 hours</p>
                        <p>After that, cancel up to 5 days before check-in and get a 50% refund.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}