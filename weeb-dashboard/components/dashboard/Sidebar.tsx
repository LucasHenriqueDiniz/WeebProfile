"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, Link } from "@/i18n/navigation"
import { LayoutGrid, Plus, Settings, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import { useSvgStore } from "@/stores/svg-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const MAX_SVGS_FREE_TIER = 3
const COLLAPSE_KEY = "weeb:sidebar-collapsed"

// Compact icon-rail by default (not a wide admin sidebar) - expands on demand to show
// labels. This is a from-scratch component, not the shadcn Sidebar primitive: full
// control over composition, no Sheet/cookie machinery we don't need since mobile has
// its own bottom nav (see MobileNav.tsx).
export function DashboardSidebar() {
  const t = useTranslations("sidebar")
  const tHeader = useTranslations("header")
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const svgCount = useSvgStore((state) => state.svgs.length)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_KEY)
    if (stored) setExpanded(stored === "expanded")
  }, [])

  const toggleExpanded = () => {
    setExpanded((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSE_KEY, next ? "expanded" : "collapsed")
      return next
    })
  }

  const navItems = [
    { label: t("mySvgs"), href: "/dashboard", icon: LayoutGrid },
    { label: t("settings"), href: "/dashboard/settings", icon: Settings },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch {
      router.push("/login")
    }
  }

  const initial = user?.user_metadata?.user_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-svh sticky top-0 flex-shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out z-20",
        expanded ? "w-[220px]" : "w-[76px]"
      )}
    >
      {/* Brand */}
      <div className={cn("flex items-center h-16 flex-shrink-0", expanded ? "px-4 gap-2.5" : "justify-center")}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <img
            src="/sora/sora-head.png"
            alt="WeebProfile"
            className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.35)] transition-transform group-hover:scale-110"
          />
          {expanded && <span className="font-heading font-bold text-sm text-foreground whitespace-nowrap">WeebProfile</span>}
        </Link>
      </div>

      {/* Primary CTA - own visual weight, not a nav item */}
      <div className={cn("flex-shrink-0", expanded ? "px-3" : "px-2.5")}>
        <RailTooltip label={t("createNew")} show={!expanded}>
          <Link
            href="/dashboard/new"
            className={cn(
              "flex items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:opacity-90 transition-opacity",
              expanded ? "gap-2 px-3 py-2.5 justify-start" : "justify-center h-11 w-11 mx-auto"
            )}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {expanded && <span className="text-sm font-semibold whitespace-nowrap">{t("createNew")}</span>}
          </Link>
        </RailTooltip>

        {svgCount > 0 && expanded && (
          <div className="mt-2 flex items-center gap-1.5 px-1 text-[11px] font-mono text-muted-foreground">
            <span
              className={cn(
                "inline-block w-1.5 h-1.5 rounded-full",
                svgCount >= MAX_SVGS_FREE_TIER ? "bg-amber-400" : "bg-cyan-400/70"
              )}
            />
            {svgCount}/{MAX_SVGS_FREE_TIER} {t("svgsUsed")}
          </div>
        )}
        {svgCount > 0 && !expanded && (
          <div className="mt-1.5 flex justify-center">
            <span
              className={cn(
                "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full",
                svgCount >= MAX_SVGS_FREE_TIER
                  ? "text-amber-400 bg-amber-400/10"
                  : "text-cyan-300/80 bg-cyan-400/10"
              )}
            >
              {svgCount}/{MAX_SVGS_FREE_TIER}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 mt-6 flex flex-col gap-1", expanded ? "px-3" : "px-2.5")}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.endsWith(item.href)
          return (
            <RailTooltip key={item.href} label={item.label} show={!expanded}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-xl transition-colors",
                  expanded ? "gap-3 px-3 py-2.5" : "justify-center h-11 w-11 mx-auto",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-sidebar-primary" />
                )}
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {expanded && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              </Link>
            </RailTooltip>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className={cn("flex-shrink-0 pb-1", expanded ? "px-3" : "px-2.5")}>
        <button
          onClick={toggleExpanded}
          className={cn(
            "flex items-center rounded-xl text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            expanded ? "gap-3 px-3 py-2 w-full" : "justify-center h-9 w-11 mx-auto"
          )}
        >
          {expanded ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
          {expanded && <span className="text-xs">{t("collapse")}</span>}
        </button>
      </div>

      {/* User */}
      <div className={cn("flex-shrink-0 border-t border-sidebar-border py-2.5", expanded ? "px-3" : "px-2.5")}>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center rounded-xl hover:bg-sidebar-accent transition-colors",
                  expanded ? "gap-3 px-2 py-2 w-full" : "justify-center h-11 w-11 mx-auto"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full ring-1 ring-white/10 overflow-hidden bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                    {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                      <img
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">{initial}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-sidebar" />
                </div>
                {expanded && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium truncate">
                      {user.user_metadata?.user_name || user.email?.split("@")[0] || t("user")}
                    </div>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-64 rounded-lg border shadow-lg">
              <DropdownMenuLabel className="flex flex-col gap-1.5 px-3 py-2.5">
                <span className="text-sm font-semibold">
                  {user.user_metadata?.user_name || user.email?.split("@")[0] || t("user")}
                </span>
                {user.email && <span className="text-xs text-muted-foreground font-normal">{user.email}</span>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive cursor-pointer px-3 py-2.5 rounded-md mx-1 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2.5" />
                {tHeader("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  )
}

function RailTooltip({ label, show, children }: { label: string; show: boolean; children: React.ReactNode }) {
  if (!show) return <>{children}</>
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
