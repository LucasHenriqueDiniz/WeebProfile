"use client"

import type { ReactNode } from "react"
import { ChevronDown, Languages, Monitor, Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales, localeNames, type Locale } from "@/i18n/config"
import { useTranslations } from "@/i18n/use-translations"
import { cn } from "@/lib/utils"
import { useThemeStore } from "@/stores/theme-store"

/**
 * Language and theme, chosen in place.
 *
 * The header used to open a dialog with a search box for three languages, and that
 * dialog sent the visitor to /en/<page>, a route that does not exist: picking a
 * language ended on "Not Found" with the language unchanged. i18next already keeps
 * the choice (localStorage, see i18n/setup.ts), so switching is one call.
 */

/** Over the landing's cyan band the colours are fixed light; elsewhere they follow the theme. */
export type Tone = "band" | "theme"

const THEMES = [
  { id: "light", Icon: Sun },
  { id: "dark", Icon: Moon },
  { id: "system", Icon: Monitor },
] as const
type ThemeId = (typeof THEMES)[number]["id"]

export function useLanguage() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? i18n.language ?? "en").slice(0, 2)
  const language = ((locales as readonly string[]).includes(current) ? current : "en") as Locale
  return { language, setLanguage: (next: Locale) => void i18n.changeLanguage(next) }
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  tone,
}: {
  label: string
  value: T
  options: ReadonlyArray<{ id: T; label: string; content: ReactNode }>
  onChange: (id: T) => void
  tone: Tone
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5">
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex h-7 min-w-7 items-center justify-center rounded-[7px] px-1.5 text-[11.5px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? tone === "band"
                  ? "bg-slate-900 text-white"
                  : "bg-foreground text-background"
                : tone === "band"
                  ? "text-slate-600 hover:bg-cyan-100 hover:text-slate-900"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {option.content}
          </button>
        )
      })}
    </div>
  )
}

/** PT · EN · ES, the current one filled. */
export function LanguageSwitch({ tone }: { tone: Tone }) {
  const t = useTranslations("header")
  const { language, setLanguage } = useLanguage()
  return (
    <Segmented
      label={t("language")}
      value={language}
      onChange={setLanguage}
      tone={tone}
      options={locales.map((id) => ({ id, label: localeNames[id] ?? id, content: id.toUpperCase() }))}
    />
  )
}

/** Light · dark · system, as icons. */
export function ThemeSwitch({ tone }: { tone: Tone }) {
  const t = useTranslations("settings.appearance")
  const { theme, setTheme } = useThemeStore()
  return (
    <Segmented<ThemeId>
      label={t("theme")}
      value={theme}
      onChange={setTheme}
      tone={tone}
      options={THEMES.map(({ id, Icon }) => ({
        id,
        label: t(`themeOptions.${id}`),
        content: <Icon className="h-3.5 w-3.5" />,
      }))}
    />
  )
}

/**
 * One button that shows both choices ("PT ☀") and opens a small menu with the two lists.
 * `compact` shows the language code alone, for the signed-in app's 76px rail.
 */
export function PreferencesMenu({
  tone,
  className,
  compact = false,
  side,
}: {
  tone: Tone
  className?: string
  compact?: boolean
  side?: "top" | "right" | "bottom" | "left"
}) {
  const t = useTranslations("header")
  const tTheme = useTranslations("settings.appearance")
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useThemeStore()
  const Current = THEMES.find((option) => option.id === theme)?.Icon ?? Monitor
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("preferences")}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          tone === "band"
            ? "text-slate-700 hover:bg-cyan-100 hover:text-slate-900"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          className
        )}
      >
        <Languages className="h-3.5 w-3.5" />
        {language.toUpperCase()}
        {!compact && (
          <>
            <span className="h-3.5 w-px bg-current opacity-30" />
            <Current className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3 opacity-70" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={side}
        sideOffset={10}
        className="w-52 rounded-xl border-2 border-foreground p-1.5 shadow-[4px_4px_0_0_hsl(var(--primary))]"
      >
        <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {t("language")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Locale)}>
          {locales.map((id) => (
            <DropdownMenuRadioItem key={id} value={id} className="rounded-lg">
              <span className="w-7 text-xs font-bold text-muted-foreground">{id.toUpperCase()}</span>
              {localeNames[id]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {tTheme("theme")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as ThemeId)}>
          {THEMES.map(({ id, Icon }) => (
            <DropdownMenuRadioItem key={id} value={id} className="gap-2 rounded-lg">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              {tTheme(`themeOptions.${id}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
