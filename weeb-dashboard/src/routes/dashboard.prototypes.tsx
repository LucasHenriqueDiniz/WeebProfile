/**
 * TEMPORARY: design prototypes for the signed-in screens, for the owner to pick from.
 * /dashboard/prototypes?screen=home&v=a|b|c and ?screen=wizard&v=a|b|c. Read-only: the
 * home ones read the real SVG list, nothing here saves, generates or deletes. Removed
 * once a direction is chosen.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useSearchParams } from "@/src/compat/next-navigation"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Eye,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CHIP,
  HALFTONE,
  STICKER,
  STICKER_LIFT,
  TILE,
} from "@/components/landing/sticker"
import { PreferencesMenu } from "@/components/layout/preferences"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"
import { LANDING_PLUGINS } from "@/lib/landing/landing-plugins"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { getPluginIcon } from "@/lib/plugin-icons"
import { useAuth } from "@/hooks/useAuth"
import { useSvgStore } from "@/stores/svg-store"
import type { Svg } from "@/lib/db/schema"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type Meta = { displayName: string; category: keyof typeof CATEGORY_STYLE; sections?: { id: string; name: string }[] }
const META = PLUGINS_METADATA as unknown as Record<string, Meta>

const STATUS: Record<string, { label: string; dot: string }> = {
  completed: { label: "Pronto", dot: "bg-emerald-500" },
  generating: { label: "Gerando", dot: "bg-cyan-500 animate-pulse" },
  pending: { label: "Na fila", dot: "bg-amber-500" },
  failed: { label: "Falhou", dot: "bg-red-500" },
}

const SMALL_BUTTON =
  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-foreground bg-card px-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
const ICON_BUTTON =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-transparent text-muted-foreground transition-colors hover:border-foreground hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
const CYAN_SMALL =
  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-foreground bg-cyan-400 px-3.5 text-[13px] font-bold text-slate-950 shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-px hover:translate-y-px hover:bg-cyan-300 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

function pluginsOf(svg: Svg): string[] {
  const config = (svg.pluginsConfig ?? {}) as Record<string, { enabled?: boolean; sections?: string[] }>
  const ordered = (svg.pluginsOrder || "").split(",").filter(Boolean)
  const rest = Object.keys(config).filter((p) => config[p]?.enabled !== false && (config[p]?.sections?.length ?? 0) > 0)
  return [...new Set([...ordered, ...rest])]
}

function imageOf(svg: Svg): string | null {
  if (!svg.storageUrl || svg.status !== "completed") return null
  const v = svg.lastGeneratedAt ? new Date(svg.lastGeneratedAt).getTime() : 0
  return `${svg.storageUrl}?v=${v}`
}

function PluginTiles({ plugins, size = "sm" }: { plugins: string[]; size?: "sm" | "md" }) {
  return (
    <span className="flex items-center gap-1">
      {plugins.slice(0, 4).map((p) => {
        const Icon = getPluginIcon(p)
        const meta = META[p]
        return (
          <span
            key={p}
            title={meta?.displayName ?? p}
            className={cn(
              TILE,
              size === "sm" ? "h-7 w-7 rounded-lg" : "h-9 w-9",
              meta ? CATEGORY_STYLE[meta.category].sticker : "bg-muted"
            )}
          >
            {Icon ? <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} /> : null}
          </span>
        )
      })}
    </span>
  )
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.pending!
  return (
    <span className={cn(CHIP, status === "failed" && "border-red-500 text-red-600 dark:text-red-400")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  )
}

function CardImage({ svg, maxHeight = 420 }: { svg: Svg; maxHeight?: number }) {
  const src = imageOf(svg)
  const width = svg.size === "full" ? 830 : 415
  return (
    <div className="relative w-full overflow-hidden" style={{ maxWidth: width, maxHeight }}>
      {src ? (
        <img src={src} alt={svg.name} className="block h-auto w-full" loading="lazy" />
      ) : (
        <div className="flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-foreground/40 text-[13px] text-muted-foreground">
          {svg.status === "failed" ? "A última geração falhou" : "Ainda sem imagem"}
        </div>
      )}
    </div>
  )
}

function useLibrary() {
  const { user } = useAuth()
  const { svgs, fetchSvgs } = useSvgStore()
  useEffect(() => {
    if (user) fetchSvgs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  const ready = svgs.filter((s) => s.status === "completed").length
  const failed = svgs.filter((s) => s.status === "failed").length
  return { svgs, ready, failed }
}

function Avatar({ className }: { className?: string }) {
  const { user } = useAuth()
  const src = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  return (
    <span
      className={cn(
        "flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-pink-300 text-sm font-bold text-slate-950",
        className
      )}
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : (user?.email?.[0] ?? "U").toUpperCase()}
    </span>
  )
}

function QuotaMeter({ count, className }: { count: number; className?: string }) {
  const pct = Math.min(100, (count / MAX_SVGS_FREE_TIER) * 100)
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="h-3 w-28 overflow-hidden rounded-full border-2 border-foreground bg-card">
        <span className="block h-full bg-cyan-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[12px] text-muted-foreground">
        {count}/{MAX_SVGS_FREE_TIER}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ Home A: rail */

