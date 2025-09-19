"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    Bath,
    Bed,
    Car,
    Coffee,
    Home,
    MapPin,
    Shield,
    Tv,
    Upload,
    Users,
    Waves,
    Wifi,
    Wind,
    X,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const propertySchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters"),
    description: z.string().min(50, "Description must be at least 50 characters"),
    propertyType: z.string().min(1, "Please select a property type"),
    bedrooms: z.number().min(1, "At least 1 bedroom required"),
    bathrooms: z.number().min(1, "At least 1 bathroom required"),
    maxGuests: z.number().min(1, "Property must accommodate at least 1 guest"),
    pricePerNight: z.number().min(1, "Price must be greater than 0"),
    address: z.string().min(10, "Please provide a complete address"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "Valid zip code required"),
    country: z.string().min(2, "Country is required"),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const propertyTypes = ["Apartment", "House", "Condo", "Villa", "Townhouse", "Loft", "Studio", "Cabin", "Other"];

const amenities = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "tv", label: "TV", icon: Tv },
    { id: "kitchen", label: "Kitchen", icon: Coffee },
    { id: "pool", label: "Pool", icon: Waves },
    { id: "air_conditioning", label: "Air Conditioning", icon: Wind },
    { id: "heating", label: "Heating", icon: Zap },
    { id: "parking", label: "Free Parking", icon: Car },
    { id: "security", label: "Security System", icon: Shield },
];

export default function AddPropertyPage() {
    const router = useRouter();
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<PropertyFormData>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            bedrooms: 1,
            bathrooms: 1,
            maxGuests: 2,
        },
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 10) {
            toast.error("Maximum 10 images allowed");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        // Create preview URLs
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);

        setImages(newImages);
        setImagePreviewUrls(newPreviewUrls);
    };

    const toggleAmenity = (amenityId: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenityId) ? prev.filter((id) => id !== amenityId) : [...prev, amenityId]
        );
    };

    const onSubmit = async (data: PropertyFormData) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append property data
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            // Append amenities
            formData.append("amenities", JSON.stringify(selectedAmenities));

            // Append images
            images.forEach((image, index) => {
                formData.append(`image_${index}`, image);
            });

            toast.success("Property created successfully!");
            router.push("/host/properties");
        } catch (error) {
            console.error("Error creating property:", error);
            toast.error("Failed to create property");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/host/properties">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Properties
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Add New Property</h1>
                        <p className="text-muted-foreground">Create a new listing for your property</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Home className="w-5 h-5" />
                            <span>Basic Information</span>
                        </CardTitle>
                        <CardDescription>
                            Tell guests about your property with a compelling title and description
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Property Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Beautiful 2BR Apartment in Downtown"
                                {...register("title")}
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your property, its unique features, and what makes it special..."
                                rows={4}
                                {...register("description")}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="propertyType">Property Type</Label>
                                <Select onValueChange={(value) => setValue("propertyType", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes.map((type) => (
                                            <SelectItem key={type} value={type.toLowerCase()}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.propertyType && (
                                    <p className="text-sm text-red-500">{errors.propertyType.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pricePerNight">Price per Night ($)</Label>
                                <Input
                                    id="pricePerNight"
                                    type="number"
                                    min="1"
                                    placeholder="150"
                                    {...register("pricePerNight", { valueAsNumber: true })}
                                    className={errors.pricePerNight ? "border-red-500" : ""}
                                />
                                {errors.pricePerNight && (
                                    <p className="text-sm text-red-500">{errors.pricePerNight.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Property Details</span>
                        </CardTitle>
                        <CardDescription>Specify the capacity and layout of your property</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bedrooms">Bedrooms</Label>
                                <div className="flex items-center space-x-2">
                                    <Bed className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="bedrooms"
                                        type="number"
                                        min="1"
                                        {...register("bedrooms", { valueAsNumber: true })}
                                        className={errors.bedrooms ? "border-red-500" : ""}
                                    />
                                </div>
                                {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bathrooms">Bathrooms</Label>
                                <div className="flex items-center space-x-2">
                                    <Bath className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="bathrooms"
                                        type="number"
                                        min="1"
                                        {...register("bathrooms", { valueAsNumber: true })}
                                        className={errors.bathrooms ? "border-red-500" : ""}
                                    />
                                </div>
                                {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxGuests">Max Guests</Label>
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="maxGuests"
                                        type="number"
                                        min="1"
                                        {...register("maxGuests", { valueAsNumber: true })}
                                        className={errors.maxGuests ? "border-red-500" : ""}
                                    />
                                </div>
                                {errors.maxGuests && <p className="text-sm text-red-500">{errors.maxGuests.message}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span>Location</span>
                        </CardTitle>
                        <CardDescription>Where is your property located?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Input
                                id="address"
                                placeholder="123 Main Street"
                                {...register("address")}
                                className={errors.address ? "border-red-500" : ""}
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    placeholder="New York"
                                    {...register("city")}
                                    className={errors.city ? "border-red-500" : ""}
                                />
                                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    placeholder="NY"
                                    {...register("state")}
                                    className={errors.state ? "border-red-500" : ""}
                                />
                                {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zipCode">Zip Code</Label>
                                <Input
                                    id="zipCode"
                                    placeholder="10001"
                                    {...register("zipCode")}
                                    className={errors.zipCode ? "border-red-500" : ""}
                                />
                                {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                placeholder="United States"
                                {...register("country")}
                                className={errors.country ? "border-red-500" : ""}
                            />
                            {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Amenities</CardTitle>
                        <CardDescription>What amenities does your property offer?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {amenities.map((amenity) => {
                                const Icon = amenity.icon;
                                const isSelected = selectedAmenities.includes(amenity.id);

                                return (
                                    <div
                                        key={amenity.id}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                        onClick={() => toggleAmenity(amenity.id)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon
                                                className={`w-5 h-5 ${
                                                    isSelected ? "text-primary" : "text-muted-foreground"
                                                }`}
                                            />
                                            <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>
                                                {amenity.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Photos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Upload className="w-5 h-5" />
                            <span>Photos</span>
                        </CardTitle>
                        <CardDescription>Add photos to showcase your property (Max 10 images)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-border rounded-lg p-8">
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">Upload Photos</p>
                                    <p className="text-sm text-muted-foreground">
                                        Drag and drop or click to select photos
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="photo-upload"
                                />
                                <Button asChild className="mt-4">
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        Choose Photos
                                    </label>
                                </Button>
                            </div>
                        </div>

                        {imagePreviewUrls.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {imagePreviewUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        {index === 0 && (
                                            <Badge className="absolute bottom-2 left-2 bg-primary">Main Photo</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between pt-6">
                    <Button asChild variant="outline">
                        <Link href="/host/properties">Cancel</Link>
                    </Button>
                    <div className="space-x-4">
                        <Button type="submit" variant="outline">
                            Save as Draft
                        </Button>
                        <Button type="submit">Publish Property</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
