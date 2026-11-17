"use client"

import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useThemeStore } from "@/stores/theme-store"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslations } from "@/i18n/use-translations"

const OPTIONS = [
  { id: "light", icon: Sun },
  { id: "dark", icon: Moon },
  { id: "system", icon: Monitor },
] as const

/**
 * Theme menu in the header: light, dark or the system's. It used to toggle between light
 * and dark only, so "system" lived in Settings > Appearance, a tab that otherwise
 * repeated this button and the language selector next to it.
 */
export function ThemeToggle() {
  const t = useTranslations("settings.appearance")
  const { theme, resolvedTheme, setTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-label={t("theme")}>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const Icon = theme === "system" ? Monitor : resolvedTheme === "light" ? Sun : Moon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label={t("theme")}>
          <Icon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map((option) => {
          const OptionIcon = option.icon
          return (
            <DropdownMenuItem key={option.id} onClick={() => setTheme(option.id)}>
              <OptionIcon className="mr-2 h-4 w-4" />
              {t(`themeOptions.${option.id}`)}
              {theme === option.id && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
