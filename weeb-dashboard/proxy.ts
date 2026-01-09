import { createServerClient } from "@supabase/ssr"
import { NextResponse, NextRequest } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Normalize API routes: remove locale prefix if present (/pt/api/... -> /api/...)
  let normalizedPathname = pathname
  const localeMatch = pathname.match(/^\/(pt|en|es)\/api\/(.*)$/)
  if (localeMatch) {
    normalizedPathname = `/api/${localeMatch[2]}`
    // Rewrite the URL to remove locale prefix for API routes
    const url = request.nextUrl.clone()
    url.pathname = normalizedPathname
    request = new NextRequest(url, request)
  }

  // Skip API routes completely - they don't need i18n or Supabase auth processing
  if (normalizedPathname.startsWith("/api/")) {
    return NextResponse.next({ request })
  }

  // First, handle i18n routing
  const intlResponse = intlMiddleware(request)

  // If i18n middleware returns a redirect/response, use it as base
  // Otherwise, create a new response for Supabase auth
  let response: NextResponse

  if (intlResponse) {
    // If it's a Promise, await it
    if (intlResponse instanceof Promise) {
      const resolved = await intlResponse
      if (resolved && (resolved.status === 307 || resolved.status === 308)) {
        return resolved
      }
      response = resolved || NextResponse.next({ request })
    } else if (intlResponse.status === 307 || intlResponse.status === 308) {
      return intlResponse
    } else {
      response = intlResponse
    }
  } else {
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in proxy")
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files, images
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)",
    // Include API routes with and without locale prefix
    "/api/:path*",
    "/(pt|en|es)/api/:path*",
    // Also match root and locale paths for i18n
    "/",
    "/(pt|en|es)/:path*",
  ],
}
