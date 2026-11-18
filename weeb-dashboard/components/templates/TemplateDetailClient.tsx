"use client"

import { useEffect, useState } from "react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ArrowLeft, ArrowRight, BarChart3, Check, Heart, Share2, SquareTerminal } from "lucide-react"
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CHIP, STICKER, TILE } from "@/components/landing/sticker"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { templateApi } from "@/lib/api"
import { readStyleUiConfig, type StyleUiConfig } from "@/lib/config/svg-config-helpers"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"
import { getPluginIcon } from "@/lib/plugin-icons"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { mapApiToTemplate } from "@/lib/template-mapper"
import { useTemplateDescription } from "@/lib/templates/template-description"
import { templateWizardHref } from "@/lib/templates/template-route"
import { effectiveTheme, templatePlugins, themeSwatch } from "@/lib/templates/template-view"
import { cn } from "@/lib/utils"
import type { Template } from "@/types/template"
import { TemplatePreview } from "./TemplatePreview"

type LoadedTemplate = Template & { ui: StyleUiConfig }

const METADATA = PLUGINS_METADATA as Record<string, any>

/** A plugin's name and its sections' names in the page's language. */
function usePluginText() {
  const { tWithFallback } = usePluginI18n()
  const translated = (key: string | undefined, fallback: string) =>
    key ? tWithFallback(key.replace(/^plugins\./, ""), fallback) : fallback
  return {
    pluginName: (id: string) => {
      const meta = METADATA[id]
      return meta ? translated(meta.i18nKey?.displayName, meta.displayName) : id
    },
    sectionName: (pluginId: string, sectionId: string) => {
      const section = (METADATA[pluginId]?.sections as any[] | undefined)?.find((s) => s.id === sectionId)
      return section ? translated(section.i18nKey?.name, section.name) : sectionId
    },
  }
}

function toLoaded(apiTemplate: any): LoadedTemplate {
  return {
    ...mapApiToTemplate(apiTemplate),
    size: apiTemplate.size || "full",
    customCss: apiTemplate.customCss || undefined,
    ui: readStyleUiConfig(apiTemplate.uiConfig),
  }
}

/**
 * One template: the card as it comes out, what is in it, and the way into the editor.
 *
 * Fetched without the session first, so a public template shows at once; once Clerk
 * says who is visiting, a signed-in visitor fetches it again with the session, which
 * brings their like and opens their own private templates.
 */
