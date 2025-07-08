import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only protect admin routes (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && 
      request.nextUrl.pathname !== "/admin/login") {
    
    // Check for auth cookie
    const authToken = request.cookies.get("authToken")?.value
    
    // If no auth token, redirect to login
    if (!authToken || authToken !== "admin-authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
} 