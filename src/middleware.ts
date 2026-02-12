import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add custom logic here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public paths
        if (path === "/" || path.startsWith("/auth/") || path.startsWith("/api/auth/")) {
          return true
        }

        // Require authentication for admin routes
        if (path.startsWith("/admin/") || path.startsWith("/test/")) {
          return !!token
        }

        // Require admin role for admin API routes
        if (path.startsWith("/api/admin/")) {
          return !!token && token.role === "ADMIN"
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
}
