import { useEffect, useState } from "react"
import { PLUGIN_CATEGORIES, PLUGINS_METADATA, type PluginMetadata } from "@weeb/weeb-plugins/plugins/metadata"
import { ArrowLeft, ArrowRight, BarChart3, Search, SquareTerminal, X } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { BUTTON_PRIMARY, CHIP, TILE } from "@/components/landing/sticker"
import { SectionOptions } from "@/components/plugins/SectionOptions"
import { SuspendedBadge, SuspendedReason } from "@/components/plugins/SuspendedBadge"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"
import { LANDING_PLUGINS } from "@/lib/landing/landing-plugins"
import { getPluginIcon } from "@/lib/plugin-icons"
import { catalogSearchTexts, describeSection, groupByCategory } from "@/lib/plugins/catalog"
import { pluginMatchesQuery } from "@/lib/plugins/plugin-search"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

type StyleId = "default" | "terminal"

// The grid's order and list, shared with the landing.
const PLUGINS = LANDING_PLUGINS.map(
  (id) => PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA] as PluginMetadata
).filter(Boolean)

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
 *
 * Under each section, what it lets the user change (SectionOptions). The list is grouped
 * by category and has a search over names, descriptions, categories and section names:
 * at 15 plugins a flat list fits, at 40 it would be taller than the screen in the
 * sticky column and a 40-chip row to swipe through on a phone. Categories make the long
 * list scannable and search finds a plugin without scanning at all; filter chips alone
 * would still leave a long list in the big categories (coding has five already).
 */
export default function PluginsGalleryPage() {
  const t = useTranslations("landing.pluginsPage")
  const tCat = useTranslations("landing.plugins.categories")
  const { tWithFallback } = usePluginI18n()
  const [style, setStyle] = useState<StyleId>("default")
  const [activeId, setActiveId] = useState(pluginFromHash)
  const [query, setQuery] = useState("")

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

  const groups = groupByCategory(
    PLUGINS.filter((item) => pluginMatchesQuery(catalogSearchTexts(item, tWithFallback, tCat(item.category)), query)),
    PLUGIN_CATEGORIES
  )
  const firstMatch = groups[0]?.plugins[0]

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
          {/* The list: a row of chips to scroll sideways on a phone, a sticky column from lg up,
              where it scrolls on its own when it is taller than the screen. */}
          <nav
            aria-label={t("index")}
            className="lg:sticky lg:top-24 lg:-mx-2 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:px-2 lg:pb-3"
          >
            <form
              role="search"
              onSubmit={(event) => {
                // Enter opens the first match.
                event.preventDefault()
                if (firstMatch) select(firstMatch.name)
              }}
              className="relative mb-3"
            >
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setQuery("")
                }}
                aria-label={t("search.label")}
                placeholder={t("search.placeholder")}
                className="w-full rounded-xl border-2 border-foreground bg-card py-2 pl-9 pr-9 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t("search.clear")}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
            {groups.length === 0 && (
              <p role="status" className="px-1 text-[13px] text-muted-foreground">
                {t("search.empty", { query: query.trim() })}
              </p>
            )}
            {/* Groups by category from lg up; on a phone the headings drop and the row runs
                on in the same order. */}
            <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
              {groups.map((group) => (
                <li key={group.category} className="contents lg:block">
                  <h3 className="hidden items-center gap-2 px-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground lg:flex">
                    <span
                      aria-hidden
                      className={cn(
                        "h-2.5 w-2.5 rounded-full border border-foreground",
                        CATEGORY_STYLE[group.category].sticker
                      )}
                    />
                    {tCat(group.category)}
                    <span className="font-mono font-normal">{group.plugins.length}</span>
                  </h3>
                  <ul className="contents lg:flex lg:flex-col lg:gap-1.5">
                    {group.plugins.map((item) => {
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
                </li>
              ))}
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
                const sectionMeta = plugin.sections.find((section) => section.id === sectionId)
                const view = sectionMeta ? describeSection(sectionMeta, tWithFallback) : null
                const sectionName = view?.name ?? sectionId
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
                    <figcaption className="mt-2 px-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-foreground">{sectionName}</span>
                        <code className="ml-auto font-mono text-[11px] text-muted-foreground">{sectionId}</code>
                      </div>
                      {view?.description && (
                        <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{view.description}</p>
                      )}
                    </figcaption>
                    {view && <SectionOptions section={view} className="mt-2.5" />}
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
