import { useEffect, useState } from "react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ArrowLeft, ArrowRight, BarChart3, SquareTerminal } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { BUTTON_PRIMARY, CHIP, TILE } from "@/components/landing/sticker"
import { SuspendedBadge, SuspendedReason } from "@/components/plugins/SuspendedBadge"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"
import { LANDING_PLUGINS } from "@/lib/landing/landing-plugins"
import { getPluginIcon } from "@/lib/plugin-icons"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

type StyleId = "default" | "terminal"

// The grid's order and list, shared with the landing.
const PLUGINS = LANDING_PLUGINS.map((id) => PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]).filter(Boolean)

/** The plugin named by the URL's hash (/plugins#steam), or the first one. */
function pluginFromHash(): string {
  const id = typeof window === "undefined" ? "" : window.location.hash.slice(1)
  return PLUGINS.some((plugin) => plugin.name === id) ? id : (PLUGINS[0]?.name ?? "")
}

/**
 * The public gallery: every section of every plugin, as the real SVGs the generator
 * produces (the same files the landing uses).
 *
 * One plugin at a time: the list picks it, the pane shows its sections. The page used to
 * stack all fifteen plugins, 73 cards and about 11,900px, under a sticky index that had
 * to measure the header and track the scroll to say where the reader was. The chosen
 * plugin is in the URL's hash, so /plugins#steam still opens on Steam and can be shared.
 */
