/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store";
import { useAddToFavoritesMutation, useCheckFavoriteQuery, useRemoveFromFavoritesMutation } from "@/store/api/users-api";
import {
    Award,
    Bath,
    Bed,
    Calendar,
    Car,
    Coffee,
    Dumbbell,
    Flag,
    Heart,
    Loader2,
    MapPin,
    MessageCircle,
    PawPrint,
    Phone,
    Share,
    Shield,
    Star,
    Tv,
    Users,
    Utensils,
    Waves,
    Wifi,
    Wind
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface PropertyDetailsProps {
    property: {
        id: string;
        title: string;
        description: string;
        location: string;
        city: string;
        country: string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        maxGuests: number;
        propertyType: string;
        amenities: string[];
        images: string[];
        host: {
            id: string;
            name: string;
            avatar?: string;
            joinedAt: string;
            verified: boolean;
            rating: number;
            reviewCount: number;
        };
        rating: number;
        reviewCount: number;
        rules: string[];
        checkInTime: string;
        checkOutTime: string;
        instantBook: boolean;
        cleaningFee?: number;
        serviceFee?: number;
    };
}

const amenityIcons: Record<string, any> = {
    "WiFi": Wifi,
    "Parking": Car,
    "Kitchen": Utensils,
    "Coffee": Coffee,
    "TV": Tv,
    "Air Conditioning": Wind,
    "Pool": Waves,
    "Gym": Dumbbell,
    "Pet Friendly": PawPrint,
};

export function PropertyDetails({ property }: PropertyDetailsProps) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);

    const { data: favoriteData } = useCheckFavoriteQuery(property.id, {
        skip: !isAuthenticated,
    });
    const [addToFavorites, { isLoading: isAddingToFavorites }] = useAddToFavoritesMutation();
    const [removeFromFavorites, { isLoading: isRemovingFromFavorites }] = useRemoveFromFavoritesMutation();

    const isFavorite = favoriteData?.data?.isFavorite || false;
    const isLoadingFavorite = isAddingToFavorites || isRemovingFromFavorites;

    const handleFavoriteToggle = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to save favorites");
            return;
        }

        try {
            if (isFavorite) {
                await removeFromFavorites(property.id).unwrap();
                toast.success("Removed from favorites");
            } else {
                await addToFavorites(property.id).unwrap();
                toast.success("Added to favorites");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update favorites");
        }
    };

    const displayedAmenities = showAllAmenities ? property.amenities : property.amenities.slice(0, 6);
    const displayedImages = showAllImages ? property.images : property.images.slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-current text-yellow-500" />
                                <span className="font-medium">{property.rating}</span>
                                <span>({property.reviewCount} reviews)</span>
                            </div>
                            <span>&quot;</span>
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{property.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleFavoriteToggle}
                            disabled={isLoadingFavorite}
                        >
                            {isLoadingFavorite ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current text-red-500" : ""}`} />
                            )}
                            {isFavorite ? "Saved" : "Save"}
                        </Button>
                        <Button variant="outline" size="sm">
                            <Flag className="w-4 h-4 mr-2" />
                            Report
                        </Button>
                    </div>
                </div>

                {/* Property Type and Instant Book */}
                <div className="flex items-center space-x-2 mb-6">
                    <Badge variant="secondary" className="capitalize">
                        {property.propertyType}
                    </Badge>
                    {property.instantBook && (
                        <Badge variant="outline" className="border-green-200 text-green-700">
                            <Calendar className="w-3 h-3 mr-1" />
                            Instant Book
                        </Badge>
                    )}
                </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="relative">
                    <div className="aspect-[16/10] relative overflow-hidden rounded-lg">
                        <Image
                            src={property.images[selectedImageIndex] || "/placeholder-property.jpg"}
                            alt={property.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {property.images.length > 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {displayedImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                                    selectedImageIndex === index
                                        ? "border-primary"
                                        : "border-transparent hover:border-muted-foreground"
                                }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${property.title} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                        {property.images.length > 5 && !showAllImages && (
                            <button
                                onClick={() => setShowAllImages(true)}
                                className="aspect-square relative overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground hover:border-primary transition-colors flex items-center justify-center bg-muted"
                            >
                                <span className="text-sm font-medium">+{property.images.length - 5} more</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Property Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Bed className="w-5 h-5 text-muted-foreground" />
                                    <span>{property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Bath className="w-5 h-5 text-muted-foreground" />
                                    <span>{property.bathrooms} {property.bathrooms === 1 ? "bathroom" : "bathrooms"}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                    <span>{property.maxGuests} guests</span>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-medium mb-3">Description</h4>
                                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Amenities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                {displayedAmenities.map((amenity, index) => {
                                    const Icon = amenityIcons[amenity] || Star;
                                    return (
                                        <div key={index} className="flex items-center space-x-3">
                                            <Icon className="w-5 h-5 text-muted-foreground" />
                                            <span>{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {property.amenities.length > 6 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                                    className="mt-4"
                                >
                                    {showAllAmenities ? "Show less" : `Show all ${property.amenities.length} amenities`}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Rules and Policies */}
                    <Card>
                        <CardHeader>
                            <CardTitle>House Rules</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Check-in</h4>
                                    <p className="text-muted-foreground">{property.checkInTime}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Check-out</h4>
                                    <p className="text-muted-foreground">{property.checkOutTime}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-medium mb-3">Property Rules</h4>
                                <ul className="space-y-2">
                                    {property.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                            <span className="text-muted-foreground">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Host Information */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Meet Your Host</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={property.host.avatar} alt={property.host.name} />
                                    <AvatarFallback className="text-lg">
                                        {property.host.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold">{property.host.name}</h3>
                                        {property.host.verified && (
                                            <Shield className="w-4 h-4 text-green-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Host since {new Date(property.host.joinedAt).getFullYear()}
                                    </p>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                                        <span className="text-sm">{property.host.rating}</span>
                                        <span className="text-sm text-muted-foreground">
                                            ({property.host.reviewCount} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">4.9</div>
                                    <div className="text-sm text-muted-foreground">Rating</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">127</div>
                                    <div className="text-sm text-muted-foreground">Reviews</div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Button className="flex-1">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Phone className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">Identity verified</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Award className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm">Superhost</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="text-xs text-muted-foreground">
                                <p>
                                    To protect your payment, never transfer money or communicate outside of the StayHub
                                    website or app.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}