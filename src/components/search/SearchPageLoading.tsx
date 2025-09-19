"use client";

import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for Suspense fallback
export function SearchPageLoading() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-5 w-48" />
                        </div>
                        <Skeleton className="h-10 w-24 lg:hidden" />
                    </div>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-20" />
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="lg:w-80 flex-shrink-0 hidden lg:block">
                        <Skeleton className="h-96 w-full" />
                    </div>
                    <div className="flex-1">
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
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
