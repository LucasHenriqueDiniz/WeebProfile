/**
 * Shim for next/navigation hooks — used via import aliasing in components.
 * Not meant to replace all of next/navigation, only what's actually used in this codebase.
 */
import { useNavigate, useParams as useRouterParams, useRouterState } from "@tanstack/react-router"

export function useSearchParams() {
  const search = useRouterState({ select: (s) => s.location.search })
  const params = new URLSearchParams(search)
  return {
    get: (key: string) => params.get(key),
    getAll: (key: string) => params.getAll(key),
    has: (key: string) => params.has(key),
    toString: () => params.toString(),
    entries: () => params.entries(),
    keys: () => params.keys(),
    values: () => params.values(),
  }
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useRouterParams({ strict: false }) as unknown as T
}

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
