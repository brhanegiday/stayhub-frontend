"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { MapPin, Users, Filter } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
    filters: {
        city?: string;
        country?: string;
        minPrice?: number;
        maxPrice?: number;
        propertyType?: string;
        bedrooms?: number;
        maxGuests?: number;
        amenities?: string[];
    };
    onFiltersChange: (filters: any) => void;
    onClose?: () => void;
    className?: string;
}

export function SearchFilters({ filters, onFiltersChange, onClose, className }: SearchFiltersProps) {
    const [priceRange, setPriceRange] = useState([filters.minPrice || 50, filters.maxPrice || 500]);

    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);
        onFiltersChange({
            ...filters,
            minPrice: values[0],
            maxPrice: values[1],
        });
    };

    const handleClearAll = () => {
        setPriceRange([50, 500]);
        onFiltersChange({});
    };

    const amenitiesList = [
        "WiFi",
        "Pool",
        "Parking",
        "Kitchen",
        "Air Conditioning",
        "Gym",
        "Pet Friendly",
        "Washer/Dryer",
    ];

    const toggleAmenity = (amenity: string) => {
        const currentAmenities = filters.amenities || [];
        const newAmenities = currentAmenities.includes(amenity)
            ? currentAmenities.filter(a => a !== amenity)
            : [...currentAmenities, amenity];

        onFiltersChange({
            ...filters,
            amenities: newAmenities,
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        Filters
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={handleClearAll}>
                            Clear all
                        </Button>
                        {onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
                            onChange={(e) => onFiltersChange({ ...filters, city: e.target.value || undefined })}
                        />
                        <Input
                            placeholder="Country"
                            value={filters.country || ""}
                            onChange={(e) => onFiltersChange({ ...filters, country: e.target.value || undefined })}
                        />
                    </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Price Range (per night)</Label>
                    <div className="px-3">
                        <Slider
                            value={priceRange}
                            onValueChange={handlePriceChange}
                            max={1000}
                            min={10}
                            step={10}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label className="text-xs text-muted-foreground">Min</Label>
                            <Input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 10;
                                    setPriceRange([value, priceRange[1]]);
                                    onFiltersChange({ ...filters, minPrice: value });
                                }}
                            />
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Max</Label>
                            <Input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1000;
                                    setPriceRange([priceRange[0], value]);
                                    onFiltersChange({ ...filters, maxPrice: value });
                                }}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Property Type */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Property Type</Label>
                    <Select
                        value={filters.propertyType || ""}
                        onValueChange={(value) => onFiltersChange({ ...filters, propertyType: value || undefined })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Any type</SelectItem>
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
                        onValueChange={(value) => onFiltersChange({ ...filters, bedrooms: value ? parseInt(value) : undefined })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Any</SelectItem>
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
                        onValueChange={(value) => onFiltersChange({ ...filters, maxGuests: value ? parseInt(value) : undefined })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Any</SelectItem>
                            <SelectItem value="1">1 guest</SelectItem>
                            <SelectItem value="2">2 guests</SelectItem>
                            <SelectItem value="4">4 guests</SelectItem>
                            <SelectItem value="6">6 guests</SelectItem>
                            <SelectItem value="8">8+ guests</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Amenities */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Amenities</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {amenitiesList.map((amenity) => (
                            <Button
                                key={amenity}
                                variant={filters.amenities?.includes(amenity) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleAmenity(amenity)}
                                className="text-xs justify-start"
                            >
                                {amenity}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}