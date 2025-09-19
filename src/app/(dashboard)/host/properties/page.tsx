/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetHostPropertiesQuery } from "@/store/api/properties-api";
import { Building2, Eye, Filter, Plus, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PropertyFilters {
    page?: number;
    limit?: number;
    status?: "active" | "inactive" | "pending";
    search?: string;
}

export default function HostPropertiesPage() {
    const [filters, setFilters] = useState<PropertyFilters>({
        page: 1,
        limit: 12,
    });

    const { data, isLoading, error } = useGetHostPropertiesQuery(filters);

    const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined,
            page: key !== "page" ? 1 : value,
        }));
    };

    const properties = data?.data?.properties || [];
    const pagination = data?.data?.pagination;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
                    <p className="text-muted-foreground">Manage and monitor your property listings</p>
                </div>
                <Button asChild>
                    <Link href="/host/properties/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Property
                    </Link>
                </Button>
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
                                    placeholder="Search properties..."
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
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Properties Grid */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-48 w-full" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : error ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">Failed to load properties</h3>
                            <p className="text-muted-foreground">Please try again later</p>
                        </div>
                    </CardContent>
                </Card>
            ) : properties.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Building2 className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                            <p className="text-muted-foreground mb-6">
                                {filters.search || filters.status
                                    ? "Try adjusting your filters"
                                    : "Get started by adding your first property"
                                }
                            </p>
                            {!filters.search && !filters.status && (
                                <Button asChild>
                                    <Link href="/host/properties/new">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First Property
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Results Summary */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {properties.length} of {pagination?.total || 0} properties
                            {pagination && pagination.totalPages > 1 && (
                                <span> • Page {pagination.currentPage} of {pagination.totalPages}</span>
                            )}
                        </p>
                    </div>

                    {/* Properties Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property: any) => (
                            <div key={property.id} className="relative group">
                                <PropertyCard property={property} />
                                {/* Host Actions Overlay */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="secondary" asChild>
                                            <Link href={`/properties/${property.id}`}>
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="secondary" asChild>
                                            <Link href={`/host/properties/${property.id}/edit`}>
                                                <Settings className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            property.status === "active"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : property.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                        }`}
                                    >
                                        {property.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More or Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
                                disabled={(filters.page || 1) >= pagination.totalPages}
                            >
                                Load More Properties
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}