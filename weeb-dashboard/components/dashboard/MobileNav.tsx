"use client"

import { usePathname, Link } from "@/i18n/navigation"
import { LayoutGrid, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import { UserAvatar, UserMenu } from "@/components/dashboard/UserMenu"

const TAB = "flex h-full w-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold"

/**
 * The phone's tab bar: the library, a raised "new" button, settings and the account.
 * The account menu carries language and theme, which have no other place on a phone.
 */
export function MobileNav() {
  const t = useTranslations("sidebar")
  const pathname = usePathname()

  const isLibraryActive = pathname === "/dashboard" || pathname?.endsWith("/dashboard")
  const isSettingsActive = pathname?.endsWith("/dashboard/settings")

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-foreground bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label={t("navigation")}
    >
      <div className="flex h-16 items-center justify-around px-2">
        <Link
          href="/dashboard"
          aria-current={isLibraryActive ? "page" : undefined}
          className={cn(TAB, isLibraryActive ? "text-foreground" : "text-muted-foreground")}
        >
          <span className={cn("rounded-lg px-3 py-0.5", isLibraryActive && "bg-foreground text-background")}>
            <LayoutGrid className="h-5 w-5" />
          </span>
          {t("mySvgs")}
        </Link>

        <Link href="/dashboard/new" className="-mt-7 flex flex-col items-center" aria-label={t("createNew")}>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-foreground bg-cyan-400 text-slate-950 shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            <Plus className="h-6 w-6" />
          </span>
        </Link>

        <Link
          href="/dashboard/settings"
          aria-current={isSettingsActive ? "page" : undefined}
          className={cn(TAB, isSettingsActive ? "text-foreground" : "text-muted-foreground")}
        >
          <span className={cn("rounded-lg px-3 py-0.5", isSettingsActive && "bg-foreground text-background")}>
            <Settings className="h-5 w-5" />
          </span>
          {t("settings")}
        </Link>

        <UserMenu
          withPreferences
          trigger={
            <button type="button" className={cn(TAB, "text-muted-foreground")}>
              <UserAvatar className="h-7 w-7" textClassName="text-[11px]" />
              {t("user")}
            </button>
          }
        />
      </div>
    </nav>
  )
}
