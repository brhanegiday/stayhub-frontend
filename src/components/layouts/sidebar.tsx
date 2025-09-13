"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store";
import { clearCredentials } from "@/store/slices/auth-slice";
import {
    BarChart3,
    Building2,
    Calendar,
    Heart,
    Home,
    LogOut,
    Menu,
    Settings,
    Star,
    User,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SidebarProps {
    userRole: "host" | "renter";
}

export function Sidebar({ userRole }: SidebarProps) {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    const hostNavItems = [
        {
            title: "Dashboard",
            href: "/host/dashboard",
            icon: Home,
        },
        {
            title: "Properties",
            href: "/host/properties",
            icon: Building2,
        },
        {
            title: "Bookings",
            href: "/host/bookings",
            icon: Calendar,
        },
        {
            title: "Analytics",
            href: "/host/analytics",
            icon: BarChart3,
        },
    ];

    const renterNavItems = [
        {
            title: "Dashboard",
            href: "/renter/dashboard",
            icon: Home,
        },
        {
            title: "My Bookings",
            href: "/renter/bookings",
            icon: Calendar,
        },
        {
            title: "Favorites",
            href: "/renter/favorites",
            icon: Heart,
        },
    ];

    const navItems = userRole === "host" ? hostNavItems : renterNavItems;

    const handleLogout = () => {
        dispatch(clearCredentials());
    };

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + "/");
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Home className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">StayHub</span>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                            {user?.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.href}>
                                <Button
                                    asChild
                                    variant={active ? "default" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <Link href={item.href}>
                                        <Icon className="mr-3 h-4 w-4" />
                                        {item.title}
                                    </Link>
                                </Button>
                            </li>
                        );
                    })}
                </ul>

                <Separator className="my-6" />

                {/* Additional Actions */}
                <ul className="space-y-2">
                    <li>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <Link href="/profile">
                                <User className="mr-3 h-4 w-4" />
                                Profile
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <Link href="/">
                                <Star className="mr-3 h-4 w-4" />
                                Browse Properties
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                        </Button>
                    </li>
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-6 border-t">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-destructive hover:text-destructive"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50"
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:z-auto
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <SidebarContent />
            </aside>
        </>
    );
}