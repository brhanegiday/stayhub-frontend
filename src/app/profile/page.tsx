/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/store";
import { useUpdateUserMutation } from "@/store/api/users-api";
import { updateUser } from "@/store/slices/auth-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Camera, Edit3, Loader2, Mail, MapPin, Phone, Save, Shield, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    location: z.string().optional(),
    dateOfBirth: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || "",
                bio: user.bio || "",
                location: user.location || "",
                dateOfBirth: user.dateOfBirth || "",
            });
        }
    }, [user, isAuthenticated, router, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const updatedUser = await updateUserMutation({
                id: user!.id,
                ...data,
            }).unwrap();

            if (updatedUser.data) {
                dispatch(updateUser(updatedUser.data));
            }
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    const handleCancel = () => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || "",
                bio: user.bio || "",
                location: user.location || "",
                dateOfBirth: user.dateOfBirth || "",
            });
        }
        setIsEditing(false);
        setAvatarPreview(null);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings and personal information</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Overview */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="relative inline-block">
                                        <Avatar className="w-24 h-24">
                                            <AvatarImage
                                                src={avatarPreview || user.avatar}
                                                alt={`${user.firstName} ${user.lastName}`}
                                            />
                                            <AvatarFallback className="text-2xl">
                                                {user.firstName[0]}
                                                {user.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <p className="text-muted-foreground capitalize">{user.role}</p>
                                    </div>

                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{user.email}</span>
                                        </div>
                                        {user.location && (
                                            <div className="flex items-center justify-center space-x-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{user.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400">
                                            <Shield className="w-4 h-4" />
                                            <span>Verified Account</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>
                                            Update your personal details and profile information
                                        </CardDescription>
                                    </div>
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)} variant="outline">
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSubmit(onSubmit)} disabled={isUpdating || !isDirty}>
                                                {isUpdating ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2" />
                                                )}
                                                Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="firstName"
                                                    {...register("firstName")}
                                                    disabled={!isEditing}
                                                    className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {errors.firstName && (
                                                <p className="text-sm text-destructive">{errors.firstName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="lastName"
                                                    {...register("lastName")}
                                                    disabled={!isEditing}
                                                    className={`pl-10 ${errors.lastName ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {errors.lastName && (
                                                <p className="text-sm text-destructive">{errors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register("email")}
                                                disabled={true} // Email should not be editable
                                                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Email cannot be changed. Contact support if needed.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    {...register("phone")}
                                                    disabled={!isEditing}
                                                    placeholder="Enter phone number"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="dateOfBirth"
                                                    type="date"
                                                    {...register("dateOfBirth")}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                {...register("location")}
                                                disabled={!isEditing}
                                                placeholder="City, Country"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            {...register("bio")}
                                            disabled={!isEditing}
                                            placeholder="Tell us about yourself..."
                                            className="min-h-[120px]"
                                        />
                                        <p className="text-xs text-muted-foreground text-right">
                                            {watch("bio")?.length || 0}/500 characters
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium">Account Settings</h4>
                                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                            <div>
                                                <p className="font-medium">Change Password</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Update your password to keep your account secure
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Change Password
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                            <div>
                                                <p className="font-medium">Two-Factor Authentication</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Enable
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
