"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { addMonths, subMonths, format, isBefore, isAfter, isSameDay, startOfDay } from "date-fns";

interface BookingCalendarProps {
    bookedDates: Array<{
        checkIn: string;
        checkOut: string;
        status: "confirmed" | "pending" | "blocked";
        guestName?: string;
    }>;
    onDateSelect?: (date: Date) => void;
    selectedDate?: Date;
    minDate?: Date;
    maxDate?: Date;
    showBookingDetails?: boolean;
}

export function BookingCalendar({
    bookedDates,
    onDateSelect,
    selectedDate,
    minDate,
    maxDate,
    showBookingDetails = false
}: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Helper function to check if a date is booked
    const getBookingForDate = (date: Date) => {
        return bookedDates.find((booking) => {
            const bookingStart = startOfDay(new Date(booking.checkIn));
            const bookingEnd = startOfDay(new Date(booking.checkOut));
            const checkDate = startOfDay(date);

            return (
                (isSameDay(checkDate, bookingStart) || isAfter(checkDate, bookingStart)) &&
                isBefore(checkDate, bookingEnd)
            );
        });
    };

    // Check if date is unavailable
    const isDateUnavailable = (date: Date) => {
        const booking = getBookingForDate(date);
        return booking?.status === "confirmed" || booking?.status === "blocked";
    };

    // Check if date is pending
    const isDatePending = (date: Date) => {
        const booking = getBookingForDate(date);
        return booking?.status === "pending";
    };

    // Custom day renderer
    const dayRenderer = (day: Date) => {
        const booking = getBookingForDate(day);
        const isUnavailable = isDateUnavailable(day);
        const isPending = isDatePending(day);

        return (
            <div className="relative w-full h-full">
                <span className={`
                    ${isUnavailable ? 'text-red-600 font-medium' : ''}
                    ${isPending ? 'text-yellow-600 font-medium' : ''}
                `}>
                    {day.getDate()}
                </span>

                {booking && (
                    <div className={`
                        absolute bottom-0.5 left-1/2 transform -translate-x-1/2
                        w-1 h-1 rounded-full
                        ${booking.status === 'confirmed' ? 'bg-red-500' : ''}
                        ${booking.status === 'pending' ? 'bg-yellow-500' : ''}
                        ${booking.status === 'blocked' ? 'bg-gray-500' : ''}
                    `} />
                )}
            </div>
        );
    };

    const modifiers = {
        unavailable: (date: Date) => isDateUnavailable(date),
        pending: (date: Date) => isDatePending(date),
        outside: (date: Date) => {
            const isOutside = date.getMonth() !== currentMonth.getMonth();
            return isOutside;
        }
    };

    const modifiersStyles = {
        unavailable: {
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            cursor: 'not-allowed'
        },
        pending: {
            backgroundColor: '#fef3c7',
            color: '#d97706'
        }
    };

    // Get bookings for current month to show in details
    const currentMonthBookings = bookedDates.filter(booking => {
        const bookingDate = new Date(booking.checkIn);
        return bookingDate.getMonth() === currentMonth.getMonth() &&
               bookingDate.getFullYear() === currentMonth.getFullYear();
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <CalendarDays className="w-5 h-5" />
                        <span>Availability Calendar</span>
                    </CardTitle>
                    <CardDescription>
                        View available and booked dates for this property
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Calendar Navigation */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <h3 className="text-lg font-semibold">
                            {format(currentMonth, "MMMM yyyy")}
                        </h3>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Calendar */}
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => onDateSelect && onDateSelect(date || new Date())}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        disabled={(date) => {
                            if (minDate && isBefore(date, minDate)) return true;
                            if (maxDate && isAfter(date, maxDate)) return true;
                            return isDateUnavailable(date);
                        }}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        className="w-full"
                        required={false}
                    />

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-200 rounded"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-200 rounded"></div>
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                            <span>Pending</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-200 rounded"></div>
                            <span>Blocked</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Details for Current Month */}
            {showBookingDetails && currentMonthBookings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Bookings for {format(currentMonth, "MMMM yyyy")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {currentMonthBookings.map((booking, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <div className="font-medium">
                                            {booking.guestName || "Guest"}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d")}
                                        </div>
                                    </div>
                                    <Badge variant={
                                        booking.status === "confirmed" ? "default" :
                                        booking.status === "pending" ? "secondary" :
                                        "outline"
                                    }>
                                        {booking.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}