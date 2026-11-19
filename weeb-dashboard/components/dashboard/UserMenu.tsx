"use client"

import type { ReactNode } from "react"
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitch, ThemeSwitch } from "@/components/layout/preferences"
import { cn } from "@/lib/utils"

/** The signed-in user's name for display: GitHub login, else the e-mail's local part. */
export function useDisplayName(): string {
  const t = useTranslations("sidebar")
  const { user } = useAuth()
  return user?.user_metadata?.user_name || user?.email?.split("@")[0] || t("user")
}

/** The user's picture in an ink ring, or their initial on pink when they have none. */
export function UserAvatar({ className, textClassName }: { className?: string; textClassName?: string }) {
  const { user } = useAuth()
  const src = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const initial = (user?.user_metadata?.user_name?.[0] || user?.email?.[0] || "U").toUpperCase()
  return (
    <span
      className={cn(
        "flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-pink-300",
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className={cn("text-sm font-bold text-slate-950", textClassName)}>{initial}</span>
      )}
    </span>
  )
}

/**
 * The account menu, opened from the avatar: who is signed in, language and theme, sign
 * out. The rail and the phone tab bar each had their own copy, and the phone one had no
 * language or theme at all, so signed in on a phone neither could be changed.
 */
export function UserMenu({
  trigger,
  side = "top",
  withPreferences = false,
}: {
  trigger: ReactNode
  side?: "top" | "right" | "bottom"
  /** Language and theme inside the menu, where the page has no other place for them. */
  withPreferences?: boolean
}) {
  const t = useTranslations("header")
  const tTheme = useTranslations("settings.appearance")
  const { user, signOut } = useAuth()
  const router = useRouter()
  const name = useDisplayName()

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      router.push("/login")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={side}
        sideOffset={10}
        className="w-64 rounded-xl border-2 border-foreground p-1.5 shadow-[4px_4px_0_0_hsl(var(--primary))]"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2.5 py-2">
          <span className="truncate text-sm font-semibold">{name}</span>
          {user.email && <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>}
        </DropdownMenuLabel>
        {withPreferences && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
              <span className="text-xs font-semibold text-muted-foreground">{t("language")}</span>
              <LanguageSwitch tone="theme" />
            </div>
            <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
              <span className="text-xs font-semibold text-muted-foreground">{tTheme("theme")}</span>
              <ThemeSwitch tone="theme" />
            </div>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer rounded-lg px-2.5 py-2 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2.5 h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
