"use client"

import { useEffect, useState, type FormEvent } from "react"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useAuth } from "@/hooks/useAuth"
import { useTranslations } from "@/i18n/use-translations"
import { getPluginIcon } from "@/lib/plugin-icons"
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
import { SectionHeading } from "./SectionHeading"

const PLATFORMS = Object.keys(PREVIEW_PLUGINS) as PreviewPluginId[]

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; src: string; request: PreviewRequest }
  | { status: "error"; message: string }

/**
 * The landing page's "try it": a visitor types a username and sees their real card
 * (GET /api/preview), then carries that exact card into the wizard through sign-up.
 */
export function PreviewYourCard() {
  const t = useTranslations("landing.preview")
  const { user } = useAuth()
  const [plugin, setPlugin] = useState<PreviewPluginId>("github")
  const [username, setUsername] = useState("")
  const [style, setStyle] = useState<PreviewStyle>("default")
  const [state, setState] = useState<State>({ status: "idle" })

  // The image is a blob URL; release it when it is replaced or the block unmounts.
  const src = state.status === "ready" ? state.src : null
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src)
    }
  }, [src])

  const pluginName = (id: PreviewPluginId) => PLUGINS_METADATA[id]?.displayName ?? id

  async function showCard(event: FormEvent) {
    event.preventDefault()
    const parsed = parsePreviewRequest(
      new URLSearchParams({ plugin, username: username.trim(), style, theme: "default", size: "half" })
    )
    if (!parsed.ok) {
      setState({ status: "error", message: t("errors.invalid") })
      return
    }

    setState({ status: "loading" })
    try {
      const response = await fetch(`/api/preview?${previewQuery(parsed.value)}`)
      if (response.ok) {
        const blob = await response.blob()
        setState({ status: "ready", src: URL.createObjectURL(blob), request: parsed.value })
        return
      }
      setState({ status: "error", message: await errorMessage(response) })
    } catch {
      setState({ status: "error", message: t("errors.generic") })
    }
  }

  async function errorMessage(response: Response): Promise<string> {
    const code = ((await response.json().catch(() => ({}))) as { code?: string }).code
    if (code === "PREVIEW_USER_NOT_FOUND") return t("errors.notFound", { platform: pluginName(plugin) })
    if (code === "PREVIEW_PROFILE_PRIVATE") return t("errors.private", { platform: pluginName(plugin) })
    if (code === "PREVIEW_RATE_LIMITED") {
      const seconds = Number(response.headers.get("Retry-After")) || 60
      return t("errors.rateLimited", { minutes: Math.max(1, Math.ceil(seconds / 60)) })
    }
    if (code === "PREVIEW_UNAVAILABLE") return t("errors.unavailable", { platform: pluginName(plugin) })
    if (code === "INVALID_PREVIEW_REQUEST") return t("errors.invalid")
    return t("errors.generic")
  }

  // A plain link, not the router: sign-up is a separate page load anyway, and the wizard
  // reads the card from the query string it lands on.
  const saveHref =
    state.status === "ready"
      ? user
        ? wizardPathFor(state.request)
        : withReturnTo("/signup", wizardPathFor(state.request))
      : null

  return (
    <section id="try" className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)] md:py-24">
        <div>
          <SectionHeading align="left" kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />

          <form onSubmit={showCard} className="mt-8 max-w-[520px] space-y-5">
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold text-foreground">{t("platform")}</legend>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((id) => {
                  const Icon = getPluginIcon(id)
                  const selected = id === plugin
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPlugin(id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                        selected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                      {pluginName(id)}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="preview-username" className="mb-2 block text-[13px] font-semibold text-foreground">
                {PREVIEW_PLUGINS[plugin].field === "steamId"
                  ? t("steamLabel")
                  : t("usernameLabel", { platform: pluginName(plugin) })}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="preview-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={PREVIEW_PLACEHOLDERS[plugin]}
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={120}
                  className="h-11 w-full min-w-0 rounded-lg sm:flex-1 border border-border bg-card px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={state.status === "loading" || !username.trim()}
                  className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-5 text-[14px] font-semibold text-background transition-opacity disabled:opacity-50"
                >
                  {state.status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {t("submit")}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[13px]">
              <span className="font-semibold text-foreground">{t("style")}</span>
              {(["default", "terminal"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={style === option}
                  onClick={() => setStyle(option)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 font-medium transition-colors",
                    style === option
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t(`styles.${option}`)}
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <div className="flex min-h-[220px] items-center justify-center" aria-live="polite">
            {state.status === "idle" && (
              <p className="max-w-[260px] text-center text-[13px] text-muted-foreground">{t("empty")}</p>
            )}
            {state.status === "loading" && (
              <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted" aria-label={t("loading")} />
            )}
            {state.status === "error" && (
              <p role="alert" className="max-w-[300px] text-center text-[13px] text-amber-600 dark:text-amber-400">
                {state.message}
              </p>
            )}
            {state.status === "ready" && (
              <img
                src={state.src}
                alt={t("alt", { platform: pluginName(state.request.plugin), username: state.request.username })}
                className="block w-full rounded"
              />
            )}
          </div>

          {saveHref && (
            <div className="mt-4 border-t border-border/60 pt-4">
              <a
                href={saveHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.01]"
              >
                {t("save")}
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-2 text-center text-[12px] text-muted-foreground">
                {user ? t("saveHintSignedIn") : t("saveHint")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
