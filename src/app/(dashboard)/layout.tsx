"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar userRole={user.role} />
            <main className="flex-1 lg:pl-64">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}