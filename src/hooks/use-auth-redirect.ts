import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (session) {
      // User is authenticated, redirect to intended destination or dashboard
      const callbackUrl = searchParams.get("callbackUrl") || localStorage.getItem("intendedDestination");

      if (callbackUrl) {
        localStorage.removeItem("intendedDestination");
        router.push(callbackUrl);
      } else {
        // Default redirect based on role
        const role = session.user.role || "renter";
        const defaultPath = role === "host" ? "/host/dashboard" : "/";
        router.push(defaultPath);
      }
    }
  }, [session, status, router, searchParams]);

  return { session, status };
}

export function useRequireAuth(redirectTo = "/login") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // Store the intended destination
      localStorage.setItem("intendedDestination", window.location.pathname + window.location.search);
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  return { session, status, isAuthenticated: !!session };
}