function HomeA() {
  const { svgs, ready, failed } = useLibrary()
  return (
    <div className="flex h-svh bg-background">
      <aside className="hidden w-[76px] flex-none flex-col items-center gap-3 border-r-2 border-foreground bg-card py-4 md:flex">
        <img src="/sora/sora-head.png" alt="WeebProfile" className="h-9 w-9 object-contain" />
        <button type="button" className={cn(CYAN_SMALL, "mt-2 h-11 w-11 justify-center px-0")} aria-label="Novo card">
          <Plus className="h-5 w-5" />
        </button>
        <nav className="mt-4 flex flex-col gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
            <LayoutGrid className="h-[18px] w-[18px]" />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent">
            <Settings className="h-[18px] w-[18px]" />
          </span>
        </nav>
        <div className="mt-auto flex flex-col items-center gap-3">
          <PreferencesMenu tone="theme" />
          <Avatar />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-6 md:px-8 md:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Meus cards
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={cn(CHIP, "font-mono")}>{svgs.length} cards</span>
                <span className={CHIP}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {ready} prontos
                </span>
                {failed > 0 && <StatusChip status="failed" />}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <QuotaMeter count={svgs.length} className="hidden sm:flex" />
              <button type="button" className={cn(BUTTON_PRIMARY, "px-5 py-3")}>
                <Plus className="h-4 w-4" />
                Novo card
              </button>
            </div>
          </div>

          <div className="mt-8 grid items-start gap-7 lg:grid-cols-2">
            {svgs.map((svg) => (
              <article
                key={svg.id}
                className={cn(STICKER, STICKER_LIFT, "overflow-hidden", svg.size === "full" && "lg:col-span-2")}
              >
                <div className="relative flex justify-center bg-muted/50 p-5">
                  <div
                    className={cn(
                      HALFTONE,
                      "right-0 top-0 h-24 w-40 [mask-image:linear-gradient(to_bottom_left,black,transparent)]"
                    )}
                  />
                  <CardImage svg={svg} />
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t-2 border-foreground px-5 py-4">
                  <PluginTiles plugins={pluginsOf(svg)} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-heading text-[16px] font-bold text-foreground">{svg.name}</h3>
                    <p className="font-mono text-[11.5px] text-muted-foreground">
                      {svg.style} · {svg.size === "full" ? 830 : 415}px
                    </p>
                  </div>
                  <StatusChip status={svg.status} />
                  <button type="button" className={SMALL_BUTTON}>
                    <Copy className="h-3.5 w-3.5" />
                    Markdown
                  </button>
                  <button type="button" className={ICON_BUTTON} aria-label="Mais">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

/* -------------------------------------------------------- shared: floating top bar */

function TopBar({ active, right }: { active: "cards" | "settings"; right?: ReactNode }) {
  const segment = (on: boolean) =>
    cn(
      "rounded-[9px] px-3 py-1 text-[13px] font-semibold transition-colors",
      on ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
    )
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 pt-4 md:px-8">
        <span className="pointer-events-auto flex items-center">
          <img src="/sora/sora-head.png" alt="" className="relative z-10 -mr-2 h-10 w-10 object-contain" />
          <span className="-rotate-3 rounded-lg border-2 border-foreground bg-cyan-300 px-2.5 py-1 font-heading text-sm font-extrabold text-slate-950 shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            WP
          </span>
        </span>
        <nav className="pointer-events-auto ml-2 hidden items-center rounded-xl border-2 border-foreground bg-card p-0.5 sm:flex">
          <span className={segment(active === "cards")}>Meus cards</span>
          <span className={segment(active === "settings")}>Configurações</span>
        </nav>
        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          {right}
          <span className="hidden items-center rounded-xl border-2 border-foreground bg-card p-0.5 md:flex">
            <PreferencesMenu tone="theme" />
          </span>
          <Avatar />
        </div>
      </div>
    </header>
  )
}

/* -------------------------------------------- Home B: top bar, gallery like /plugins */

function HomeB() {
  const { svgs, ready, failed } = useLibrary()
  const [filter, setFilter] = useState<"all" | "completed" | "failed">("all")
  const shown = svgs.filter((s) => filter === "all" || s.status === filter)
  const tab = (id: typeof filter, label: string, count: number) => (
    <button
      type="button"
      onClick={() => setFilter(id)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[13px] font-semibold",
        filter === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      <span className="font-mono text-[11px] font-normal opacity-80">{count}</span>
    </button>
  )
  return (
    <div className="min-h-svh bg-background">
      <TopBar
        active="cards"
        right={
          <button type="button" className={CYAN_SMALL}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo card</span>
          </button>
        }
      />
      <main className="mx-auto max-w-[1280px] px-4 pb-24 pt-24 md:px-8 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[620px]">
            <h1 className="font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground md:text-6xl">
              Meus cards
            </h1>
            <p className="mt-3 text-[16px] text-muted-foreground">
              Regerados toda noite. Copie o markdown e cole no README.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <QuotaMeter count={svgs.length} />
            <div className="inline-flex rounded-xl border-2 border-foreground bg-card p-1">
              {tab("all", "Todos", svgs.length)}
              {tab("completed", "Prontos", ready)}
              {failed > 0 && tab("failed", "Com erro", failed)}
            </div>
          </div>
        </div>

        <div className="mt-10 columns-1 gap-7 lg:columns-2">
          {shown.map((svg) => (
            <article key={svg.id} className="mb-8 break-inside-avoid">
              <div className={cn(STICKER, STICKER_LIFT, "overflow-hidden bg-background p-3")}>
                <CardImage svg={svg} maxHeight={520} />
              </div>
              <div className="mt-3 flex items-start gap-3 px-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-heading text-[17px] font-bold text-foreground">{svg.name}</h3>
                    {svg.status !== "completed" && <StatusChip status={svg.status} />}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <PluginTiles plugins={pluginsOf(svg)} />
                    <span className="font-mono text-[11.5px] text-muted-foreground">
                      {svg.style} · {svg.size === "full" ? "largura total" : "meia largura"}
                    </span>
                  </div>
                </div>
                <button type="button" className={SMALL_BUTTON}>
                  <Copy className="h-3.5 w-3.5" />
                  Markdown
                </button>
                <button type="button" className={ICON_BUTTON} aria-label="Mais">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

/* ---------------------------------------------- Home C: list + stage (master-detail) */

function HomeC() {
  const { svgs, ready } = useLibrary()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = svgs.find((s) => s.id === selectedId) ?? svgs[0]
  return (
    <div className="min-h-svh bg-background">
      <TopBar active="cards" />
      <main className="mx-auto grid max-w-[1280px] gap-8 px-4 pb-24 pt-24 md:px-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="min-w-0">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground">Meus cards</h1>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {svgs.length} cards · {ready} prontos
              </p>
            </div>
            <button type="button" className={CYAN_SMALL}>
              <Plus className="h-4 w-4" />
              Novo
            </button>
          </div>
          <ul className="mt-6 flex flex-col gap-2.5">
            {svgs.map((svg) => {
              const on = svg.id === selected?.id
              return (
                <li key={svg.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(svg.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all",
                      on
                        ? "border-foreground bg-card shadow-[4px_4px_0_0_hsl(var(--primary))]"
                        : "border-foreground/15 hover:border-foreground/60"
                    )}
                  >
                    <PluginTiles plugins={pluginsOf(svg).slice(0, 1)} size="md" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-foreground">{svg.name}</span>
                      <span className="block font-mono text-[11px] text-muted-foreground">
                        {svg.style} · {svg.size === "full" ? 830 : 415}px
                      </span>
                    </span>
                    <span className={cn("h-2 w-2 rounded-full", (STATUS[svg.status] ?? STATUS.pending!).dot)} />
                  </button>
                </li>
              )
            })}
          </ul>
          <QuotaMeter count={svgs.length} className="mt-5 px-1" />
        </section>

        {selected && (
          <section className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className={cn(STICKER, "overflow-hidden")}>
              <div className="flex flex-wrap items-center gap-2 border-b-2 border-foreground px-4 py-3">
                <h2 className="min-w-0 flex-1 truncate font-heading text-xl font-extrabold text-foreground">
                  {selected.name}
                </h2>
                <StatusChip status={selected.status} />
                <button type="button" className={SMALL_BUTTON}>
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
                <button type="button" className={ICON_BUTTON} aria-label="Gerar de novo">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button type="button" className={ICON_BUTTON} aria-label="Mais">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="relative flex justify-center bg-muted/50 px-4 py-8">
                <div
                  className={cn(
                    HALFTONE,
                    "inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"
                  )}
                />
                <div className="relative w-full" style={{ maxWidth: selected.size === "full" ? 830 : 415 }}>
                  <CardImage svg={selected} maxHeight={640} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t-2 border-foreground px-4 py-3">
                <code className="min-w-0 flex-1 truncate rounded-lg border-2 border-foreground/30 bg-background px-3 py-2 font-mono text-[12px] text-muted-foreground">
                  ![{selected.name}](https://weebprofile.pages.dev/svg/{selected.id.slice(0, 8)}….svg)
                </code>
                <button type="button" className={CYAN_SMALL}>
                  <Copy className="h-4 w-4" />
                  Copiar markdown
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

/* ------------------------------------------------------------- wizard mock content */

const WIZARD_PLUGINS = LANDING_PLUGINS.filter((id) => id !== "github_repo" && META[id])
const GITHUB_SECTIONS = (META.github?.sections ?? []).slice(0, 8)
const PICKED = ["profile", "activity", "calendar"]

function SectionPreview({ plugin, section, className }: { plugin: string; section: string; className?: string }) {
  const size = SECTION_PREVIEWS[plugin]?.[section]?.default
  return (
    <img
      src={`/previews/${plugin}/default/${section}.svg`}
      alt=""
      width={size?.[0]}
      height={size?.[1]}
      className={cn("block h-auto w-full", className)}
    />
  )
}

function WizardStage({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn(STICKER, "relative overflow-hidden bg-muted/50")}>
      <div className={cn(HALFTONE, "inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_45%,black)]")} />
      <div className={cn("relative mx-auto w-full max-w-[415px] space-y-1", compact ? "p-4" : "px-4 py-8")}>
        {PICKED.map((s) => (
          <SectionPreview key={s} plugin="github" section={s} />
        ))}
      </div>
    </div>
  )
}

function WizardTopBar({ steps = true }: { steps?: boolean }) {
  const step = (n: number, label: string, on: boolean) => (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[9px] px-3 py-1 text-[13px] font-semibold",
        on ? "bg-foreground text-background" : "text-muted-foreground"
      )}
    >
      <span className="font-mono text-[11px]">{n}</span>
      {label}
    </span>
  )
  return (
    <header className="sticky top-0 z-30 border-b-2 border-foreground bg-background">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <button type="button" className={ICON_BUTTON} aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <input
            defaultValue="GitHub Stats"
            aria-label="Nome do card"
            className="w-44 rounded-md bg-transparent font-heading text-lg font-extrabold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-64"
          />
          <p className="text-[12px] text-muted-foreground">Perfil · 1 plugin · 3 seções</p>
        </div>
        {steps && (
          <nav className="mx-auto hidden items-center rounded-xl border-2 border-foreground bg-card p-0.5 lg:flex">
            {step(1, "Plugins", true)}
            {step(2, "Ordem", false)}
            {step(3, "Estilo", false)}
          </nav>
        )}
        <div className={cn("flex items-center gap-2", !steps && "ml-auto")}>
          <span className="hidden md:flex">
            <PreferencesMenu tone="theme" />
          </span>
          <button type="button" className={CYAN_SMALL}>
            <Check className="h-4 w-4" />
            Salvar
          </button>
        </div>
      </div>
    </header>
  )
}

function SectionCheck({ id, name, on }: { id: string; name: string; on: boolean }) {
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 transition-all",
        on
          ? "border-foreground shadow-[4px_4px_0_0_hsl(var(--primary))]"
          : "border-foreground/20 hover:border-foreground/60"
      )}
    >
      <span className="flex items-center gap-2 px-3 py-2">
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md border-2 border-foreground",
            on ? "bg-cyan-400 text-slate-950" : "bg-card"
          )}
        >
          {on && <Check className="h-3.5 w-3.5" />}
        </span>
        <span className="text-[13.5px] font-semibold text-foreground">{name}</span>
        <code className="ml-auto font-mono text-[11px] text-muted-foreground">{id}</code>
      </span>
      <span className="max-h-28 overflow-hidden border-t-2 border-foreground/20 bg-background p-2">
        <SectionPreview plugin="github" section={id} />
      </span>
    </div>
  )
}

function PluginRowItem({ id, on, enabled }: { id: string; on?: boolean; enabled?: boolean }) {
  const meta = META[id]!
  const Icon = getPluginIcon(id)
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl border-2 px-2.5 py-2 text-left transition-all",
        on
          ? "border-foreground bg-card shadow-[3px_3px_0_0_hsl(var(--primary))]"
          : "border-transparent hover:border-foreground/40"
      )}
    >
      <span className={cn(TILE, "h-8 w-8 rounded-lg", CATEGORY_STYLE[meta.category].sticker)}>
        {Icon ? <Icon className="h-4 w-4" /> : null}
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-foreground">{meta.displayName}</span>
      {enabled && <span className={cn(CHIP, "border-emerald-600 text-emerald-700 dark:text-emerald-400")}>3</span>}
    </button>
  )
}

function GithubConfig({ narrow = false }: { narrow?: boolean }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn(TILE, "h-12 w-12", CATEGORY_STYLE.coding.sticker)}>
          {(() => {
            const Icon = getPluginIcon("github")
            return Icon ? <Icon className="h-6 w-6" /> : null
          })()}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-2xl font-extrabold text-foreground">GitHub</h2>
          <p className="text-[14px] text-muted-foreground">Mostre suas estatísticas do GitHub</p>
        </div>
        <span className={cn(CHIP, "border-emerald-600 text-emerald-700 dark:text-emerald-400")}>
          <Check className="h-3 w-3" />
          Configurado
        </span>
      </div>
      <div className={cn("grid gap-3", !narrow && "sm:grid-cols-2")}>
        <label className="block">
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Usuário</span>
          <input
            defaultValue="LucasHenriqueDiniz"
            className="mt-1.5 w-full rounded-xl border-2 border-foreground bg-card px-3 py-2 text-[14px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Token clássico</span>
          <span className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-foreground bg-card px-3 py-2 text-[14px] text-muted-foreground">
            ••••••••
            <span className="ml-auto text-[12px] font-semibold text-foreground">Trocar</span>
          </span>
        </div>
      </div>
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="font-heading text-[15px] font-bold text-foreground">
            Seções · 3 de {META.github?.sections?.length}
          </h3>
          <button type="button" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground">
            Selecionar todas
          </button>
        </div>
        <div className={cn("grid gap-3", !narrow && "sm:grid-cols-2")}>
          {GITHUB_SECTIONS.map((s) => (
            <SectionCheck key={s.id} id={s.id} name={s.name} on={PICKED.includes(s.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------- Wizard A: three sticker columns */

function WizardA() {
  return (
    <div className="flex h-svh flex-col bg-background">
      <WizardTopBar />
      <div className="grid min-h-0 flex-1 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,480px)]">
        <aside className="hidden min-h-0 flex-col border-r-2 border-foreground lg:flex">
          <div className="p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar plugin"
                className="w-full rounded-xl border-2 border-foreground bg-card py-2 pl-9 pr-3 text-[14px] outline-none"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {WIZARD_PLUGINS.map((id) => (
              <PluginRowItem key={id} id={id} on={id === "github"} enabled={id === "github"} />
            ))}
          </div>
        </aside>
        <section className="min-h-0 overflow-y-auto p-5 md:p-7">
          <GithubConfig />
        </section>
        <aside className="hidden min-h-0 overflow-y-auto border-l-2 border-foreground bg-card/40 p-5 lg:block">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Preview</span>
            <span className="inline-flex rounded-lg border-2 border-foreground bg-card p-0.5 text-[12px] font-semibold">
              <span className="rounded-md bg-foreground px-2 py-0.5 text-background">Meia</span>
              <span className="px-2 py-0.5 text-muted-foreground">Total</span>
            </span>
          </div>
          <WizardStage compact />
        </aside>
      </div>
    </div>
  )
}

/* ------------------------------------- Wizard B: one form column + sticky stage */

function NumberedBlock({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className={cn(STICKER, "p-5 md:p-6")}>
      <h2 className="mb-4 flex items-center gap-3 font-heading text-xl font-extrabold text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-foreground bg-amber-300 font-mono text-[14px] text-slate-950">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function WizardB() {
  return (
    <div className="min-h-svh bg-background">
      <WizardTopBar steps={false} />
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="min-w-0 space-y-7">
          <NumberedBlock n={1} title="Plugins">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {WIZARD_PLUGINS.slice(0, 12).map((id) => {
                const meta = META[id]!
                const Icon = getPluginIcon(id)
                const on = id === "github"
                return (
                  <button
                    type="button"
                    key={id}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left",
                      on
                        ? "border-foreground bg-card shadow-[3px_3px_0_0_hsl(var(--primary))]"
                        : "border-foreground/20 hover:border-foreground/60"
                    )}
                  >
                    <span className={cn(TILE, "h-7 w-7 rounded-lg", CATEGORY_STYLE[meta.category].sticker)}>
                      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span className="truncate text-[13px] font-semibold text-foreground">{meta.displayName}</span>
                  </button>
                )
              })}
            </div>
          </NumberedBlock>
          <NumberedBlock n={2} title="Seções do GitHub">
            <GithubConfig />
          </NumberedBlock>
          <NumberedBlock n={3} title="Estilo">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex rounded-xl border-2 border-foreground bg-card p-1 text-[13px] font-semibold">
                <span className="rounded-[9px] bg-foreground px-3 py-1 text-background">default</span>
                <span className="px-3 py-1 text-muted-foreground">terminal</span>
              </span>
              <span className="flex gap-2">
                {["bg-violet-400", "bg-pink-400", "bg-cyan-400", "bg-orange-400", "bg-emerald-400"].map((c) => (
                  <span key={c} className={cn("h-7 w-7 rounded-full border-2 border-foreground", c)} />
                ))}
              </span>
            </div>
          </NumberedBlock>
        </div>
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <WizardStage />
        </aside>
      </div>
      <div className="fixed inset-x-4 bottom-4 z-30 lg:hidden">
        <button type="button" className={cn(BUTTON_SECONDARY, "w-full justify-center bg-card")}>
          <Eye className="h-4 w-4" />
          Ver preview · 3 seções
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------- Wizard C: the card in the middle, edited in place */

function WizardC() {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex h-svh flex-col bg-background">
      <WizardTopBar steps={false} />
      <div className="flex gap-2 overflow-x-auto border-b-2 border-foreground px-4 py-3 md:px-6">
        {WIZARD_PLUGINS.map((id) => {
          const meta = META[id]!
          const Icon = getPluginIcon(id)
          const on = id === "github"
          return (
            <button
              type="button"
              key={id}
              onClick={() => on && setOpen(true)}
              className={cn(
                "flex flex-none items-center gap-2 rounded-xl border-2 py-1 pl-1 pr-3 text-[13px] font-semibold",
                on
                  ? "border-foreground bg-card text-foreground shadow-[3px_3px_0_0_hsl(var(--primary))]"
                  : "border-foreground/20 text-muted-foreground hover:border-foreground/60"
              )}
            >
              <span className={cn(TILE, "h-7 w-7 rounded-lg", CATEGORY_STYLE[meta.category].sticker)}>
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
              </span>
              {meta.displayName}
              {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </button>
          )
        })}
      </div>
      <div className="relative flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1 overflow-y-auto bg-muted/40">
          <div
            className={cn(
              HALFTONE,
              "left-0 top-0 h-48 w-72 [mask-image:linear-gradient(to_bottom_right,black,transparent)]"
            )}
          />
          <div className="relative mx-auto my-8 max-w-[460px] rounded-2xl border-2 border-foreground bg-background px-5 py-6">
            {PICKED.map((s) => (
              <div key={s} className="group relative mb-2 rounded-lg ring-foreground hover:ring-2">
                <SectionPreview plugin="github" section={s} />
                <span className="absolute -right-3 -top-3 hidden gap-1 group-hover:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-foreground bg-card">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
            ))}
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-foreground/50 bg-card/70 py-4 text-[14px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Adicionar seção
            </button>
          </div>
          <div className="sticky bottom-4 z-10 mx-auto flex w-fit items-center gap-3 rounded-xl border-2 border-foreground bg-card px-3 py-2 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            <span className="inline-flex rounded-lg border-2 border-foreground p-0.5 text-[12px] font-semibold">
              <span className="rounded-md bg-foreground px-2 py-0.5 text-background">default</span>
              <span className="px-2 py-0.5 text-muted-foreground">terminal</span>
            </span>
            <span className="flex gap-1.5">
              {["bg-violet-400", "bg-pink-400", "bg-cyan-400", "bg-emerald-400"].map((c) => (
                <span key={c} className={cn("h-5 w-5 rounded-full border-2 border-foreground", c)} />
              ))}
            </span>
            <span className="hidden items-center gap-1 text-[12px] font-semibold text-muted-foreground sm:flex">
              Meia largura <ChevronDown className="h-3.5 w-3.5" />
            </span>
          </div>
        </main>
        {open && (
          <aside className="absolute inset-0 z-20 overflow-y-auto border-l-2 border-foreground bg-background p-5 md:static md:w-[460px] md:flex-none">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={cn(ICON_BUTTON, "float-right md:hidden")}
              aria-label="Fechar"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <GithubConfig narrow />
          </aside>
        )}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------- index */

const VARIANTS = {
  home: {
    a: {
      label: "A · Rail",
      note: "Sidebar estreita mantida, em adesivo. Grade de cards com a imagem e uma barra de ações.",
      C: HomeA,
    },
    b: {
      label: "B · Barra do site",
      note: "Sem sidebar: a mesma barra flutuante do site público. Título grande, filtros em segmentos, cards soltos como na galeria.",
      C: HomeB,
    },
    c: {
      label: "C · Lista + palco",
      note: "Lista compacta à esquerda, o card escolhido grande à direita com markdown e ações. Junta a home e a página do card.",
      C: HomeC,
    },
  },
  wizard: {
    a: {
      label: "A · 3 colunas",
      note: "O layout de hoje (plugins | configuração | preview), em adesivo, com passos num controle segmentado.",
      C: WizardA,
    },
    b: {
      label: "B · Coluna + palco",
      note: "Um formulário só, em blocos numerados (plugins, seções, estilo), com o preview fixo ao lado.",
      C: WizardB,
    },
    c: {
      label: "C · Card no centro",
      note: "O card no meio, editado no lugar; plugins numa faixa em cima, configuração na gaveta, estilo numa barra flutuante.",
      C: WizardC,
    },
  },
} as const

export default function PrototypesPage() {
  const params = useSearchParams()
  const screen = (params.get("screen") === "wizard" ? "wizard" : "home") as keyof typeof VARIANTS
  const v = (["a", "b", "c"].includes(params.get("v") ?? "") ? params.get("v") : "a") as "a" | "b" | "c"
  const variant = VARIANTS[screen][v]
  const Screen = variant.C
  const switcher = useMemo(
    () =>
      (Object.keys(VARIANTS) as (keyof typeof VARIANTS)[]).flatMap((s) =>
        (["a", "b", "c"] as const).map((id) => ({
          s,
          id,
          label: `${s === "home" ? "Home" : "Wizard"} ${VARIANTS[s][id].label}`,
        }))
      ),
    []
  )
  return (
    <>
      <Screen />
      <div className="fixed bottom-3 left-3 z-50 flex max-w-[calc(100vw-24px)] items-center gap-1 overflow-x-auto rounded-xl border-2 border-foreground bg-card p-1 text-[12px] font-semibold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
        {switcher.map((item) => (
          <Link
            key={`${item.s}-${item.id}`}
            href={`/dashboard/prototypes?screen=${item.s}&v=${item.id}`}
            title={VARIANTS[item.s][item.id].note}
            className={cn(
              "whitespace-nowrap rounded-lg px-2 py-1",
              item.s === screen && item.id === v
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  )
}
