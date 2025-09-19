import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/properties",
    "/search",
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // For now, allow all requests through since we're handling auth in components
  // The authentication will be handled by the AuthGuard components and hooks
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};