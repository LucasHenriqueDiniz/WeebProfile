"use client"

import { useState, useMemo } from "react"
import { useTranslations, useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { allLocales, localeNames, localeComingSoon, type Locale } from "@/i18n/config"
import { Search, Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanguageSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LanguageSelector({ open, onOpenChange }: LanguageSelectorProps) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale
  const [searchQuery, setSearchQuery] = useState("")

  // Get current locale from next-intl's useLocale hook
  // usePathname returns pathname WITHOUT locale prefix (e.g., "/dashboard" not "/pt/dashboard")
  const currentLocale = locale

  // Filter locales based on search
  const filteredLocales = useMemo(() => {
    if (!searchQuery.trim()) return allLocales

    const query = searchQuery.toLowerCase()
    return allLocales.filter((locale) => {
      const name = localeNames[locale]?.toLowerCase() || ""
      const code = locale.toLowerCase()
      return name.includes(query) || code.includes(query)
    })
  }, [searchQuery])

  const handleLocaleChange = (newLocale: string) => {
    if (localeComingSoon[newLocale]) return // Don't allow selection of coming soon locales

    // Get current pathname without locale (from next-intl's usePathname)
    // e.g., if you're on /pt/dashboard, pathname will be "/dashboard"
    const targetPath = pathname || "/"
    
    // Build new path with new locale
    // pathname already doesn't include locale, so we just prepend the new locale
    const newPath = targetPath === "/" 
      ? `/${newLocale}` 
      : `/${newLocale}${targetPath}`
    
    // Use window.location for a clean navigation that ensures locale is set correctly
    // This prevents any issues with locale duplication that might occur with router.push
    window.location.href = newPath
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("languageSelector.title")}</DialogTitle>
          <DialogDescription>{t("languageSelector.description")}</DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t("languageSelector.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Language List */}
        <div className="max-h-[400px] overflow-y-auto space-y-1">
          {filteredLocales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("languageSelector.noResults")}
            </div>
          ) : (
            filteredLocales.map((locale) => {
              const isCurrent = locale === currentLocale
              const isComingSoon = localeComingSoon[locale]
              const name = localeNames[locale] || locale

              return (
                <Button
                  key={locale}
                  variant="ghost"
                  className={cn(
                    "w-full justify-between h-auto py-3 px-4 hover:bg-accent",
                    isCurrent && "bg-primary/10 hover:bg-primary/20",
                    isComingSoon && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => handleLocaleChange(locale)}
                  disabled={isComingSoon}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium min-w-[60px] text-muted-foreground uppercase">
                      {locale}
                    </span>
                    <span className="text-sm">{name}</span>
                    {isComingSoon && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t("languageSelector.comingSoon")}
                      </span>
                    )}
                  </div>
                  {isCurrent && !isComingSoon && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </Button>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

