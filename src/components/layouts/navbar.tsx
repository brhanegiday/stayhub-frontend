"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Calendar, Building, User, Settings, LogOut, Menu, Plus, Bell, Heart } from "lucide-react";
import { RootState } from "@/store";
import { clearCredentials } from "@/store/slices/auth-slice";
import { useLogoutMutation } from "@/store/api/auth-api";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(clearCredentials());
            router.push("/");
        } catch (error) {
            // Handle error silently or show notification
            dispatch(clearCredentials());
            router.push("/");
        }
    };

    const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
        <>
            <Link
                href="/"
                className={`${
                    mobile ? "block py-3 px-4" : ""
                } text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2`}
                onClick={mobile ? () => setIsOpen(false) : undefined}
            >
                <Search className="w-4 h-4" />
                Explore
            </Link>

            {isAuthenticated && user && (
                <>
                    <Link
                        href="/bookings"
                        className={`${
                            mobile ? "block py-3 px-4" : ""
                        } text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2`}
                        onClick={mobile ? () => setIsOpen(false) : undefined}
                    >
                        <Calendar className="w-4 h-4" />
                        My Bookings
                    </Link>

                    <Link
                        href="/favorites"
                        className={`${
                            mobile ? "block py-3 px-4" : ""
                        } text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2`}
                        onClick={mobile ? () => setIsOpen(false) : undefined}
                    >
                        <Heart className="w-4 h-4" />
                        Favorites
                    </Link>

                    {user.role === "host" && (
                        <>
                            <Link
                                href="/host/dashboard"
                                className={`${
                                    mobile ? "block py-3 px-4" : ""
                                } text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2`}
                                onClick={mobile ? () => setIsOpen(false) : undefined}
                            >
                                <Building className="w-4 h-4" />
                                Host Dashboard
                            </Link>
                        </>
                    )}
                </>
            )}
        </>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Home className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">StayHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavItems />
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />

                        {isAuthenticated && user ? (
                            <div className="flex items-center space-x-3">
                                {user.role === "host" && (
                                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                                        <Link href="/host/properties/new">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Property
                                        </Link>
                                    </Button>
                                )}

                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-4 h-4" />
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                                        3
                                    </Badge>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>
                                                {user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden lg:block text-left">
                                            <p className="text-sm font-medium">{user.name.split(" ")[0]}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="flex items-center space-x-2 p-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center">
                                                <User className="w-4 h-4 mr-2" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/bookings" className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                My Bookings
                                            </Link>
                                        </DropdownMenuItem>
                                        {user.role === "host" && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/host/dashboard" className="flex items-center">
                                                    <Building className="w-4 h-4 mr-2" />
                                                    Host Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="flex items-center">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/login">Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px]">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center space-x-2 pb-6 border-b">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                            <Home className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <span className="text-xl font-bold">StayHub</span>
                                    </div>

                                    <div className="flex-1 py-6">
                                        {isAuthenticated && user && (
                                            <div className="flex items-center space-x-3 mb-6 p-3 bg-muted rounded-lg">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {user.role}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <nav className="space-y-2">
                                            <NavItems mobile />

                                            {isAuthenticated && user && (
                                                <>
                                                    <Link
                                                        href="/profile"
                                                        className="block py-3 px-4 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        href="/settings"
                                                        className="block py-3 px-4 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Settings
                                                    </Link>
                                                    {user.role === "host" && (
                                                        <Link
                                                            href="/host/properties/new"
                                                            className="block py-3 px-4 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Add Property
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </nav>
                                    </div>

                                    <div className="border-t pt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium">Theme</span>
                                            <ThemeToggle />
                                        </div>

                                        {isAuthenticated ? (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sign Out
                                            </Button>
                                        ) : (
                                            <div className="space-y-3">
                                                <Button variant="outline" className="w-full" asChild>
                                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                                        Sign In
                                                    </Link>
                                                </Button>
                                                <Button className="w-full" asChild>
                                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                                        Get Started
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
