"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    ExternalLink,
    PiggyBank,
    Receipt,
    TrendingDown,
    TrendingUp,
    Wallet
} from "lucide-react";
import { useState } from "react";

// Mock data for earnings
const earningsData = {
    summary: {
        totalEarnings: 28750,
        thisMonth: 4280,
        lastMonth: 3850,
        pendingPayouts: 1240,
        nextPayout: "2024-01-15",
        yearToDate: 28750
    },
    monthlyEarnings: [
        { month: "Jan", earnings: 2840, bookings: 8 },
        { month: "Feb", earnings: 3120, bookings: 9 },
        { month: "Mar", earnings: 2950, bookings: 7 },
        { month: "Apr", earnings: 3680, bookings: 11 },
        { month: "May", earnings: 4380, bookings: 13 },
        { month: "Jun", earnings: 3850, bookings: 10 },
        { month: "Jul", earnings: 4650, bookings: 14 },
        { month: "Aug", earnings: 4280, bookings: 12 }
    ],
    propertyEarnings: [
        { id: 1, name: "Downtown Loft", earnings: 12400, percentage: 43.1, bookings: 28 },
        { id: 2, name: "Beachfront Villa", earnings: 8900, percentage: 31.0, bookings: 18 },
        { id: 3, name: "Mountain Cabin", earnings: 5200, percentage: 18.1, bookings: 15 },
        { id: 4, name: "City Apartment", earnings: 2250, percentage: 7.8, bookings: 9 }
    ],
    recentTransactions: [
        {
            id: 1,
            type: "payout",
            property: "Downtown Loft",
            amount: 485,
            date: "2024-01-10",
            status: "completed",
            guest: "Sarah Johnson"
        },
        {
            id: 2,
            type: "payout",
            property: "Beachfront Villa",
            amount: 720,
            date: "2024-01-08",
            status: "completed",
            guest: "Mike Chen"
        },
        {
            id: 3,
            type: "pending",
            property: "Mountain Cabin",
            amount: 390,
            date: "2024-01-12",
            status: "pending",
            guest: "Emma Wilson"
        }
    ],
    taxInfo: {
        totalTaxableIncome: 28750,
        estimatedTaxes: 7188,
        documents: [
            { year: 2024, type: "1099-K", available: true },
            { year: 2023, type: "Annual Summary", available: true }
        ]
    }
};

export default function HostEarningsPage() {
    const [timeRange, setTimeRange] = useState("ytd");

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-800 border-green-200";
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const monthlyGrowth = ((earningsData.summary.thisMonth - earningsData.summary.lastMonth) / earningsData.summary.lastMonth * 100);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Earnings</h1>
                    <p className="text-muted-foreground">
                        Track your income and manage payouts
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ytd">Year to Date</SelectItem>
                            <SelectItem value="1year">Last Year</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Earnings */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardDescription>Total Earnings</CardDescription>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl">
                            {formatCurrency(earningsData.summary.totalEarnings)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Year to date earnings
                        </p>
                    </CardContent>
                </Card>

                {/* This Month */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardDescription>This Month</CardDescription>
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl">
                            {formatCurrency(earningsData.summary.thisMonth)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`flex items-center space-x-1 ${monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {monthlyGrowth > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium">{Math.abs(monthlyGrowth).toFixed(1)}%</span>
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Payouts */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardDescription>Pending Payouts</CardDescription>
                            <Wallet className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl">
                            {formatCurrency(earningsData.summary.pendingPayouts)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Next payout: {earningsData.summary.nextPayout}
                        </p>
                    </CardContent>
                </Card>

                {/* Average Monthly */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardDescription>Avg Monthly</CardDescription>
                            <PiggyBank className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl">
                            {formatCurrency(earningsData.summary.totalEarnings / 8)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Based on 8 months of data
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="properties">By Property</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="taxes">Tax Info</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Monthly Earnings Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Earnings Trend</CardTitle>
                                <CardDescription>Your earnings over the past 8 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {earningsData.monthlyEarnings.map((data) => (
                                        <div key={data.month} className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{data.month}</span>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-32 bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{
                                                            width: `${(data.earnings / Math.max(...earningsData.monthlyEarnings.map(d => d.earnings))) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">
                                                        {formatCurrency(data.earnings)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {data.bookings} bookings
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payout Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payout Information</CardTitle>
                                <CardDescription>Your payment schedule and methods</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Payout method</span>
                                        <span className="font-medium">Bank transfer</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Payout schedule</span>
                                        <span className="font-medium">Monthly</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Next payout date</span>
                                        <span className="font-medium">{earningsData.summary.nextPayout}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Processing time</span>
                                        <span className="font-medium">1-3 business days</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <CreditCard className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-blue-900 dark:text-blue-100">
                                                Bank Account: ****1234
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            Wells Fargo - Checking Account
                                        </p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            Update Payment Method
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="properties" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Earnings by Property</CardTitle>
                            <CardDescription>See which properties are your top earners</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {earningsData.propertyEarnings.map((property, index) => (
                                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{property.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {property.bookings} bookings this year
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-lg">
                                                {formatCurrency(property.earnings)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {property.percentage}% of total
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t">
                                    <h4 className="font-medium mb-4">Earnings Distribution</h4>
                                    <div className="space-y-3">
                                        {earningsData.propertyEarnings.map((property) => (
                                            <div key={property.id}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm">{property.name}</span>
                                                    <span className="text-sm font-medium">
                                                        {property.percentage}%
                                                    </span>
                                                </div>
                                                <Progress value={property.percentage} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Your payout history and pending payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {earningsData.recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                {transaction.type === 'payout' ? (
                                                    <DollarSign className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-yellow-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{transaction.property}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Guest: {transaction.guest}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {transaction.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">
                                                {formatCurrency(transaction.amount)}
                                            </div>
                                            <Badge variant="outline" className={getStatusColor(transaction.status)}>
                                                {transaction.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-4">
                                <Button variant="outline">
                                    View All Transactions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="taxes" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tax Summary</CardTitle>
                                <CardDescription>Your taxable income and estimated taxes</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Total taxable income</span>
                                        <span className="font-medium">
                                            {formatCurrency(earningsData.taxInfo.totalTaxableIncome)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Estimated taxes (25%)</span>
                                        <span className="font-medium">
                                            {formatCurrency(earningsData.taxInfo.estimatedTaxes)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="text-sm font-medium">Net income</span>
                                        <span className="font-semibold">
                                            {formatCurrency(earningsData.taxInfo.totalTaxableIncome - earningsData.taxInfo.estimatedTaxes)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Receipt className="w-4 h-4 text-yellow-600" />
                                            <span className="font-medium text-yellow-900 dark:text-yellow-100">
                                                Tax Reminder
                                            </span>
                                        </div>
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            This is an estimate. Consult with a tax professional for accurate calculations.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tax Documents</CardTitle>
                                <CardDescription>Download your tax forms and statements</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {earningsData.taxInfo.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Receipt className="w-5 h-5 text-muted-foreground" />
                                                <div>
                                                    <h4 className="font-medium">{doc.type}</h4>
                                                    <p className="text-sm text-muted-foreground">Year {doc.year}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" disabled={!doc.available}>
                                                <Download className="w-4 h-4 mr-2" />
                                                {doc.available ? 'Download' : 'Pending'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t">
                                    <Button variant="outline" className="w-full">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Tax Resources & Guidelines
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}