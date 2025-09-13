"use client";

import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { SearchSection } from "@/components/home/search-section";
import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { PropertyGrid } from "@/components/property/property-grid";
import { Button } from "@/components/ui/button";
import { useGetPropertiesQuery } from "@/store/api/properties-api";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface PropertyFilters {
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

export default function HomePage() {
    const [filters, setFilters] = useState<PropertyFilters>({
        page: 1,
        limit: 12,
    });

    const { data, isLoading, error, refetch } = useGetPropertiesQuery(filters);

    const handleFiltersChange = (newFilters: PropertyFilters) => {
        setFilters({ ...newFilters, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h1>
                        <p className="text-muted-foreground mb-6">
                            We couldn&apos;t load the properties. Please try again.
                        </p>
                        <Button onClick={() => refetch()} className="inline-flex items-center">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main>
                {/* Hero Section */}
                <HeroSection onSearch={handleFiltersChange} />

                {/* Search Section */}
                <SearchSection filters={filters} onFiltersChange={handleFiltersChange} />

                {/* Properties Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-2">
                                    {data?.data?.properties.length
                                        ? `${data.data.pagination.total} Properties Available`
                                        : "Discover Amazing Properties"}
                                </h2>
                                <p className="text-muted-foreground">Find your perfect home away from home</p>
                            </div>

                            {data?.data?.properties.length && data.data.pagination.totalPages > 1 && (
                                <div className="text-sm text-muted-foreground">
                                    Page {data.data.pagination.currentPage} of {data.data.pagination.totalPages}
                                </div>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="h-48 bg-muted rounded-lg animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 bg-muted rounded animate-pulse" />
                                            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                                            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <PropertyGrid
                                properties={data?.data?.properties || []}
                                pagination={data?.data?.pagination}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <FeaturesSection />
            </main>

            <Footer />
        </div>
    );
}
