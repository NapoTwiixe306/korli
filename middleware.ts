import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js middleware for route protection and public route handling.
 * 
 * Allows public routes (login, register, home, user pages) and delegates
 * authentication checks to individual pages for protected routes.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Let Caddy handle ACME challenges
  if (pathname.startsWith("/.well-known/acme-challenge/")) {
    return NextResponse.next()
  }

  const publicRoutes = ["/login", "/register", "/"]
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth")

  const isUserPage = /^\/[^\/]+$/.test(pathname) && 
    !pathname.startsWith("/pages") && 
    !pathname.startsWith("/dashboard") && 
    !pathname.startsWith("/api")

  if (isPublicRoute || isUserPage) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  // Exclude .well-known from middleware to let Caddy handle ACME challenges
  exclude: ["/.well-known/(.*)"],
}
