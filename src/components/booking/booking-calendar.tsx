"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { addMonths, subMonths, format, isBefore, isAfter, isSameDay, startOfDay, isToday } from "date-fns";

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
    checkInDate?: Date;
    checkOutDate?: Date;
    onCheckInSelect?: (date: Date) => void;
    onCheckOutSelect?: (date: Date) => void;
    onClearDates?: () => void;
}

export function BookingCalendar({
    bookedDates,
    minDate,
    maxDate,
    showBookingDetails = false,
    checkInDate,
    checkOutDate,
    onCheckInSelect,
    onCheckOutSelect,
    onClearDates,
}: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingCheckOut, setSelectingCheckOut] = useState(false);

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

    // Check if date is in range
    const isInRange = (date: Date) => {
        if (!checkInDate || !checkOutDate) return false;
        const checkDate = startOfDay(date);
        const start = startOfDay(checkInDate);
        const end = startOfDay(checkOutDate);
        return isAfter(checkDate, start) && isBefore(checkDate, end);
    };

    // Handle date selection for check-in/check-out flow
    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;

        if (!checkInDate || (checkInDate && checkOutDate)) {
            // First selection or resetting
            onCheckInSelect?.(date);
            setSelectingCheckOut(true);
        } else if (checkInDate && !checkOutDate) {
            // Second selection
            if (isBefore(date, checkInDate)) {
                // Selected date is before check-in, make it the new check-in
                onCheckInSelect?.(date);
            } else {
                // Selected date is after check-in, make it check-out
                onCheckOutSelect?.(date);
                setSelectingCheckOut(false);
            }
        }
    };

    const modifiers = {
        unavailable: (date: Date) => isDateUnavailable(date),
        checkIn: (date: Date) => (checkInDate ? isSameDay(date, checkInDate) : false),
        checkOut: (date: Date) => (checkOutDate ? isSameDay(date, checkOutDate) : false),
        inRange: (date: Date) => isInRange(date),
        today: (date: Date) => isToday(date),
    };

    const modifiersStyles = {
        unavailable: {
            backgroundColor: "transparent",
            color: "#d1d5db",
            textDecoration: "line-through",
            cursor: "not-allowed",
        },
        checkIn: {
            backgroundColor: "#222222",
            color: "white",
            borderRadius: "50%",
            fontWeight: "600",
        },
        checkOut: {
            backgroundColor: "#222222",
            color: "white",
            borderRadius: "50%",
            fontWeight: "600",
        },
        inRange: {
            backgroundColor: "#f7f7f7",
            color: "#222222",
        },
        today: {
            fontWeight: "600",
            textDecoration: "underline",
        },
    };

    const nextMonth = addMonths(currentMonth, 1);

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                {/* Header */}
                <CardHeader className="px-8 py-6 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-semibold text-gray-900">
                                {checkInDate || checkOutDate ? "Select dates" : "Select check-in date"}
                            </CardTitle>
                            <p className="text-gray-600 mt-1">
                                {checkInDate && checkOutDate
                                    ? `${format(checkInDate, "MMM d")} - ${format(checkOutDate, "MMM d")}`
                                    : selectingCheckOut && checkInDate
                                    ? `${format(checkInDate, "MMM d")} - Add checkout date`
                                    : "Add your travel dates for exact pricing"}
                            </p>
                        </div>
                        {(checkInDate || checkOutDate) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearDates}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                            disabled={minDate ? isBefore(subMonths(currentMonth, 1), minDate) : false}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex space-x-8">
                            <h3 className="text-lg font-semibold text-gray-900">{format(currentMonth, "MMMM yyyy")}</h3>
                            <h3 className="text-lg font-semibold text-gray-900">{format(nextMonth, "MMMM yyyy")}</h3>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Dual Calendar Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* First Month */}
                        <div>
                            <Calendar
                                mode="single"
                                selected={checkInDate}
                                onSelect={handleDateSelect}
                                month={currentMonth}
                                disabled={(date) => {
                                    if (minDate && isBefore(date, minDate)) return true;
                                    if (maxDate && isAfter(date, maxDate)) return true;
                                    return isDateUnavailable(date);
                                }}
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
                                className="w-full [&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:font-medium [&_.rdp-head_cell]:text-gray-500 [&_.rdp-head_cell]:pb-2 [&_.rdp-day]:h-10 [&_.rdp-day]:w-10 [&_.rdp-day]:text-sm [&_.rdp-day]:font-normal [&_.rdp-day_button]:h-10 [&_.rdp-day_button]:w-10 [&_.rdp-day_button]:rounded-full [&_.rdp-day_button]:border-0 [&_.rdp-day_button:hover]:bg-gray-100 [&_.rdp-day_button:hover]:scale-105 [&_.rdp-day_button]:transition-all [&_.rdp-day_button]:duration-150 [&_.rdp-nav]:hidden [&_.rdp-caption]:hidden"
                            />
                        </div>

                        {/* Second Month */}
                        <div>
                            <Calendar
                                mode="single"
                                selected={checkOutDate}
                                onSelect={handleDateSelect}
                                month={nextMonth}
                                disabled={(date) => {
                                    if (minDate && isBefore(date, minDate)) return true;
                                    if (maxDate && isAfter(date, maxDate)) return true;
                                    return isDateUnavailable(date);
                                }}
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
                                className="w-full [&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:font-medium [&_.rdp-head_cell]:text-gray-500 [&_.rdp-head_cell]:pb-2 [&_.rdp-day]:h-10 [&_.rdp-day]:w-10 [&_.rdp-day]:text-sm [&_.rdp-day]:font-normal [&_.rdp-day_button]:h-10 [&_.rdp-day_button]:w-10 [&_.rdp-day_button]:rounded-full [&_.rdp-day_button]:border-0 [&_.rdp-day_button:hover]:bg-gray-100 [&_.rdp-day_button:hover]:scale-105 [&_.rdp-day_button]:transition-all [&_.rdp-day_button]:duration-150 [&_.rdp-nav]:hidden [&_.rdp-caption]:hidden"
                            />
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-gray-100 rounded-full border border-gray-300"></div>
                                    <span className="text-gray-600">Available</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                    <span className="text-gray-400">Unavailable</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-black rounded-full"></div>
                                    <span className="text-gray-600">Selected</span>
                                </div>
                            </div>

                            {(checkInDate || checkOutDate) && (
                                <Button
                                    onClick={onClearDates}
                                    variant="outline"
                                    size="sm"
                                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                >
                                    Clear dates
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Details */}
            {showBookingDetails && bookedDates.length > 0 && (
                <Card className="mt-6 border border-gray-200 rounded-xl">
                    <CardHeader className="px-6 py-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Current Bookings</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="space-y-3">
                            {bookedDates.slice(0, 3).map((booking, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {booking.guestName || "Guest Booking"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {format(new Date(booking.checkIn), "MMM d")} -{" "}
                                            {format(new Date(booking.checkOut), "MMM d, yyyy")}
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${
                                                booking.status === "confirmed"
                                                    ? "border-green-200 bg-green-50 text-green-700"
                                                    : ""
                                            }
                                            ${
                                                booking.status === "pending"
                                                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                                    : ""
                                            }
                                            ${
                                                booking.status === "blocked"
                                                    ? "border-gray-200 bg-gray-50 text-gray-700"
                                                    : ""
                                            }
                                        `}
                                    >
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
