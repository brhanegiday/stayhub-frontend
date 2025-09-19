/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertiesQuery } from "@/store/api/properties-api";
import { AlertCircle, Filter, MapPin, Search, SlidersHorizontal, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchFilters {
    page?: number;
    limit?: number;
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: "apartment" | "house" | "villa" | "condo" | "studio";
    bedrooms?: number;
    maxGuests?: number;
    search?: string;
}



// Main search component that uses useSearchParams
export function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<SearchFilters>(() => ({
        page: parseInt(searchParams.get("page") || "1"),
        limit: 12,
        city: searchParams.get("city") || "",
        country: searchParams.get("country") || "",
        minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
        maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined,
        propertyType: (searchParams.get("propertyType") as any) || undefined,
        bedrooms: searchParams.get("bedrooms") ? parseInt(searchParams.get("bedrooms")!) : undefined,
        maxGuests: searchParams.get("maxGuests") ? parseInt(searchParams.get("maxGuests")!) : undefined,
        search: searchParams.get("search") || "",
    }));

    const { data, isLoading, error, refetch } = useGetPropertiesQuery(filters);

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "" && value !== 0) {
                params.set(key, value.toString());
            }
        });
        router.push(`/search?${params.toString()}`, { scroll: false });
    }, [filters, router]);

    const handleFilterChange = (key: keyof SearchFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
            page: key !== "page" ? 1 : value, // Reset page when changing filters
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            limit: 12,
            search: filters.search, // Keep search term
        });
    };

    const properties = data?.data?.properties || [];
    const pagination = data?.data?.pagination;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Search Properties</h1>
                            <p className="text-muted-foreground">
                                {pagination ? `${pagination.total} properties found` : "Find your perfect stay"}
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>

                    {/* Quick Search */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by property name or location..."
                                value={filters.search || ""}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={() => refetch()}>Search</Button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className={`lg:w-80 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
                        <Card className="p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                                    Clear all
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Location */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Location
                                    </Label>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="City"
                                            value={filters.city || ""}
                                            onChange={(e) => handleFilterChange("city", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Country"
                                            value={filters.country || ""}
                                            onChange={(e) => handleFilterChange("country", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Price Range */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Price Range (per night)</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minPrice || ""}
                                            onChange={(e) =>
                                                handleFilterChange("minPrice", parseInt(e.target.value) || undefined)
                                            }
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxPrice || ""}
                                            onChange={(e) =>
                                                handleFilterChange("maxPrice", parseInt(e.target.value) || undefined)
                                            }
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Property Type */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Property Type</Label>
                                    <Select
                                        value={filters.propertyType || ""}
                                        onValueChange={(value) =>
                                            handleFilterChange("propertyType", value || undefined)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value=" ">Any type</SelectItem>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="villa">Villa</SelectItem>
                                            <SelectItem value="condo">Condo</SelectItem>
                                            <SelectItem value="studio">Studio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                {/* Bedrooms */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Bedrooms</Label>
                                    <Select
                                        value={filters.bedrooms?.toString() || ""}
                                        onValueChange={(value) =>
                                            handleFilterChange("bedrooms", value ? parseInt(value) : undefined)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 bedroom</SelectItem>
                                            <SelectItem value="2">2 bedrooms</SelectItem>
                                            <SelectItem value="3">3 bedrooms</SelectItem>
                                            <SelectItem value="4">4+ bedrooms</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                {/* Max Guests */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        Guests
                                    </Label>
                                    <Select
                                        value={filters.maxGuests?.toString() || ""}
                                        onValueChange={(value) =>
                                            handleFilterChange("maxGuests", value ? parseInt(value) : undefined)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 guest</SelectItem>
                                            <SelectItem value="2">2 guests</SelectItem>
                                            <SelectItem value="4">4 guests</SelectItem>
                                            <SelectItem value="6">6 guests</SelectItem>
                                            <SelectItem value="8">8+ guests</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {error ? (
                            <div className="text-center py-20">
                                <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                                <p className="text-muted-foreground mb-6">Failed to load search results</p>
                                <Button onClick={() => refetch()}>Try Again</Button>
                            </div>
                        ) : isLoading ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <Skeleton className="h-48 w-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">No properties found</h2>
                                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                                <Button onClick={handleClearFilters}>Clear Filters</Button>
                            </div>
                        ) : (
                            <>
                                {/* Sort and Display Options */}
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {properties.length} of {pagination?.total || 0} properties
                                        {pagination && pagination.totalPages > 1 && (
                                            <span>
                                                {" "}
                                                • Page {pagination.currentPage} of {pagination.totalPages}
                                            </span>
                                        )}
                                    </p>
                                    <Button variant="outline" size="sm">
                                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                                        Sort
                                    </Button>
                                </div>
                                {/* Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() =>
                                                            pagination.currentPage > 1 &&
                                                            handleFilterChange("page", pagination.currentPage - 1)
                                                        }
                                                        className={
                                                            pagination.currentPage <= 1
                                                                ? "pointer-events-none opacity-50"
                                                                : "cursor-pointer"
                                                        }
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                                                    (page) => (
                                                        <PaginationItem key={page}>
                                                            <PaginationLink
                                                                onClick={() => handleFilterChange("page", page)}
                                                                isActive={page === pagination.currentPage}
                                                                className="cursor-pointer"
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    )
                                                )}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() =>
                                                            pagination.currentPage < pagination.totalPages &&
                                                            handleFilterChange("page", pagination.currentPage + 1)
                                                        }
                                                        className={
                                                            pagination.currentPage >= pagination.totalPages
                                                                ? "pointer-events-none opacity-50"
                                                                : "cursor-pointer"
                                                        }
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
