import { LoginPageContent, LoginPageLoading } from "@/components/auth/LoginPageContent";
import { Suspense } from "react";

// Main export with Suspense wrapper
export default function LoginPage() {
    return (
        <Suspense fallback={<LoginPageLoading />}>
            <LoginPageContent />
        </Suspense>
    );
}
