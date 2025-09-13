import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ReduxProvider } from "@/lib/providers/redux-provider";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "StayHub - Professional Property Booking Platform",
    description: "Find and book amazing properties worldwide with StayHub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ReduxProvider>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                        <AuthProvider>
                            {children}
                            <Toaster position="bottom-right" richColors />
                        </AuthProvider>
                    </ThemeProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
