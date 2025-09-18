/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetHostAnalyticsQuery } from "@/store/api/properties-api";
import { BarChart3, Calendar, DollarSign, MapPin, Star, TrendingDown, TrendingUp, Users } from "lucide-react";

export default function HostAnalyticsPage() {
    const { data, isLoading } = useGetHostAnalyticsQuery();

    const analytics = data?.data || {
        overview: {
            totalRevenue: 0,
            totalBookings: 0,
            averageRating: 0,
            occupancyRate: 0,
            viewsToBookingRate: 0,
        },
        monthlyRevenue: [],
        propertyPerformance: [],
        bookingTrends: [],
        guestInsights: {
            averageStayDuration: 0,
            repeatGuestRate: 0,
            averageGroupSize: 0,
        },
    };

    if (isLoading) {
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
            <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Track your property performance and revenue insights</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-3xl flex items-center">
                            ${analytics.overview.totalRevenue.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">+12.5% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Bookings</CardDescription>
                        <CardTitle className="text-3xl">{analytics.overview.totalBookings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">+8.3% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Average Rating</CardDescription>
                        <CardTitle className="text-3xl flex items-center">
                            {analytics.overview.averageRating.toFixed(1)}
                            <Star className="w-6 h-6 ml-2 text-yellow-500 fill-current" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">+0.2 from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Occupancy Rate</CardDescription>
                        <CardTitle className="text-3xl">{analytics.overview.occupancyRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <span className="text-red-600">-2.1% from last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <Tabs defaultValue="revenue" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="guests">Guests</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    Monthly Revenue
                                </CardTitle>
                                <CardDescription>Revenue trend over the last 12 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.monthlyRevenue.map((month: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{month.month}</span>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-32">
                                                    <Progress
                                                        value={
                                                            (month.revenue /
                                                                Math.max(
                                                                    ...analytics.monthlyRevenue.map(
                                                                        (m: any) => m.revenue
                                                                    )
                                                                )) *
                                                            100
                                                        }
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">
                                                    ${month.revenue.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Insights</CardTitle>
                                <CardDescription>Key revenue metrics and trends</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Average nightly rate</span>
                                        <span className="font-medium">$125</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Best performing month</span>
                                        <span className="font-medium">August 2024</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Revenue per booking</span>
                                        <span className="font-medium">$387</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Peak season uplift</span>
                                        <span className="font-medium text-green-600">+23%</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="bg-primary/10 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">Revenue Optimization Tips</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Consider seasonal pricing adjustments</li>
                                            <li>• Weekend rates could be increased by 15%</li>
                                            <li>• Add value-added services for extra revenue</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="bookings" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Booking Trends
                                </CardTitle>
                                <CardDescription>Booking patterns and conversion rates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">View to booking rate</span>
                                            <span className="font-medium">
                                                {analytics.overview.viewsToBookingRate}%
                                            </span>
                                        </div>
                                        <Progress value={analytics.overview.viewsToBookingRate} className="h-2" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Occupancy rate</span>
                                            <span className="font-medium">{analytics.overview.occupancyRate}%</span>
                                        </div>
                                        <Progress value={analytics.overview.occupancyRate} className="h-2" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Booking lead time (avg days)</span>
                                            <span className="font-medium">18 days</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Cancellation rate</span>
                                            <span className="font-medium">8%</span>
                                        </div>
                                        <Progress value={8} className="h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Patterns</CardTitle>
                                <CardDescription>When and how guests book your properties</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-3">Popular booking days</h4>
                                        <div className="space-y-2">
                                            {[
                                                "Sunday",
                                                "Monday",
                                                "Tuesday",
                                                "Wednesday",
                                                "Thursday",
                                                "Friday",
                                                "Saturday",
                                            ].map((day, index) => {
                                                const popularity = [85, 45, 32, 28, 41, 72, 90][index];
                                                return (
                                                    <div key={day} className="flex items-center justify-between">
                                                        <span className="text-sm">{day}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-20">
                                                                <Progress value={popularity} className="h-1" />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground w-8">
                                                                {popularity}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="properties" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Property Performance
                            </CardTitle>
                            <CardDescription>How each of your properties is performing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analytics.propertyPerformance.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No property performance data available</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {analytics.propertyPerformance.map((property: any, index: number) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-medium">{property.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{property.location}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span className="font-medium">{property.rating}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Revenue</p>
                                                    <p className="font-medium">${property.revenue.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Bookings</p>
                                                    <p className="font-medium">{property.bookings}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Occupancy</p>
                                                    <p className="font-medium">{property.occupancyRate}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Avg. Rate</p>
                                                    <p className="font-medium">${property.averageRate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="guests" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Guest Insights
                                </CardTitle>
                                <CardDescription>Understanding your guest behavior</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Average stay duration</span>
                                        <span className="font-medium">
                                            {analytics.guestInsights.averageStayDuration} nights
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Repeat guest rate</span>
                                        <span className="font-medium">{analytics.guestInsights.repeatGuestRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Average group size</span>
                                        <span className="font-medium">
                                            {analytics.guestInsights.averageGroupSize} guests
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="font-medium mb-3">Guest Demographics</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm">Business travelers</span>
                                                <span className="text-sm">35%</span>
                                            </div>
                                            <Progress value={35} className="h-2" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm">Families</span>
                                                <span className="text-sm">45%</span>
                                            </div>
                                            <Progress value={45} className="h-2" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm">Solo travelers</span>
                                                <span className="text-sm">20%</span>
                                            </div>
                                            <Progress value={20} className="h-2" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Guest Reviews Summary</CardTitle>
                                <CardDescription>What guests say about your properties</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Cleanliness</span>
                                            <span className="font-medium">4.8</span>
                                        </div>
                                        <Progress value={96} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Communication</span>
                                            <span className="font-medium">4.7</span>
                                        </div>
                                        <Progress value={94} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Location</span>
                                            <span className="font-medium">4.6</span>
                                        </div>
                                        <Progress value={92} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Value</span>
                                            <span className="font-medium">4.5</span>
                                        </div>
                                        <Progress value={90} className="h-2" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="font-medium mb-2">Recent Feedback Highlights</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                            <p className="text-green-800 dark:text-green-200">
                                                "Exceptionally clean and well-maintained properties"
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                            <p className="text-blue-800 dark:text-blue-200">
                                                Great communication and quick responses
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
