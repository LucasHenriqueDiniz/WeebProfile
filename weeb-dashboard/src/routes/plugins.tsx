import { useEffect, useRef, useState, type MouseEvent } from "react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ArrowLeft, ArrowRight, BarChart3, SquareTerminal } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"
import { LANDING_PLUGINS } from "@/lib/landing/landing-plugins"
import { getPluginIcon } from "@/lib/plugin-icons"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

type StyleId = "default" | "terminal"

// Gap between the sticky index and the plugin heading it jumped to.
const JUMP_GAP_PX = 16

// Galeria pública de plugins/seções — todas as previews são os SVGs reais que o
// gerador produz (as mesmas usadas na landing), organizadas por plugin.
export default function PluginsGalleryPage() {
  const t = useTranslations("landing.pluginsPage")
  const tCat = useTranslations("landing.plugins.categories")
  const { tWithFallback } = usePluginI18n()
  const [style, setStyle] = useState<StyleId>("default")
  const indexRef = useRef<HTMLElement>(null)

  // The grid's order and list, shared with the landing. This page had a list of its
  // own that never got AniList or Dev.to.
  const plugins = LANDING_PLUGINS.map((id) => PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]).filter(Boolean)
  const [activeId, setActiveId] = useState<string>(plugins[0]?.name ?? "")
  const [headerHeight, setHeaderHeight] = useState(64)
  const [indexHeight, setIndexHeight] = useState(0)
  // Room the fixed Header and the sticky index take at the top of the viewport. Each
  // plugin section gets it as scroll-margin-top, so every way of scrolling to one --
  // a chip in the index, a link to /plugins#steam, the router's own scrollIntoView on
  // a hash -- stops below the index instead of under it.
  const covered = headerHeight + indexHeight + JUMP_GAP_PX

  // The index sticks right under the Header, which is fixed and sized by its content.
  // Both heights are measured: the index wraps to two rows on some widths.
  useEffect(() => {
    const header = document.querySelector("header")
    const index = indexRef.current
    const measure = () => {
      if (header) setHeaderHeight(header.getBoundingClientRect().height)
      if (index) setIndexHeight(index.getBoundingClientRect().height)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (header) observer.observe(header)
    if (index) observer.observe(index)
    return () => observer.disconnect()
  }, [])

  // The page is 70+ cards long (GitHub alone has 20), so the index marks the plugin
  // being read: the last one whose heading has scrolled up to the index.
  useEffect(() => {
    const update = () => {
      let current = plugins[0]?.name ?? ""
      for (const plugin of plugins) {
        const section = document.getElementById(plugin.name)
        if (section && section.getBoundingClientRect().top <= covered + 1) current = plugin.name
      }
      setActiveId(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
    // plugins is derived from static metadata; its identity changing does not matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [covered])

  // Keep the marked chip in view when the index scrolls sideways (narrow screens).
  useEffect(() => {
    const chip = indexRef.current?.querySelector<HTMLElement>(`[data-plugin="${activeId}"]`)
    const list = chip?.parentElement
    if (chip && list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" })
    }
  }, [activeId])

  // The chip scrolls by itself instead of following the #hash: the router reacts to a
  // hash change with an instant scrollIntoView that cut the smooth scroll short. The
  // href stays for opening a plugin in a new tab or copying its link.
  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const textOf = (plugin: (typeof plugins)[number]) => {
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
  const sectionIdsOf = (pluginName: string) => {
    const sections = SECTION_PREVIEWS[pluginName] ?? {}
    return Object.keys(sections).filter((id) => sections[id][style])
  }

  return (
    // overflow-x-clip, not overflow-hidden: hidden makes this div the scroll container
    // and the sticky index would stop sticking.
    <div className="relative overflow-x-clip bg-background">
      <Header variant="home" />
      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backHome")}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          </div>
          {/* Toggle global de estilo — a galeria inteira troca de pele */}
          <div className="inline-flex rounded-xl border border-border bg-card p-1">
            {(
              [
                { id: "default", icon: BarChart3, label: t("viewDefault") },
                { id: "terminal", icon: SquareTerminal, label: t("viewTerminal") },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon
              const isActive = style === opt.id
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setStyle(opt.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-semibold transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_18px_rgba(139,92,246,0.3)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Índice fixo: sem ele, chegar ao Websites era rolar ~10.000 px. Fica logo
            abaixo do Header (fixo); a altura dos dois entra no cálculo do pulo. */}
        <nav
          ref={indexRef}
          aria-label={t("index")}
          className="sticky z-30 -mx-6 mt-8 border-b border-border/60 bg-background/90 px-6 py-3 backdrop-blur"
          style={{ top: headerHeight }}
        >
          <div className="flex gap-2 overflow-x-auto pb-0.5 lg:flex-wrap lg:overflow-visible">
            {plugins.map((plugin) => {
              const Icon = getPluginIcon(plugin.name)
              const isActive = plugin.name === activeId
              return (
                <a
                  key={plugin.name}
                  href={`#${plugin.name}`}
                  data-plugin={plugin.name}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => jumpTo(event, plugin.name)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                    isActive
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  {textOf(plugin).displayName}
                  <span className="font-mono text-[10.5px] text-muted-foreground/70">
                    {sectionIdsOf(plugin.name).length}
                  </span>
                </a>
              )
            })}
          </div>
        </nav>

        <div className="mt-10 space-y-16">
          {plugins.map((plugin) => {
            const Icon = getPluginIcon(plugin.name)
            const sections = SECTION_PREVIEWS[plugin.name] ?? {}
            const sectionIds = sectionIdsOf(plugin.name)
            const { displayName, description } = textOf(plugin)

            return (
              <section key={plugin.name} id={plugin.name} style={{ scrollMarginTop: covered }}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-cyan-500/10 text-primary">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-heading text-xl font-bold text-foreground">{displayName}</h2>
                      <span className={cn("text-[11px] font-medium", CATEGORY_STYLE[plugin.category].label)}>
                        {tCat(plugin.category)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <span className="ml-auto whitespace-nowrap rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                    {sectionIds.length} {t("sections")}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {sectionIds.map((sectionId) => {
                    const sectionMeta = (plugin.sections as any[])?.find((s) => s.id === sectionId)
                    const sectionName = sectionMeta?.i18nKey?.name
                      ? tWithFallback(sectionMeta.i18nKey.name.replace(/^plugins\./, ""), sectionMeta.name)
                      : (sectionMeta?.name ?? sectionId)
                    const size = sections[sectionId]?.[style]
                    return (
                      <figure key={sectionId} className="group">
                        <div className="overflow-hidden rounded-lg border border-border/60 bg-card/50 transition-colors group-hover:border-primary/40">
                          {/* width/height reserve the card's space before the lazy image
                              loads; without them each card was 0 px tall until then, and
                              the page shifted under a jump from the index. */}
                          <img
                            src={`/previews/${plugin.name}/${style}/${sectionId}.svg`}
                            alt={`${displayName} — ${sectionName}`}
                            width={size?.[0]}
                            height={size?.[1]}
                            loading="lazy"
                            className="block h-auto w-full"
                          />
                        </div>
                        <figcaption className="mt-2 flex items-center gap-2 px-0.5">
                          <span className="text-[13px] font-medium text-foreground">{sectionName}</span>
                          <code className="ml-auto font-mono text-[10.5px] text-muted-foreground/60">{sectionId}</code>
                        </figcaption>
                      </figure>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_34px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
