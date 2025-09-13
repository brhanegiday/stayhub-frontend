/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Sparkles, Users } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
    onSearch: (filters: any) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch({ search: searchQuery.trim() });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-20 lg:py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 right-10 opacity-20 animate-pulse">
                <Sparkles className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute bottom-20 left-10 opacity-20 animate-bounce">
                <MapPin className="w-12 h-12 text-secondary" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-12">
                    {/* Main Heading */}
                    <div className="space-y-6 mb-12">
                        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Trusted by 50,000+ travelers</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Find Your Perfect
                            <span className="block bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Stay Anywhere
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Discover unique properties and book amazing accommodations for your next adventure. From
                            city apartments to countryside retreats.
                        </p>
                    </div>

                    {/* Quick Search */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-card border rounded-2xl shadow-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-foreground mb-2 text-left">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Where to?
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Search destinations, cities, or properties..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="h-12 text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2 text-left">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Check-in
                                    </label>
                                    <Input type="date" className="h-12" min={new Date().toISOString().split("T")[0]} />
                                </div>
                                <div>
                                    <Button
                                        onClick={handleSearch}
                                        size="lg"
                                        className="w-full h-12 bg-primary hover:bg-primary/90"
                                    >
                                        <Search className="w-4 h-4 mr-2" />
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {[
                        { number: "10K+", label: "Properties", icon: MapPin },
                        { number: "50K+", label: "Happy Guests", icon: Users },
                        { number: "100+", label: "Cities", icon: MapPin },
                        { number: "4.8★", label: "Average Rating", icon: Sparkles },
                    ].map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                <stat.icon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {stat.number}
                            </div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
