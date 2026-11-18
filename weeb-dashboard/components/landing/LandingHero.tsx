"use client"

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowRight, Check, Loader2, Sparkles } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useAuth } from "@/hooks/useAuth"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import REAL_CARDS from "@/lib/landing/hero-real-cards.json"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { getPluginIcon } from "@/lib/plugin-icons"
import { isSuspended } from "@/lib/plugins/suspended"
import {
  PREVIEW_PLACEHOLDERS,
  PREVIEW_PLUGINS,
  parsePreviewRequest,
  previewQuery,
  wizardPathFor,
  type PreviewPluginId,
  type PreviewRequest,
  type PreviewStyle,
} from "@/lib/preview/public-preview"
import { withReturnTo } from "@/lib/return-to"
import { cn } from "@/lib/utils"

const PLATFORMS = Object.keys(PREVIEW_PLUGINS) as PreviewPluginId[]
const STYLES = ["default", "terminal"] as const

/** The example card's box, in the SVG's own units (415 wide). Taller examples fade out at the bottom. */
const EXAMPLE_HEIGHT = 500

const INK = "#0f172a"
const INK_BUTTON =
  "border-2 border-slate-900 bg-slate-900 text-white shadow-[4px_4px_0_0_#fff] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_#fff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-cyan-100"
const STEP_LABEL = "w-[84px] flex-none text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500"

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; src: string; request: PreviewRequest }
  | { status: "error"; message: string }

const pluginName = (id: string) => (PLUGINS_METADATA as Record<string, { displayName: string }>)[id]?.displayName ?? id

/**
 * A real card for this platform and style, when scripts/fetch-hero-real-cards.mjs has
 * saved one (public/hero/real): what the hero shows before the visitor types anything.
 */
function realCard(plugin: PreviewPluginId, style: PreviewStyle) {
  return REAL_CARDS.find((card) => card.plugin === plugin && card.style === style) ?? null
}

/** The sections the real preview uses for this platform, as the static example SVGs of that style. */
function exampleSections(plugin: PreviewPluginId, style: PreviewStyle) {
  return PREVIEW_PLUGINS[plugin].sections.flatMap((section) => {
    const size = SECTION_PREVIEWS[plugin]?.[section]?.[style]
    return size ? [{ section, width: size[0], height: size[1] }] : []
  })
}

// Derivado de PLUGINS_METADATA, que é auto-gerado a cada plugin novo. O badge dizia
// "11 plugins · 60+ seções" cravado na tradução, e ficou desatualizado sem ninguém
// notar: já eram 14. Número em texto de marketing envelhece calado.
const TOTAL_PLUGINS = Object.keys(PLUGINS_METADATA).length
const TOTAL_SECOES = Object.values(PLUGINS_METADATA as Record<string, { sections?: unknown[] }>).reduce(
  (soma, meta) => soma + (meta.sections?.length ?? 0),
  0
)
// Arredonda para baixo na dezena: o "+" promete um piso, não uma contagem exata,
// e assim o texto não muda a cada seção adicionada.
const SECOES_ARREDONDADAS = Math.floor(TOTAL_SECOES / 10) * 10

/** Props from public/sora/props floating around the card (motion in globals.css). */
const PROPS = [
  { src: "/sora/props/star.png", className: "right-[-5%] top-[7%] w-11 [animation-delay:-2.5s]" },
  { src: "/sora/props/musical_note.png", className: "left-[-7%] top-[38%] w-10 [animation-delay:-1s]" },
] as const

/**
 * The pitch and three choices on the left, the card on the right, with Sora over it. The
 * visitor picks what to show (GitHub first) and the style, and the card changes at once:
 * a real card where public/hero/real has one, the section examples otherwise. A username
 * turns it into their own (GET /api/preview, the endpoint of the "try it" block).
 *
 * On desktop the whole hero fits the first screen: the card's box shrinks with the
 * window's height and fades out at the bottom when the card is taller. A card the
 * visitor asked for is never cut.
 *
 * The band is a pale cyan from Sora's hair with ink-coloured type and borders, the same
 * in both themes. Earlier versions: previews scrolling behind a gradient; one card beside
 * the title, then rotating, under glow orbs; a centred title over a wide README with a
 * glow and a deck. All of them were a title, a glow and a framed screenshot, which is
 * what every product page looks like; this one is the mascot and the product in use.
 */
