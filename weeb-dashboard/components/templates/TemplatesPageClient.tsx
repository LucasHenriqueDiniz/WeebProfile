"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, RotateCw, Search } from "lucide-react"
import { LandingTemplateCard, LandingTemplateCardSkeleton } from "@/components/landing/LandingTemplateCard"
import { HALFTONE, BUTTON_PRIMARY, BUTTON_SECONDARY, STICKER } from "@/components/landing/sticker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { templateApi } from "@/lib/api"
import { mapApiToTemplates } from "@/lib/template-mapper"
import {
  createGalleryLoader,
  distinctValues,
  gallerySource,
  showsGalleryToolbar,
  sortTemplates,
  type GalleryState,
} from "@/lib/templates/gallery"
import { cn } from "@/lib/utils"
import type { Template } from "@/types/template"

const FIELD =
  "h-11 rounded-lg border-2 border-foreground bg-card text-[14px] font-medium focus:ring-2 focus:ring-ring focus:ring-offset-0"

async function fetchOwnTemplates(): Promise<Template[]> {
  const response = await templateApi.list()
  return mapApiToTemplates(response.templates ?? [])
}

async function fetchPublicTemplates(): Promise<Template[]> {
  const res = await fetch("/api/templates?public=true")
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as { templates?: unknown[] }
  return mapApiToTemplates(data.templates ?? [])
}

/**
 * The templates gallery. The public list goes out at once; once Clerk knows a
 * signed-in visitor, their own list (their templates and likes) replaces it, and only
 * the latest request lands (createGalleryLoader). The page used to ask for the
 * authenticated list first, so every signed-out visit started with a 401.
 */
export function TemplatesPageClient() {
  const t = useTranslations("templatesPage")
  const tLanding = useTranslations("landing")
  const { user, loading: authLoading } = useAuth()
  const [{ templates, loading, failed }, setGallery] = useState<GalleryState>({
    templates: [],
    loading: true,
    failed: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [styleFilter, setStyleFilter] = useState("all")
  const [themeFilter, setThemeFilter] = useState("all")
  const [sortByValue, setSortByValue] = useState("newest")

  // One list at a time: the public one, or the visitor's own once Clerk knows them.
  const source = gallerySource(authLoading, Boolean(user))
  const loadGallery = useMemo(() => createGalleryLoader(setGallery), [])
  const load = useCallback(
    () => loadGallery(source === "mine" ? fetchOwnTemplates : fetchPublicTemplates),
    [loadGallery, source]
  )

  useEffect(() => {
    void load()
  }, [load, user?.id])

  // Only the styles and themes some template uses: a filter that can come up empty
  // is a control with nothing behind it.
  const availableStyles = useMemo(() => distinctValues(templates, "style"), [templates])
  const availableThemes = useMemo(() => distinctValues(templates, "theme"), [templates])
  const showToolbar = showsGalleryToolbar(templates.length)

  const visible = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const filtered = templates.filter(
      (template) =>
        (!term ||
          template.name.toLowerCase().includes(term) ||
          template.description.toLowerCase().includes(term) ||
          template.platforms.some((platform) => platform.toLowerCase().includes(term))) &&
        (styleFilter === "all" || template.style === styleFilter) &&
        (themeFilter === "all" || template.theme === themeFilter)
    )
    return sortTemplates(filtered, sortByValue)
  }, [templates, searchTerm, styleFilter, themeFilter, sortByValue])

  const filtering = searchTerm.trim() !== "" || styleFilter !== "all" || themeFilter !== "all"
  const clearFilters = () => {
    setSearchTerm("")
    setStyleFilter("all")
    setThemeFilter("all")
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {tLanding("pluginsPage.backHome")}
      </Link>

      <div className="mt-6 max-w-[640px]">
        <div className="inline-block -rotate-1 rounded-md border-2 border-foreground bg-pink-300 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-950">
          {tLanding("templates.kicker")}
        </div>
        <h1 className="mt-4 font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground [text-wrap:pretty]">{t("subtitle")}</p>
      </div>

      {/* Search and filters only once the gallery outgrows two rows, see showsGalleryToolbar. */}
      {showToolbar && (
        <div className="mt-10 flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">{t("searchPlaceholder")}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(FIELD, "w-full pl-10 pr-3 outline-none placeholder:text-muted-foreground")}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            {availableStyles.length > 1 && (
              <Select value={styleFilter} onValueChange={setStyleFilter}>
                <SelectTrigger className={cn(FIELD, "w-[170px]")} aria-label={t("filters.style.label")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.style.all")}</SelectItem>
                  {availableStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {t(`filters.style.${style}`, { defaultValue: style })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {availableThemes.length > 1 && (
              <Select value={themeFilter} onValueChange={setThemeFilter}>
                <SelectTrigger className={cn(FIELD, "w-[170px]")} aria-label={t("filters.theme.label")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.theme.all")}</SelectItem>
                  {availableThemes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {t(`filters.theme.${theme}`, { defaultValue: theme.charAt(0).toUpperCase() + theme.slice(1) })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={sortByValue} onValueChange={setSortByValue}>
              <SelectTrigger className={cn(FIELD, "w-[170px]")} aria-label={t("sort.label")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                <SelectItem value="oldest">{t("sort.oldest")}</SelectItem>
                <SelectItem value="mostLiked">{t("sort.mostLiked")}</SelectItem>
                <SelectItem value="name">{t("sort.name")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className={showToolbar ? "mt-8" : "mt-12"} aria-busy={loading}>
        {loading && templates.length === 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LandingTemplateCardSkeleton key={i} />
            ))}
          </div>
        ) : failed && templates.length === 0 ? (
          <div className={cn(STICKER, "px-6 py-12 text-center")} role="alert">
            <h2 className="font-heading text-2xl font-extrabold text-foreground">{t("loadError")}</h2>
            <button type="button" onClick={() => void load()} className={cn(BUTTON_SECONDARY, "mt-6")}>
              <RotateCw className="h-4 w-4" />
              {t("retry")}
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className={cn(STICKER, "px-6 py-12 text-center")}>
            <h2 className="font-heading text-2xl font-extrabold text-foreground">{t("noTemplatesFound")}</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">{t("noTemplatesFoundDescription")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {filtering && (
                <button type="button" onClick={clearFilters} className={BUTTON_SECONDARY}>
                  {t("clearFilters")}
                </button>
              )}
              <Link href="/dashboard/new" className={BUTTON_PRIMARY}>
                {t("createYourOwn")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((template) => (
              <LandingTemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>

      {/* The way out when none of them fits. */}
      <div className={cn(STICKER, "relative mt-16 overflow-hidden p-7 md:p-9")}>
        <div
          className={cn(
            HALFTONE,
            "-right-6 -top-6 h-40 w-56 [mask-image:radial-gradient(closest-side,black,transparent)]"
          )}
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[520px]">
            <h2 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground">
              {t("scratch.title")}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t("scratch.subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/plugins" className={BUTTON_SECONDARY}>
              {t("scratch.browsePlugins")}
            </Link>
            <Link href="/dashboard/new" className={BUTTON_PRIMARY}>
              {t("scratch.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
