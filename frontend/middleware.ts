import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Routes that are hidden from public access.
 * These pages still exist on disk for future use — they're just blocked here.
 * To re-enable a route, simply remove it from this list.
 */
const HIDDEN_ROUTES = [
    // E-commerce
    "/cart",
    "/checkout",
    "/order-confirmation",
    "/orders",
    "/track-order",
    // Auth
    "/login",
    "/signup",
    "/forgot-password",
    "/auth",
    "/account",
    // Social
    "/wishlist",
    "/compare",
    "/reviews",
    // Collections
    "/collections",
    "/saree",
    "/women",
    "/products",
    // Programs
    "/admin",
    "/affiliate",
    "/loyalty",
    "/gift-cards",
    "/waitlist",
    "/wholesale",
    // Support & misc
    "/blog",
    "/stores",
    "/returns",
    "/support",
    "/test",
    // Extra policies
    "/faq",
    "/accessibility",
    "/gdpr",
    "/cookie-policy",
    "/size-guide",
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the current path starts with any hidden route
    const isHidden = HIDDEN_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    )

    if (isHidden) {
        // Redirect to homepage
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

export const config = {
    // Only run middleware on page routes, skip API/static/internal routes
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
    ],
}
