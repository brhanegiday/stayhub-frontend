"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Star, MapPin, Users, Bed, Bath, Wifi, Car, Coffee } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addToFavorites, removeFromFavorites } from "@/store/slices/preferences-slice";
import { Property } from "@/types/property";

interface PropertyCardProps {
    property: Property;
    variant?: "default" | "compact";
}

export function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
    const dispatch = useDispatch();
    const { favorites } = useSelector((state: RootState) => state.preferences);
    const [imageLoading, setImageLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isFavorite = favorites.includes(property.id);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavorite) {
            dispatch(removeFromFavorites(property.id));
        } else {
            dispatch(addToFavorites(property.id));
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getAmenityIcon = (amenity: string) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes("wifi") || amenityLower.includes("internet")) return Wifi;
        if (amenityLower.includes("parking") || amenityLower.includes("garage")) return Car;
        if (amenityLower.includes("kitchen") || amenityLower.includes("coffee")) return Coffee;
        return null;
    };

    const cardClasses =
        variant === "compact"
            ? "group cursor-pointer hover:shadow-lg transition-all duration-300"
            : "group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1";

    return (
        <Card className={cardClasses}>
            <Link href={`/properties/${property.id}`}>
                <div className="relative">
                    {/* Image Gallery */}
                    <div className="relative h-48 md:h-56 overflow-hidden rounded-t-lg">
                        {property.images.length > 0 && (
                            <>
                                <Image
                                    src={property.images[currentImageIndex] || "/placeholder-property.jpg"}
                                    alt={property.title}
                                    fill
                                    className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                                        imageLoading ? "blur-sm" : "blur-0"
                                    }`}
                                    onLoad={() => setImageLoading(false)}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Image Navigation Dots */}
                                {property.images.length > 1 && (
                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                        {property.images.slice(0, 5).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setCurrentImageIndex(index);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    index === currentImageIndex
                                                        ? "bg-white"
                                                        : "bg-white/60 hover:bg-white/80"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Property Type Badge */}
                        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                            {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                        </Badge>

                        {/* Favorite Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 bg-background/90 hover:bg-background"
                            onClick={toggleFavorite}
                        >
                            <Heart
                                className={`w-4 h-4 ${
                                    isFavorite
                                        ? "fill-red-500 text-red-500"
                                        : "text-muted-foreground hover:text-red-500"
                                }`}
                            />
                        </Button>
                    </div>

                    <CardContent className="p-4 space-y-3">
                        {/* Location */}
                        <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">
                                {property.location.city}, {property.location.country}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {property.title}
                        </h3>

                        {/* Description */}
                        {variant === "default" && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
                        )}

                        {/* Property Details */}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{property.maxGuests} guests</span>
                            </div>
                            <div className="flex items-center">
                                <Bed className="w-4 h-4 mr-1" />
                                <span>
                                    {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Bath className="w-4 h-4 mr-1" />
                                <span>
                                    {property.bathrooms} bath{property.bathrooms > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        {/* Amenities Preview */}
                        {variant === "default" && property.amenities.length > 0 && (
                            <div className="flex items-center space-x-2">
                                {property.amenities.slice(0, 3).map((amenity, index) => {
                                    const Icon = getAmenityIcon(amenity);
                                    return Icon ? (
                                        <div key={index} className="flex items-center text-xs text-muted-foreground">
                                            <Icon className="w-3 h-3 mr-1" />
                                            <span>{amenity}</span>
                                        </div>
                                    ) : null;
                                })}
                                {property.amenities.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                        +{property.amenities.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Host Info & Rating */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {property.host && (
                                    <>
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={property.host.avatar} alt={property.host.name} />
                                            <AvatarFallback>
                                                {property.host.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-muted-foreground">{property.host.name}</span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center text-sm">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-medium">4.8</span>
                                <span className="text-muted-foreground ml-1">(24)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline justify-between pt-2">
                            <div>
                                <span className="text-xl font-bold text-foreground">
                                    {formatPrice(property.pricePerNight)}
                                </span>
                                <span className="text-sm text-muted-foreground ml-1">/ night</span>
                            </div>

                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Handle quick book action
                                }}
                            >
                                Book Now
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Link>
        </Card>
    );
}
