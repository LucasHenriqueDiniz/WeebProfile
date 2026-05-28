import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import createIntlMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const handleI18nRouting = createIntlMiddleware(routing)

// Routes that require authentication
const isPrivateRoute = createRouteMatcher([
  "/(en|pt|es)/dashboard(.*)",
  "/(en|pt|es)/settings(.*)",
])

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const pathname = request.nextUrl.pathname

  // Normalize locale-prefixed API routes (/pt/api/... → /api/...)
  const localeApiMatch = pathname.match(/^\/(pt|en|es)\/api\/(.*)$/)
  if (localeApiMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/api/${localeApiMatch[2]}`
    return NextResponse.rewrite(url)
  }

  // Skip i18n processing for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Protect private routes — redirect unauthenticated users to sign-in
  if (isPrivateRoute(request)) {
    await auth.protect()
  }

  // Apply i18n routing for page routes
  return handleI18nRouting(request)
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)",
    "/api/:path*",
    "/(pt|en|es)/api/:path*",
  ],
}
