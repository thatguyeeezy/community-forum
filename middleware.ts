// middleware.ts
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

// Helper to get IP address from request
function getIP(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for")
  return xff ? xff.split(",")[0] : "127.0.0.1"
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Create a response object
  const response = NextResponse.next()

  // Redirect from /forums to /community
  if (path.startsWith("/forums")) {
    const newPath = path.replace("/forums", "/community")
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // Skip tracking for API routes, static assets, etc.
  const shouldSkip = path.startsWith("/_next") || path.includes(".") || path === "/favicon.ico"

  if (!shouldSkip) {
    if (session?.sub) {
      // User is logged in - add user ID header
      response.headers.set("x-user-id", session.sub)
    } else {
      // User is a guest - add guest tracking headers
      const ip = getIP(request)
      const userAgent = request.headers.get("user-agent") || ""

      // Add headers for guest tracking
      response.headers.set("x-guest-ip", ip)
      response.headers.set("x-guest-ua", userAgent)
    }
  }

  // For admin route protection
  if (path.startsWith("/admin")) {
    // Redirect to admin login if not authenticated
    if (!session) {
      return NextResponse.redirect(new URL("/admin/signin", request.url))
    }

    // Check if user has admin role
    const userRole = session?.role

    if (!["ADMIN", "MODERATOR", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(userRole as string)) {
      return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", request.url))
    }
  }

  return response
}

// Update the matcher to include more routes for tracking
export const config = {
  matcher: [
    // Include admin routes for protection
    "/admin/:path*",

    // Include forums routes for redirection
    "/forums/:path*",

    // Include main pages for tracking
    "/",
    "/community/:path*",
    "/threads/:path*",
    "/profile/:path*",
    "/members",
  ],
}
