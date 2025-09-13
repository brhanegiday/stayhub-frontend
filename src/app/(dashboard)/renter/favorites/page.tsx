/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "@/store/api/users-api";
import { Filter, Heart, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteFilters {
    page?: number;
    limit?: number;
    propertyType?: "apartment" | "house" | "villa" | "condo" | "studio";
    search?: string;
}

export default function RenterFavoritesPage() {
    const [filters, setFilters] = useState<FavoriteFilters>({
        page: 1,
        limit: 12,
    });

    const { data, isLoading, error, refetch } = useGetFavoritesQuery(filters);
    const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation();

    const handleFilterChange = (key: keyof FavoriteFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined,
            page: key !== "page" ? 1 : value,
        }));
    };

    const handleRemoveFromFavorites = async (propertyId: string) => {
        try {
            await removeFromFavorites(propertyId).unwrap();
            toast.success("Removed from favorites");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to remove from favorites");
        }
    };

    const favorites = data?.data?.favorites || [];
    const pagination = data?.data?.pagination;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
                    <p className="text-muted-foreground">Properties you&apos;ve saved for later</p>
                </div>
                <Button asChild>
                    <Link href="/search">
                        <Search className="w-4 h-4 mr-2" />
                        Discover More
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
                                    placeholder="Search favorites..."
                                    value={filters.search || ""}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={filters.propertyType || ""}
                            onValueChange={(value) => handleFilterChange("propertyType", value || undefined)}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All types</SelectItem>
                                <SelectItem value="apartment">Apartment</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="villa">Villa</SelectItem>
                                <SelectItem value="condo">Condo</SelectItem>
                                <SelectItem value="studio">Studio</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Favorites Grid */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
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
                            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">Failed to load favorites</h3>
                            <p className="text-muted-foreground mb-4">Please try again later</p>
                            <Button onClick={() => refetch()}>Retry</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : favorites.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                            <p className="text-muted-foreground mb-6">
                                {filters.search || filters.propertyType
                                    ? "Try adjusting your filters"
                                    : "Start exploring and save properties you love"
                                }
                            </p>
                            {!filters.search && !filters.propertyType && (
                                <Button asChild>
                                    <Link href="/search">
                                        <Search className="w-4 h-4 mr-2" />
                                        Browse Properties
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
                            {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} found
                            {pagination && pagination.totalPages > 1 && (
                                <span> • Page {pagination.currentPage} of {pagination.totalPages}</span>
                            )}
                        </p>
                        {favorites.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    favorites.forEach((favorite: any) => {
                                        handleRemoveFromFavorites(favorite.property.id);
                                    });
                                }}
                                disabled={isRemoving}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        )}
                    </div>

                    {/* Favorites Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((favorite: any) => (
                            <div key={favorite.id} className="relative group">
                                <PropertyCard property={favorite.property} />

                                {/* Remove from favorites overlay */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleRemoveFromFavorites(favorite.property.id)}
                                        disabled={isRemoving}
                                        className="shadow-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Favorite heart indicator */}
                                <div className="absolute top-4 left-4">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Heart className="w-4 h-4 text-white fill-current" />
                                    </div>
                                </div>

                                {/* Date saved */}
                                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    Saved {new Date(favorite.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
                                disabled={(filters.page || 1) >= pagination.totalPages}
                            >
                                Load More Favorites
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Tips for finding properties */}
            {favorites.length === 0 && !filters.search && !filters.propertyType && (
                <Card>
                    <CardHeader>
                        <CardTitle>Tips for Finding Great Properties</CardTitle>
                        <CardDescription>Make the most of your StayHub experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Search className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-medium mb-2">Search by Location</h3>
                                <p className="text-sm text-muted-foreground">
                                    Find properties in your favorite destinations or explore new places
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Filter className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-medium mb-2">Use Filters</h3>
                                <p className="text-sm text-muted-foreground">
                                    Narrow down your search by price, property type, and amenities
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-medium mb-2">Save Favorites</h3>
                                <p className="text-sm text-muted-foreground">
                                    Click the heart icon on any property to save it for later
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}