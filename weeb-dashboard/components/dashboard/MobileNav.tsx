"use client"

import { useRouter, usePathname, Link } from "@/i18n/navigation"
import { LayoutGrid, Plus, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Fixed bottom tab bar for mobile - replaces the generic admin "slide-out drawer"
// pattern with something that reads as a product's own navigation, not a borrowed
// admin template component. "Criar" sits elevated in the center as the primary action.
export function MobileNav() {
  const t = useTranslations("sidebar")
  const tHeader = useTranslations("header")
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isLibraryActive = pathname === "/dashboard" || pathname?.endsWith("/dashboard")
  const isSettingsActive = pathname?.endsWith("/dashboard/settings")

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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-sidebar-border bg-sidebar/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-around h-16 px-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 h-full text-[10px] font-medium",
            isLibraryActive ? "text-sidebar-primary" : "text-sidebar-foreground/60"
          )}
        >
          <LayoutGrid className="w-5 h-5" />
          {t("mySvgs")}
        </Link>

        <Link
          href="/dashboard/new"
          className="flex flex-col items-center justify-center -mt-6"
          aria-label={t("createNew")}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.35)]">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </Link>

        <Link
          href="/dashboard/settings"
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 h-full text-[10px] font-medium",
            isSettingsActive ? "text-sidebar-primary" : "text-sidebar-foreground/60"
          )}
        >
          <Settings className="w-5 h-5" />
          {t("settings")}
        </Link>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 w-16 h-full">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center ring-1 ring-sidebar-border">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-[10px] font-bold">{initial}</span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-sidebar-foreground/60">{t("user")}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-56 rounded-lg border shadow-lg">
              <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-2">
                <span className="text-sm font-semibold">
                  {user.user_metadata?.user_name || user.email?.split("@")[0] || t("user")}
                </span>
                {user.email && <span className="text-xs text-muted-foreground font-normal">{user.email}</span>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2.5" />
                {tHeader("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}
