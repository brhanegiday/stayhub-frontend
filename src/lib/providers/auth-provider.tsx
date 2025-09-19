"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { initializeAuth } from "@/store/slices/auth-slice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}