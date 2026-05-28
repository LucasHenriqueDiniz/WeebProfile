import { NextResponse, NextRequest } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Normalize API routes: remove locale prefix if present (/pt/api/... -> /api/...)
  let normalizedPathname = pathname
  const localeMatch = pathname.match(/^\/(pt|en|es)\/api\/(.*)$/)
  if (localeMatch) {
    normalizedPathname = `/api/${localeMatch[2]}`
    const url = request.nextUrl.clone()
    url.pathname = normalizedPathname
    request = new NextRequest(url, request)
  }

  // Skip API routes — they don't need i18n processing
  if (normalizedPathname.startsWith("/api/")) {
    return NextResponse.next({ request })
  }

  const intlResponse = intlMiddleware(request)

  if (intlResponse instanceof Promise) {
    const resolved = await intlResponse
    return resolved || NextResponse.next({ request })
  }

  return intlResponse || NextResponse.next({ request })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)",
    "/api/:path*",
    "/(pt|en|es)/api/:path*",
    "/",
    "/(pt|en|es)/:path*",
  ],
}