export function LandingHero() {
  const t = useTranslations("landing.hero")
  const tPreview = useTranslations("landing.preview")
  const tStatus = useTranslations("pluginStatus")
  const { user } = useAuth()
  const [plugin, setPlugin] = useState<PreviewPluginId>("github")
  const [style, setStyle] = useState<PreviewStyle>("default")
  const [username, setUsername] = useState("")
  const [state, setState] = useState<State>({ status: "idle" })

  const src = state.status === "ready" ? state.src : null
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src)
    }
  }, [src])

  // A different platform or style goes back to the example: the card on screen would no
  // longer match the controls.
  function choose(next: { plugin?: PreviewPluginId; style?: PreviewStyle }) {
    if (next.plugin) setPlugin(next.plugin)
    if (next.style) setStyle(next.style)
    setState({ status: "idle" })
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const parsed = parsePreviewRequest(
      new URLSearchParams({ plugin, username: username.trim(), style, theme: "default", size: "half" })
    )
    if (!parsed.ok) {
      setState({ status: "error", message: tPreview("errors.invalid") })
      return
    }
    setState({ status: "loading" })
    try {
      const response = await fetch(`/api/preview?${previewQuery(parsed.value)}`)
      if (response.ok && response.headers.get("content-type")?.includes("svg")) {
        setState({ status: "ready", src: URL.createObjectURL(await response.blob()), request: parsed.value })
        return
      }
      const code = ((await response.json().catch(() => ({}))) as { code?: string }).code
      const platform = pluginName(plugin)
      const message =
        code === "PREVIEW_USER_NOT_FOUND"
          ? tPreview("errors.notFound", { platform })
          : code === "PREVIEW_PROFILE_PRIVATE"
            ? tPreview("errors.private", { platform })
            : code === "PREVIEW_UNAVAILABLE"
              ? tPreview("errors.unavailable", { platform })
              : code === "PREVIEW_RATE_LIMITED"
                ? tPreview("errors.rateLimited", {
                    minutes: Math.max(1, Math.ceil((Number(response.headers.get("Retry-After")) || 60) / 60)),
                  })
                : tPreview("errors.generic")
      setState({ status: "error", message })
    } catch {
      setState({ status: "error", message: tPreview("errors.generic") })
    }
  }

  const says =
    state.status === "loading"
      ? t("sora.loading")
      : state.status === "ready"
        ? t("sora.ready", { username: state.request.username })
        : state.status === "error"
          ? state.message
          : t("sora.idle")
  const saveHref =
    state.status === "ready"
      ? user
        ? wizardPathFor(state.request)
        : withReturnTo("/signup", wizardPathFor(state.request))
      : null

  const real = realCard(plugin, style)
  const example = real ? [] : exampleSections(plugin, style)

  // Whether the example is taller than its box, which depends on the platform, the style
  // and the window's height: only then does the bottom fade out.
  const exampleBox = useRef<HTMLDivElement>(null)
  const [clipped, setClipped] = useState(false)
  const measureClip = useCallback(() => {
    const box = exampleBox.current
    if (box) setClipped(box.scrollHeight > box.clientHeight + 1)
  }, [])
  useEffect(() => {
    measureClip()
    window.addEventListener("resize", measureClip)
    return () => window.removeEventListener("resize", measureClip)
  }, [measureClip, plugin, style, state.status])
  const PluginIcon = getPluginIcon(plugin)

  return (
    <section
      id="top"
      // The header paints itself in the band's colours while this is under it.
      data-header-band
      className="relative bg-cyan-100 text-slate-900 lg:flex lg:min-h-[calc(100svh-4rem)] lg:items-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.13)_1.4px,transparent_1.4px)] [background-size:18px_18px] [mask-image:linear-gradient(115deg,transparent_40%,black)]"
      />
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-x-14 gap-y-14 px-6 pb-20 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:pb-14 lg:pt-8">
        {/* The pitch, and under it the three choices that drive the card */}
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-900">
            <img src="/sora/sora-head.png" alt="" className="h-4 w-4 object-contain" />
            {t("badge", { plugins: TOTAL_PLUGINS, sections: SECOES_ARREDONDADAS })}
          </div>
          <h1 className="mt-5 font-heading text-6xl font-extrabold leading-[0.98] tracking-tight [text-wrap:balance] lg:text-7xl">
            {t("title")}{" "}
            <span className="inline-block -rotate-2 rounded-lg border-[3px] border-slate-900 bg-cyan-300 px-3 pb-1 shadow-[5px_5px_0_0_#0f172a]">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="mt-6 max-w-[500px] text-[17px] font-medium leading-relaxed text-slate-700 [text-wrap:pretty]">
            {t("subtitle")}
          </p>

          <div
            className="mt-7 max-w-[500px] overflow-hidden rounded-2xl border-[3px] border-slate-900 bg-white"
            style={{ boxShadow: `6px 6px 0 0 ${INK}` }}
          >
            {/* 1. What to show */}
            <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-slate-900 px-3 py-2.5">
              <legend className="sr-only">{t("showLegend")}</legend>
              <span className={STEP_LABEL}>{t("stepShow")}</span>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map((id) => {
                  const Icon = getPluginIcon(id)
                  const selected = id === plugin
                  // A suspended platform stays in the row, struck out, with the reason as
                  // its tooltip and accessible name: gone without a word would read as a bug.
                  const suspended = isSuspended(id)
                  const label = suspended ? `${pluginName(id)}: ${tStatus(`reasons.${id}`)}` : pluginName(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      aria-disabled={suspended}
                      aria-label={label}
                      title={label}
                      onClick={() => {
                        if (!suspended) choose({ plugin: id })
                      }}
                      className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1",
                        suspended
                          ? "cursor-not-allowed border-dashed border-slate-300 bg-slate-100 text-slate-300 after:absolute after:h-0.5 after:w-7 after:-rotate-45 after:rounded-full after:bg-slate-400"
                          : selected
                            ? "border-slate-900 bg-cyan-300 text-slate-900"
                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-900 hover:text-slate-900"
                      )}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : pluginName(id).slice(0, 2)}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* 2. Style */}
            <div className="flex items-center gap-3 border-b-2 border-slate-900 px-3 py-2.5">
              <span className={STEP_LABEL}>{t("stepStyle")}</span>
              <div
                className="flex rounded-lg border-2 border-slate-900 p-0.5"
                role="group"
                aria-label={t("styleGroup")}
              >
                {STYLES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={style === option}
                    onClick={() => choose({ style: option })}
                    className={cn(
                      "rounded-md px-3 py-1 text-[12.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                      style === option ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900",
                      option === "terminal" && "font-mono"
                    )}
                  >
                    {tPreview(`styles.${option}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Yours */}
            <form onSubmit={submit} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5">
              <label htmlFor="hero-username" className={STEP_LABEL}>
                {t("stepYours")}
              </label>
              <div className="flex min-w-0 flex-1 basis-[260px] gap-2">
                <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-3 focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-1">
                  {PluginIcon ? <PluginIcon className="h-4 w-4 flex-none text-slate-500" /> : null}
                  <input
                    id="hero-username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder={PREVIEW_PLACEHOLDERS[plugin]}
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={120}
                    className="h-full min-w-0 flex-1 bg-transparent font-mono text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state.status === "loading" || !username.trim()}
                  className="inline-flex h-11 flex-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-slate-900 bg-slate-900 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 disabled:opacity-60"
                >
                  {state.status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {t("submit")}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/signup"
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-5 py-3 text-[15px] font-semibold ${INK_BUTTON}`}
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="/#plugins"
              className="text-[15px] font-semibold text-slate-900 underline decoration-2 underline-offset-4 hover:decoration-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              {t("ctaSecondary")}
            </a>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-slate-700">
            {[t("check1", { max: MAX_SVGS_FREE_TIER }), t("check2"), t("check3")].map((text) => (
              <span key={text} className="flex items-center gap-1.5 whitespace-nowrap">
                <Check className="h-3.5 w-3.5 text-slate-900" strokeWidth={3} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* The card, with Sora over it */}
        <div className="relative mx-auto mt-32 w-full max-w-[440px] duration-1000 animate-in fade-in slide-in-from-bottom-6 fill-mode-both [animation-delay:150ms] lg:mt-[132px]">
          <img
            src="/sora/sora_main.png"
            alt={t("soraAlt")}
            width={751}
            height={748}
            className="hero-bob drop-shadow-xl absolute -top-[150px] left-[26%] w-[220px] -translate-x-1/2 lg:-top-[158px] lg:left-[30%] lg:w-[230px]"
          />
          <div
            className={`absolute -top-[104px] right-0 max-w-[160px] rotate-2 rounded-2xl rounded-bl-sm border-2 border-slate-900 bg-white px-3.5 py-2.5 text-[13px] font-semibold leading-snug shadow-[3px_3px_0_0_#0f172a] sm:max-w-[184px] ${state.status === "error" ? "text-red-700" : "text-slate-900"}`}
          >
            <span aria-live="polite">{says}</span>
          </div>
          {PROPS.map((prop) => (
            <img
              key={prop.src}
              src={prop.src}
              alt=""
              className={`hero-float pointer-events-none absolute z-10 ${prop.className}`}
            />
          ))}

          <div
            className="relative rotate-[1deg] overflow-hidden rounded-2xl border-[3px] border-slate-900 bg-background"
            style={{ boxShadow: `10px 10px 0 0 ${INK}` }}
          >
            <div className="flex items-center gap-2 border-b-[3px] border-slate-900 bg-white px-4 py-2 font-mono text-xs font-bold text-slate-900">
              <span className="truncate">
                {state.status === "ready"
                  ? `${state.request.username} / README.md`
                  : real
                    ? `${real.username} / README.md`
                    : "README.md"}
              </span>
              {state.status !== "ready" && !real && (
                <span className="ml-auto flex-none rounded-full bg-slate-900 px-2 py-0.5 font-sans text-[10.5px] font-semibold uppercase tracking-wide text-white">
                  {t("example")}
                </span>
              )}
            </div>
            <div className="p-2" aria-live="polite">
              {state.status === "ready" ? (
                <img
                  src={state.src}
                  alt={tPreview("alt", {
                    platform: pluginName(state.request.plugin),
                    username: state.request.username,
                  })}
                  className="block w-full duration-500 animate-in fade-in"
                />
              ) : (
                // The example's box: as tall as EXAMPLE_HEIGHT, and on desktop never taller than
                // what keeps the whole hero inside the first screen.
                <div
                  ref={exampleBox}
                  className="relative w-full overflow-hidden lg:max-h-[calc(100svh-23.5rem)]"
                  style={{ aspectRatio: `415 / ${EXAMPLE_HEIGHT}` }}
                >
                  <div
                    key={`${plugin}/${style}`}
                    className={cn(
                      "duration-300 animate-in fade-in",
                      state.status === "loading" && "animate-pulse opacity-40"
                    )}
                  >
                    {real ? (
                      <img
                        src={`/hero/real/${real.plugin}-${real.style}.svg`}
                        alt={tPreview("alt", { platform: pluginName(real.plugin), username: real.username })}
                        width={real.width}
                        height={real.height}
                        onLoad={measureClip}
                        className="block h-auto w-full"
                      />
                    ) : (
                      example.map((item) => (
                        <img
                          key={item.section}
                          src={`/previews/${plugin}/${style}/${item.section}.svg`}
                          alt=""
                          width={item.width}
                          height={item.height}
                          onLoad={measureClip}
                          className="block h-auto w-full"
                        />
                      ))
                    )}
                  </div>
                  {clipped && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {saveHref && (
            <a
              href={saveHref}
              className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-[15px] font-semibold ${INK_BUTTON}`}
            >
              {tPreview("save")}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      {/* Torn edge into the page. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-1px] h-8 w-full fill-background"
      >
        <path d="M0,40 L0,22 L60,30 L130,12 L210,26 L290,8 L380,24 L470,10 L560,28 L640,14 L730,30 L820,10 L900,24 L990,8 L1080,26 L1150,14 L1200,22 L1200,40 Z" />
      </svg>
    </section>
  )
}