export default function PluginsGalleryPage() {
  const t = useTranslations("landing.pluginsPage")
  const tCat = useTranslations("landing.plugins.categories")
  const { tWithFallback } = usePluginI18n()
  const [style, setStyle] = useState<StyleId>("default")
  const [activeId, setActiveId] = useState(pluginFromHash)

  // Back, forward and links to another #plugin while the page is open.
  useEffect(() => {
    const onHashChange = () => setActiveId(pluginFromHash())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const select = (id: string) => {
    setActiveId(id)
    // replaceState, not location.hash: the router answers a hash change by scrolling to
    // the element with that id, and picking a plugin should not move the page.
    window.history.replaceState(window.history.state, "", `#${id}`)
  }

  const textOf = (plugin: (typeof PLUGINS)[number]) => {
    const meta = plugin as any
    return {
      displayName: meta.i18nKey?.displayName
        ? tWithFallback(meta.i18nKey.displayName.replace(/^plugins\./, ""), plugin.displayName)
        : plugin.displayName,
      description: meta.i18nKey?.description
        ? tWithFallback(meta.i18nKey.description.replace(/^plugins\./, ""), plugin.description)
        : plugin.description,
    }
  }
  const sectionIdsOf = (pluginName: string, inStyle: StyleId = style) => {
    const sections = SECTION_PREVIEWS[pluginName] ?? {}
    return Object.keys(sections).filter((id) => sections[id]![inStyle])
  }

  const plugin = PLUGINS.find((item) => item.name === activeId) ?? PLUGINS[0]!
  const { displayName, description } = textOf(plugin)
  const Icon = getPluginIcon(plugin.name)
  const sections = SECTION_PREVIEWS[plugin.name] ?? {}
  const sectionIds = sectionIdsOf(plugin.name)

  return (
    <div className="relative bg-background">
      <Header variant="home" />
      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backHome")}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <h1 className="font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          </div>
          {/* The whole gallery changes skin. */}
          <div className="inline-flex rounded-xl border-2 border-foreground bg-card p-1" role="group">
            {(
              [
                { id: "default", icon: BarChart3, label: t("viewDefault") },
                { id: "terminal", icon: SquareTerminal, label: t("viewTerminal") },
              ] as const
            ).map((option) => {
              const OptionIcon = option.icon
              const isActive = style === option.id
              return (
                <button
                  type="button"
                  key={option.id}
                  aria-pressed={isActive}
                  onClick={() => setStyle(option.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "bg-cyan-400 text-slate-950" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <OptionIcon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-x-10 gap-y-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* The list: a row of chips to scroll sideways on a phone, a sticky column from lg up. */}
          <nav aria-label={t("index")} className="lg:sticky lg:top-24">
            <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0">
              {PLUGINS.map((item) => {
                const ItemIcon = getPluginIcon(item.name)
                const isActive = item.name === plugin.name
                return (
                  <li key={item.name} className="flex-none">
                    <button
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => select(item.name)}
                      className={cn(
                        "flex w-full items-center gap-2.5 whitespace-nowrap rounded-xl border-2 px-3 py-2 text-left text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "border-foreground bg-card text-foreground shadow-[4px_4px_0_0_hsl(var(--primary))]"
                          : "border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 flex-none items-center justify-center rounded-lg border-2 border-foreground text-slate-950",
                          CATEGORY_STYLE[item.category].sticker
                        )}
                      >
                        {ItemIcon ? <ItemIcon className="h-3.5 w-3.5" /> : null}
                      </span>
                      <span className="lg:min-w-0 lg:flex-1 lg:truncate">{textOf(item).displayName}</span>
                      <SuspendedBadge pluginId={item.name} className="hidden xl:inline-flex" />
                      <span className="font-mono text-[11px] font-normal text-muted-foreground">
                        {sectionIdsOf(item.name).length}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <section id={plugin.name} aria-live="polite" className="min-w-0 scroll-mt-24">
            <div className="flex flex-wrap items-start gap-4 rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_0_hsl(var(--primary))]">
              <span className={cn(TILE, "h-12 w-12", CATEGORY_STYLE[plugin.category].sticker)}>
                {Icon ? <Icon className="h-6 w-6" /> : null}
              </span>
              <div className="min-w-0 flex-1 basis-[280px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-heading text-2xl font-extrabold leading-tight text-foreground">{displayName}</h2>
                  <span className={CHIP}>{tCat(plugin.category)}</span>
                  <span className={cn(CHIP, "font-mono")}>
                    {sectionIds.length} {t("sections")}
                  </span>
                  <SuspendedBadge pluginId={plugin.name} />
                </div>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
                <SuspendedReason pluginId={plugin.name} className="mt-1.5 text-[13px]" />
              </div>
              <Link href="/signup" className={cn(BUTTON_PRIMARY, "px-5 py-3")}>
                {t("cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Columns, not a grid: a grid row is as tall as its tallest card, and sections
                of very different heights left holes. In columns each card sits right under
                the one before it; the order runs down each column. */}
            <div
              key={`${plugin.name}/${style}`}
              className="mt-7 columns-1 gap-6 duration-300 animate-in fade-in sm:columns-2"
            >
              {sectionIds.map((sectionId) => {
                const sectionMeta = (plugin.sections as any[])?.find((section) => section.id === sectionId)
                const sectionName = sectionMeta?.i18nKey?.name
                  ? tWithFallback(sectionMeta.i18nKey.name.replace(/^plugins\./, ""), sectionMeta.name)
                  : (sectionMeta?.name ?? sectionId)
                const size = sections[sectionId]?.[style]
                return (
                  <figure key={sectionId} className="mb-6 break-inside-avoid">
                    <div className="overflow-hidden rounded-xl border-2 border-foreground/80 bg-background">
                      {/* width/height reserve the card's space before the lazy image loads. */}
                      <img
                        src={`/previews/${plugin.name}/${style}/${sectionId}.svg`}
                        alt={`${displayName}: ${sectionName}`}
                        width={size?.[0]}
                        height={size?.[1]}
                        loading="lazy"
                        className="block h-auto w-full"
                      />
                    </div>
                    <figcaption className="mt-2 flex items-center gap-2 px-0.5">
                      <span className="text-[13.5px] font-semibold text-foreground">{sectionName}</span>
                      <code className="ml-auto font-mono text-[11px] text-muted-foreground">{sectionId}</code>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
