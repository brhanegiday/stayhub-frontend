"use client";

import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

interface SearchResultsProps {
    properties: any[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onSortChange?: (sort: string) => void;
    className?: string;
}

export function SearchResults({
    properties,
    pagination,
    isLoading,
    onPageChange,
    onSortChange,
    className
}: SearchResultsProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("");

    const handleSortChange = (value: string) => {
        setSortBy(value);
        if (onSortChange) {
            onSortChange(value);
        }
    };

    if (isLoading) {
        return (
            <div className={className}>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className={className}>
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Grid className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No properties found</h2>
                    <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {properties.length} of {pagination?.total || 0} properties
                        {pagination && pagination.totalPages > 1 && (
                            <span> • Page {pagination.currentPage} of {pagination.totalPages}</span>
                        )}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Sort */}
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-48">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Relevance</SelectItem>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                            <SelectItem value="reviews_desc">Most Reviews</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* View Mode */}
                    <div className="flex border rounded-md">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="rounded-r-none"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="rounded-l-none"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {properties.map((property) => (
                        <div key={property.id} className="flex space-x-6 p-6 border rounded-lg hover:shadow-md transition-shadow">
                            {/* Image */}
                            <div className="w-48 h-36 flex-shrink-0">
                                {property.images && property.images.length > 0 ? (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                                        <Grid className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                                        <p className="text-muted-foreground mb-2">{property.location}</p>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {property.description}
                                        </p>

                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <span>{property.bedrooms} bed</span>
                                            <span>{property.bathrooms} bath</span>
                                            <span>Up to {property.maxGuests} guests</span>
                                        </div>
                                    </div>

                                    <div className="text-right ml-6">
                                        <div className="text-2xl font-bold">${property.price}</div>
                                        <div className="text-sm text-muted-foreground">per night</div>
                                        {property.rating && (
                                            <div className="flex items-center mt-2">
                                                <span className="text-sm">⭐ {property.rating}</span>
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    ({property.reviewCount} reviews)
                                                </span>
                                            </div>
                                        )}
                                        <Button className="mt-4">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            {pagination.hasPrev && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => onPageChange(pagination.currentPage - 1)} />
                                </PaginationItem>
                            )}
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <PaginationItem key={i + 1}>
                                    <PaginationLink
                                        onClick={() => onPageChange(i + 1)}
                                        isActive={pagination.currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            {pagination.hasNext && (
                                <PaginationItem>
                                    <PaginationNext onClick={() => onPageChange(pagination.currentPage + 1)} />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}