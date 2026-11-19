"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname, Link } from "@/i18n/navigation"
import { LayoutGrid, Plus, Settings, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import { useSvgStore } from "@/stores/svg-store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PreferencesMenu } from "@/components/layout/preferences"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import { UserAvatar, UserMenu, useDisplayName } from "@/components/dashboard/UserMenu"

const COLLAPSE_KEY = "weeb:sidebar-collapsed"

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

/**
 * The signed-in app's navigation on desktop, in the public site's sticker look: an icon
 * rail by default, with labels on demand. The phone has its own tab bar (MobileNav).
 */
export function DashboardSidebar() {
  const t = useTranslations("sidebar")
  const pathname = usePathname()
  const svgCount = useSvgStore((state) => state.svgs.length)
  const name = useDisplayName()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    try {
      setExpanded(localStorage.getItem(COLLAPSE_KEY) === "expanded")
    } catch {
      // Storage blocked: the rail stays collapsed.
    }
  }, [])

  const toggleExpanded = () => {
    setExpanded((prev) => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "expanded" : "collapsed")
      } catch {
        // Storage blocked: the choice lasts until the page reloads.
      }
      return next
    })
  }

  const navItems = [
    { label: t("mySvgs"), href: "/dashboard", icon: LayoutGrid },
    { label: t("settings"), href: "/dashboard/settings", icon: Settings },
  ]
  const atLimit = svgCount >= MAX_SVGS_FREE_TIER

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 hidden h-svh flex-shrink-0 flex-col border-r-2 border-foreground bg-card transition-[width] duration-200 ease-out md:flex",
        expanded ? "w-[220px]" : "w-[76px]"
      )}
    >
      <div className={cn("flex h-16 flex-shrink-0 items-center", expanded ? "gap-2.5 px-4" : "justify-center")}>
        <Link href="/dashboard" className={cn("group flex items-center gap-2.5 rounded-lg", FOCUS)}>
          <img
            src="/sora/sora-head.png"
            alt="WeebProfile"
            className="h-9 w-9 object-contain transition-transform group-hover:scale-110"
          />
          {expanded && (
            <span className="whitespace-nowrap font-heading text-sm font-extrabold text-foreground">WeebProfile</span>
          )}
        </Link>
      </div>

      {/* The main action: the same cyan sticker button as the public site. */}
      <div className={cn("flex-shrink-0", expanded ? "px-3" : "px-2.5")}>
        <RailTooltip label={t("createNew")} show={!expanded}>
          <Link
            href="/dashboard/new"
            aria-label={t("createNew")}
            className={cn(
              "flex items-center rounded-xl border-2 border-foreground bg-cyan-400 text-slate-950 shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-px hover:translate-y-px hover:bg-cyan-300 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]",
              FOCUS,
              expanded ? "justify-start gap-2 px-3 py-2.5" : "mx-auto h-11 w-11 justify-center"
            )}
          >
            <Plus className="h-5 w-5 flex-shrink-0" />
            {expanded && <span className="whitespace-nowrap text-sm font-bold">{t("createNew")}</span>}
          </Link>
        </RailTooltip>

        {svgCount > 0 && (
          <div
            className={cn(
              "mt-2.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold",
              expanded ? "px-1" : "justify-center",
              atLimit ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"
            )}
          >
            {svgCount}/{MAX_SVGS_FREE_TIER}
            {expanded && <span className="font-sans font-normal">{t("svgsUsed")}</span>}
          </div>
        )}
      </div>

      <nav className={cn("mt-5 flex flex-1 flex-col gap-1.5", expanded ? "px-3" : "px-2.5")}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.endsWith(item.href)
          return (
            <RailTooltip key={item.href} label={item.label} show={!expanded}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={expanded ? undefined : item.label}
                className={cn(
                  "flex items-center rounded-xl transition-colors",
                  FOCUS,
                  expanded ? "gap-3 px-3 py-2.5" : "mx-auto h-11 w-11 justify-center",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                {expanded && <span className="whitespace-nowrap text-sm font-semibold">{item.label}</span>}
              </Link>
            </RailTooltip>
          )
        })}
      </nav>

      <div className={cn("flex flex-shrink-0 flex-col gap-1.5 pb-2", expanded ? "px-3" : "items-center px-2.5")}>
        <PreferencesMenu tone="theme" compact={!expanded} side="right" className={cn(expanded && "self-start")} />
        <button
          type="button"
          onClick={toggleExpanded}
          aria-label={expanded ? t("collapse") : t("expand")}
          className={cn(
            "flex items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            FOCUS,
            expanded ? "w-full gap-3 px-3 py-2" : "h-9 w-11 justify-center"
          )}
        >
          {expanded ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
          {expanded && <span className="text-xs font-medium">{t("collapse")}</span>}
        </button>
      </div>

      <div className={cn("flex-shrink-0 border-t-2 border-foreground py-2.5", expanded ? "px-3" : "px-2.5")}>
        <UserMenu
          side={expanded ? "top" : "right"}
          trigger={
            <button
              type="button"
              aria-label={name}
              className={cn(
                "flex items-center rounded-xl transition-colors hover:bg-accent",
                FOCUS,
                expanded ? "w-full gap-3 px-2 py-2" : "mx-auto h-11 w-11 justify-center"
              )}
            >
              <UserAvatar />
              {expanded && <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold">{name}</span>}
            </button>
          }
        />
      </div>
    </aside>
  )
}

function RailTooltip({ label, show, children }: { label: string; show: boolean; children: ReactNode }) {
  if (!show) return <>{children}</>
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
