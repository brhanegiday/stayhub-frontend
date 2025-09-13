/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";

interface SearchSectionProps {
    filters: any;
    onFiltersChange: (filters: any) => void;
}

export function SearchSection({ filters, onFiltersChange }: SearchSectionProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const propertyTypes = [
        { value: "apartment", label: "Apartment" },
        { value: "house", label: "House" },
        { value: "villa", label: "Villa" },
        { value: "condo", label: "Condo" },
        { value: "studio", label: "Studio" },
    ];

    const applyFilters = () => {
        onFiltersChange(localFilters);
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        const clearedFilters = { page: 1, limit: 12 };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    const hasActiveFilters = Object.keys(filters).some((key) => key !== "page" && key !== "limit" && filters[key]);

    return (
        <section className="py-8 border-b bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="space-y-4">
                    {/* Main Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search by city, country, or property name..."
                                value={localFilters.search || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                className="h-12 text-base"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={applyFilters} size="lg" className="px-8 bg-primary hover:bg-primary/90">
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>

                            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="lg" className="px-6">
                                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                                        Filters
                                        {hasActiveFilters && (
                                            <Badge className="ml-2 bg-primary text-primary-foreground">
                                                {
                                                    Object.keys(filters).filter(
                                                        (key) => key !== "page" && key !== "limit" && filters[key]
                                                    ).length
                                                }
                                            </Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-96 p-6" align="end">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-lg">Filters</h3>
                                            {hasActiveFilters && (
                                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                                    Clear all
                                                </Button>
                                            )}
                                        </div>

                                        {/* Price Range */}
                                        <div className="space-y-3">
                                            <h4 className="font-medium">Price per night</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs text-muted-foreground mb-1">
                                                        Min Price ($)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        value={localFilters.minPrice || ""}
                                                        onChange={(e) =>
                                                            setLocalFilters({
                                                                ...localFilters,
                                                                minPrice: e.target.value
                                                                    ? Number(e.target.value)
                                                                    : undefined,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted-foreground mb-1">
                                                        Max Price ($)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        placeholder="1000"
                                                        value={localFilters.maxPrice || ""}
                                                        onChange={(e) =>
                                                            setLocalFilters({
                                                                ...localFilters,
                                                                maxPrice: e.target.value
                                                                    ? Number(e.target.value)
                                                                    : undefined,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Type */}
                                        <div className="space-y-3">
                                            <h4 className="font-medium">Property Type</h4>
                                            <Select
                                                value={localFilters.propertyType || ""}
                                                onValueChange={(value) =>
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        propertyType: value || undefined,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Any type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {propertyTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Bedrooms & Guests */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <h4 className="font-medium">Bedrooms</h4>
                                                <Select
                                                    value={localFilters.bedrooms?.toString() || ""}
                                                    onValueChange={(value) =>
                                                        setLocalFilters({
                                                            ...localFilters,
                                                            bedrooms: value ? Number(value) : undefined,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Any" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[1, 2, 3, 4, 5].map((num) => (
                                                            <SelectItem key={num} value={num.toString()}>
                                                                {num}+ bed{num > 1 ? "s" : ""}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-medium">Guests</h4>
                                                <Select
                                                    value={localFilters.maxGuests?.toString() || ""}
                                                    onValueChange={(value) =>
                                                        setLocalFilters({
                                                            ...localFilters,
                                                            maxGuests: value ? Number(value) : undefined,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Any" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[1, 2, 4, 6, 8, 10].map((num) => (
                                                            <SelectItem key={num} value={num.toString()}>
                                                                {num}+ guest{num > 1 ? "s" : ""}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                onClick={applyFilters}
                                                className="flex-1 bg-primary hover:bg-primary/90"
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2">
                            {filters.search && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Search: {filters.search}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => {
                                            const newFilters = { ...localFilters };
                                            delete newFilters.search;
                                            setLocalFilters(newFilters);
                                            onFiltersChange(newFilters);
                                        }}
                                    />
                                </Badge>
                            )}
                            {filters.propertyType && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    {propertyTypes.find((t) => t.value === filters.propertyType)?.label}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => {
                                            const newFilters = { ...localFilters };
                                            delete newFilters.propertyType;
                                            setLocalFilters(newFilters);
                                            onFiltersChange(newFilters);
                                        }}
                                    />
                                </Badge>
                            )}
                            {(filters.minPrice || filters.maxPrice) && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => {
                                            const newFilters = { ...localFilters };
                                            delete newFilters.minPrice;
                                            delete newFilters.maxPrice;
                                            setLocalFilters(newFilters);
                                            onFiltersChange(newFilters);
                                        }}
                                    />
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
