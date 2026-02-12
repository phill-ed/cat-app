import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add security headers
    const response = NextResponse.next()

    // Security headers
    response.headers.set("X-DNS-Prefetch-Control", "on")
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "SAMEORIGIN")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("Referrer-Policy", "origin-when-cross-origin")
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public paths
        if (path === "/" || path.startsWith("/auth/") || path.startsWith("/api/auth/")) {
          return true
        }

        // Require authentication for test routes
        if (path.startsWith("/test/")) {
          return !!token
        }

        // Require authentication for admin routes
        if (path.startsWith("/admin/")) {
          return !!token && token.role === "ADMIN"
        }

        // Require admin for admin API routes
        if (path.startsWith("/api/admin/")) {
          return !!token && token.role === "ADMIN"
        }

        // Require authentication for user-specific API routes
        if (path.startsWith("/api/sessions")) {
          return !!token
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)"
  ]
}