export function TemplateDetailClient({ templateId }: { templateId: string }) {
  const t = useTranslations("templatesPage")
  const templateDescription = useTemplateDescription()
  const { pluginName, sectionName } = usePluginText()
  const { user, loading: authLoading } = useAuth()
  const [loaded, setTemplate] = useState<LoadedTemplate | null>(null)
  // Moving from one template to another, the previous one is not this page's.
  const template = loaded?.id === templateId ? loaded : null
  // Which fetch last settled, so "not found" waits for the one that matters.
  const [settled, setSettled] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)

  const userId = user?.id
  const request = `${templateId}:${userId ?? "anonymous"}`
  useEffect(() => {
    let cancelled = false
    const fetchTemplate = userId
      ? templateApi.get(templateId)
      : fetch(`/api/templates/${templateId}`).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json() as Promise<{ template: unknown }>
        })
    fetchTemplate
      .then((data) => {
        if (!cancelled) setTemplate(toLoaded(data.template))
      })
      // A failure keeps a template already on screen; with none, it is "not found".
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSettled(request)
      })
    return () => {
      cancelled = true
    }
  }, [templateId, userId, request])

  // "Not found" only once Clerk has answered and the fetch for that answer has
  // settled. The owner of a private template reloading the page got a 401 from the
  // anonymous fetch and saw "not found" until the signed-in one came back.
  const loading = !template && (authLoading || settled !== request)

  const handleLike = async () => {
    if (!template) return
    const liked = !template.liked
    setTemplate({ ...template, liked, likes: Math.max(0, (template.likes ?? 0) + (liked ? 1 : -1)) })
    try {
      if (liked) await templateApi.like(template.id)
      else await templateApi.unlike(template.id)
    } catch {
      setTemplate(template)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      // Clipboard refused (insecure context, permissions): the address bar still has it.
    }
  }

  const backLink = (
    <Link
      href="/templates"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("backToTemplates")}
    </Link>
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-12" aria-busy>
        {backLink}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="space-y-3 lg:col-start-2">
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted/70" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          </div>
          <div className={cn(STICKER, "h-[420px] animate-pulse bg-muted/60 lg:col-start-1 lg:row-start-1")} />
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        {backLink}
        <div className={cn(STICKER, "mt-6 px-6 py-14 text-center")}>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">{t("templateNotFound")}</h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">{t("templateNotFoundDescription")}</p>
          <Link href="/templates" className={cn(BUTTON_PRIMARY, "mt-6")}>
            {t("backToGallery")}
          </Link>
        </div>
      </div>
    )
  }

  const plugins = templatePlugins(template)
  const theme = effectiveTheme(template.style, template.theme)
  const themeLabel =
    theme === "default"
      ? t("filters.theme.default")
      : t(`filters.theme.${theme}`, { defaultValue: theme.charAt(0).toUpperCase() + theme.slice(1) })
  const StyleIcon = template.style === "terminal" ? SquareTerminal : BarChart3
  const likeLabel = template.liked ? t("unlikeTemplate") : t("likeTemplate")
  const shareLabel = shareCopied ? t("share.copied") : t("shareTemplate")
  const extras = [
    template.style === "terminal" && template.ui.hideTerminalEmojis && t("detail.noEmojis"),
    template.style === "terminal" && template.ui.hideTerminalHeader && t("detail.noHeader"),
    template.ui.colorMode === "auto" && t("detail.autoColor"),
  ].filter((extra): extra is string => Boolean(extra))

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      {backLink}

      {/* DOM order is the phone's: title and action, the card, then what is in it. From
          lg up the card takes the left column next to both. */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr] lg:gap-x-10">
        <div className="lg:col-start-2 lg:row-start-1">
          <div className="flex flex-wrap gap-1.5">
            <span className={cn(CHIP, "font-mono")}>
              <StyleIcon className="h-3 w-3" />
              {t(`filters.style.${template.style}`)}
            </span>
            <span className={cn(CHIP, "font-mono")}>{template.size === "full" ? "830px" : "415px"}</span>
          </div>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground [text-wrap:balance] md:text-5xl">
            {template.name}
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground [text-wrap:pretty]">
            {templateDescription(template)}
          </p>

          <div className="mt-6 flex gap-2.5">
            <Link href={templateWizardHref(template.id)} className={cn(BUTTON_PRIMARY, "flex-1 justify-center")}>
              {t("useTemplate")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {/* Likes need an account: signed out, the heart only ever answered 401. */}
            {user && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleLike}
                    aria-label={likeLabel}
                    aria-pressed={Boolean(template.liked)}
                    className={cn(BUTTON_SECONDARY, "px-3.5")}
                  >
                    <Heart className={cn("h-4 w-4", template.liked && "fill-pink-500 text-pink-500")} />
                    {(template.likes ?? 0) > 0 && <span className="tabular-nums">{template.likes}</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{likeLabel}</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label={shareLabel}
                  className={cn(BUTTON_SECONDARY, "px-3.5")}
                >
                  {shareCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{shareLabel}</TooltipContent>
            </Tooltip>
            <span className="sr-only" aria-live="polite">
              {shareCopied ? t("share.copied") : ""}
            </span>
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">{t("detail.useHint")}</p>
        </div>

        <figure className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          {/* No screentone here: the default style is transparent and the dots showed
              through the card. */}
          <div className={cn(STICKER, "overflow-hidden bg-background p-3 sm:p-6")}>
            <TemplatePreview template={template} ui={template.ui} customCss={template.customCss} />
          </div>
          <figcaption className="mt-3 text-[13px] text-muted-foreground">{t("detail.sampleData")}</figcaption>
        </figure>

        <div className="space-y-7 lg:col-start-2 lg:row-start-2">
          <section>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              {t("detail.inside")}
            </h2>
            <ul className="mt-3 space-y-3">
              {plugins.map(({ id, sections }) => {
                const Icon = getPluginIcon(id)
                const category = METADATA[id]?.category as keyof typeof CATEGORY_STYLE | undefined
                return (
                  <li key={id} className="flex gap-3">
                    <span className={cn(TILE, "h-9 w-9", category ? CATEGORY_STYLE[category]?.sticker : "bg-muted")}>
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-foreground">{pluginName(id)}</div>
                      {sections.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {sections.map((sectionId) => (
                            <span key={sectionId} className={CHIP}>
                              {sectionName(id, sectionId)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              {t("detail.look")}
            </h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
              <dt className="text-muted-foreground">{t("style")}</dt>
              <dd className="font-semibold text-foreground">{t(`filters.style.${template.style}`)}</dd>
              <dt className="text-muted-foreground">{t("theme")}</dt>
              <dd className="flex items-center gap-2 font-semibold text-foreground">
                <span
                  className="h-3.5 w-3.5 rounded-full border-2 border-foreground"
                  style={{ backgroundColor: themeSwatch(template.style, theme, template.ui.customThemeColors) }}
                />
                {themeLabel}
              </dd>
              <dt className="text-muted-foreground">{t("detail.size")}</dt>
              <dd className="font-semibold text-foreground">
                {template.size === "half" ? t("sizes.half") : t("sizes.full")}
              </dd>
            </dl>
            {extras.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {extras.map((extra) => (
                  <span key={extra} className={CHIP}>
                    {extra}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
