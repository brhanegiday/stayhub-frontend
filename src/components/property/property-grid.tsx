"use client";

import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "./property-card";

interface PropertyGridProps {
    properties: Property[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onPageChange?: (page: number) => void;
    variant?: "default" | "compact";
}

export function PropertyGrid({ properties, pagination, onPageChange, variant = "default" }: PropertyGridProps) {
    if (properties.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-12 h-12 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h.01M7 3h.01"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search criteria or browse all available properties.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Properties Grid */}
            <div
                className={`grid gap-6 ${
                    variant === "compact"
                        ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "md:grid-cols-2 lg:grid-cols-3"
                }`}
            >
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} variant={variant} />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNumber;
                            if (pagination.totalPages <= 5) {
                                pageNumber = i + 1;
                            } else if (pagination.currentPage <= 3) {
                                pageNumber = i + 1;
                            } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                pageNumber = pagination.totalPages - 4 + i;
                            } else {
                                pageNumber = pagination.currentPage - 2 + i;
                            }

                            return (
                                <Button
                                    key={pageNumber}
                                    variant={pageNumber === pagination.currentPage ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange?.(pageNumber)}
                                    className="w-10"
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}
