import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/(.*)", // locale root
  "/api/svg/(.*)",
  "/api/fonts/(.*)",
  "/api/preview/(.*)",
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
}
