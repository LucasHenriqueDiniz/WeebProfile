/**
 * Compatibility shim: replaces next-intl/navigation with TanStack Router equivalents.
 * Components that imported from @/i18n/navigation work unchanged.
 */
import { Link as RouterLink, useNavigate, useRouterState } from "@tanstack/react-router"
import React from "react"

export function useRouter() {
  const navigate = useNavigate()
  return {
    push: (href: string) => navigate({ to: href as any }),
    replace: (href: string) => navigate({ to: href as any, replace: true }),
    back: () => window.history.back(),
    prefetch: () => {},
    refresh: () => window.location.reload(),
  }
}

export function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname })
}

export const Link = React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentProps<typeof RouterLink>, "to"> & { href?: string; to?: string }
>(({ href, to, ...props }, ref) => {
  return <RouterLink {...(props as any)} to={(to ?? href ?? "/") as any} ref={ref as any} />
})
Link.displayName = "Link"

export function redirect(href: string) {
  window.location.href = href
}

export function getPathname({ href }: { href: string }) {
  return href
}
