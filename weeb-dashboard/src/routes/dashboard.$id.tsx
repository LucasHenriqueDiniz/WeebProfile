import { useEffect, useState } from "react"
import { useSearchParams, useParams } from "@/src/compat/next-navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import { useTranslations, useLocale } from "@/i18n/use-translations"
import { Button } from "@/components/ui/button"
import { STATUS_DOT } from "@/components/dashboard/SvgLibraryCard"
import { getPluginIcon } from "@/lib/plugin-icons"
import { formatRelative } from "@/lib/utils/relative-time"
import { cn } from "@/lib/utils"
import {
  Loader2,
  Copy,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  Clock,
  Edit2,
  Code2,
  Link2,
  Info,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/i18n/navigation"
import { svgApi, ApiException } from "@/lib/api"
import { useSvgStore } from "@/stores/svg-store"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { SvgViewSkeleton } from "@/components/sections/TemplateCardSkeleton"
import { generateMarkdown } from "@/lib/utils/markdown"
import { publicSvgUrl } from "@/lib/utils/svg-url"
import { nextRefreshAt } from "@/lib/utils/nightly-run"
import { guessGithubLogin } from "@/lib/utils/github-profile"
import { readEmbedAlt, writeEmbedAlt } from "@/lib/utils/embed-prefs"
import { PanelCard } from "@/components/dashboard/PanelCard"
import { SideBySidePanel } from "@/components/dashboard/SideBySidePanel"
import { TILE_PLUGINS, TilesPanel } from "@/components/dashboard/TilesPanel"
import { ProfileReadmePanel } from "@/components/dashboard/ProfileReadmePanel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Svg } from "@/lib/db/schema"
import { PLUGINS_METADATA, type PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"
import { BUTTON_ICON, BUTTON_SECONDARY_SM, CHIP, HALFTONE, STICKER, TILE } from "@/components/landing/sticker"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"

export default function SvgViewPage() {
  const t = useTranslations("view")
  const tEmbed = useTranslations("embed")
  const locale = useLocale()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const svgId = params.id as string
  const urlFromQuery = searchParams.get("url")
  const { getSvg, getSvgSync, updateSvg, svgs: allSvgs, fetchSvgs } = useSvgStore()

  // Tentar pegar do cache imediatamente (síncrono)
  const cachedSvg = getSvgSync(svgId)
  const [svg, setSvg] = useState<Svg | null>(cachedSvg || null)
  const [imageFailed, setImageFailed] = useState(false)
  const [loading, setLoading] = useState(!cachedSvg) // Só loading se não tiver cache
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  // What the user typed as alt text; null until they do, and then the SVG's name applies.
  const [typedAlt, setTypedAlt] = useState<string | null>(() => readEmbedAlt(svgId))

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Buscar SVG do store apenas se não tiver em cache válido
    if (user && svgId) {
      const cached = getSvgSync(svgId)
      if (cached) {
        // Se já tem cache válido, usar ele
        setSvg(cached)
        setLoading(false)
      } else {
        // Só buscar se não tiver cache
        loadSvg()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, svgId])

  // The other SVGs: the half ones can share a row with this one, and a github plugin
  // username is a guess at the README's owner. Cached by the store for 5 minutes.
  useEffect(() => {
    if (user) fetchSvgs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadSvg = async (force = false) => {
    // Só mostrar loading se realmente não tiver dados
    if (!svg) {
      setLoading(true)
    }
    const svgData = await getSvg(svgId, force)
    if (svgData) {
      setSvg(svgData)
    }
    setLoading(false)
  }

  // Polling para verificar status da geração
  // Só fazer polling se o status for "generating"
  useEffect(() => {
    if (!svg || svg.status !== "generating") {
      return
    }

    // Verificar se já está gerando antes de iniciar polling
    let isPolling = true

    const interval = setInterval(async () => {
      if (!isPolling) {
        clearInterval(interval)
        return
      }

      try {
        const updatedSvg = await getSvg(svgId, true) // force refresh
        if (updatedSvg) {
          setSvg(updatedSvg)
          // Se completou ou falhou, parar polling
          if (updatedSvg.status === "completed" || updatedSvg.status === "failed") {
            isPolling = false
            clearInterval(interval)
          }
        }
      } catch (error) {
        console.error("Error polling SVG status:", error)
        // Em caso de erro, parar polling para evitar spam
        isPolling = false
        clearInterval(interval)
      }
    }, 3000) // Verificar a cada 3 segundos (reduzido de 2s)

    return () => {
      isPolling = false
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svg?.status, svgId]) // Só re-executar se o status mudar

  const altText = typedAlt?.trim() || svg?.name || "Profile"

  const handleCopyMarkdown = async () => {
    if (!svg || !(svg.storageUrl || urlFromQuery)) return
    const markdown = generateMarkdown({
      alt: altText,
      url: publicSvgUrl(svgId),
      size: (svg.size as "half" | "full") || "half",
    })

    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      toast({
        title: t("markdown.toastCopied"),
        description: t("markdown.toastCopiedDescription"),
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: t("markdown.toastError"),
        description: t("markdown.toastErrorDescription"),
        variant: "destructive",
      })
    }
  }

  const handleCopyUrl = async () => {
    if (!(svg?.storageUrl || urlFromQuery)) return
    const url = publicSvgUrl(svgId)

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: t("url.toastCopied"),
        description: t("url.toastCopiedDescription"),
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: t("url.toastError"),
        description: t("url.toastErrorDescription"),
        variant: "destructive",
      })
    }
  }

  const handleForceGenerate = async () => {
    if (!svg) return

    try {
      setGenerating(true)

      // Atualizar status imediatamente - o useEffect vai fazer polling automaticamente
      updateSvg(svgId, { status: "generating" })
      setSvg({ ...svg, status: "generating" })

      const result = await svgApi.generate(svgId, true) // force = true

      // Atualizar com dados retornados se disponível
      if (result.svg) {
        const updatedSvgData = {
          ...svg,
          ...result.svg,
          status: result.svg.status || "generating",
        }
        updateSvg(svgId, {
          status: updatedSvgData.status,
          storageUrl: updatedSvgData.storageUrl,
          lastGeneratedAt: updatedSvgData.lastGeneratedAt,
        })
        setSvg(updatedSvgData)
      }

      toast({
        title: t("toast.generating"),
        description: t("toast.generatingDescription"),
      })

      // Recarregar do servidor após um delay para pegar dados atualizados
      // O useEffect já vai fazer polling, mas vamos forçar um refresh inicial
      setTimeout(async () => {
        const updatedSvg = await getSvg(svgId, true) // force refresh
        if (updatedSvg) {
          setSvg(updatedSvg)
        }
      }, 3000)
    } catch (error) {
      let errorMessage = t("toast.errorMessage")
      let errorTitle = t("toast.error")

      if (error instanceof ApiException) {
        // The generator timed out (generate.ts answers 503 with retryable: true)
        if (error.data.retryable) {
          errorTitle = t("toast.serviceStarting")
          errorMessage = error.data.message || t("toast.serviceStartingDescription")
        } else {
          errorMessage = error.data.message || error.data.error || error.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
      setGenerating(false)
    }
  }

  const handleRetryGenerate = async () => {
    try {
      setGenerating(true)
      await svgApi.generate(svgId, false)
      updateSvg(svgId, { status: "generating" })
      if (svg) setSvg({ ...svg, status: "generating" })
      toast({
        title: t("toast.generating"),
        description: t("toast.generatingDescription"),
      })
      // Recarregar após um delay com force para pegar dados atualizados
      setTimeout(() => {
        loadSvg(true) // force refresh
      }, 2000)
    } catch (error) {
      let errorMessage = t("toast.errorMessage")
      let errorTitle = t("toast.error")

      if (error instanceof ApiException) {
        // The generator timed out (generate.ts answers 503 with retryable: true)
        if (error.data.retryable) {
          errorTitle = t("toast.serviceStarting")
          errorMessage = error.data.message || t("toast.serviceStartingDescription")
        } else {
          errorMessage = error.data.message || error.data.error || error.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  // Calcular cooldown restante
  const getCooldownRemaining = () => {
    if (!svg?.lastGeneratedAt) return null
    const lastGenerated = new Date(svg.lastGeneratedAt)
    const now = new Date()
    const minutesSinceLastGeneration = (now.getTime() - lastGenerated.getTime()) / (1000 * 60)
    const COOLDOWN_MINUTES = 20
    const remaining = COOLDOWN_MINUTES - minutesSinceLastGeneration
    return remaining > 0 ? Math.ceil(remaining) : 0
  }

  const cooldownRemaining = getCooldownRemaining()

  // Só mostrar loading completo se não tiver dados em cache e estiver carregando inicialmente
  if (authLoading || (loading && !svg && !urlFromQuery)) {
    return <LoadingScreen />
  }

  // Mostrar skeleton se estiver carregando dados mas tiver cache
  if (loading && svg) {
    return <SvgViewSkeleton />
  }

  if (!svg && !urlFromQuery) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-6">
          <div className={cn(STICKER, "w-full max-w-md p-8 text-center")}>
            <img src="/sora/sora-head.png" alt="" className="mx-auto mb-4 h-12 w-12 object-contain" />
            <h2 className="font-heading text-xl font-extrabold text-foreground">{t("notFound.title")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("notFound.description")}</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-6 w-full">
              {t("backToDashboard")}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Adicionar timestamp para forçar reload da imagem (cache busting)
  // Usar lastGeneratedAt como chave para forçar reload quando a imagem é regenerada
  const baseImageUrl = svg?.storageUrl || urlFromQuery
  const cacheBuster = svg?.lastGeneratedAt
    ? new Date(svg.lastGeneratedAt).getTime()
    : svg?.updatedAt
      ? new Date(svg.updatedAt).getTime()
      : Date.now()
  const imageUrl = baseImageUrl ? `${baseImageUrl}${baseImageUrl.includes("?") ? "&" : "?"}t=${cacheBuster}` : null

  // What gets pasted is the stable address; the bucket URL only feeds the preview above.
  const publicUrl = baseImageUrl ? publicSvgUrl(svgId) : null
  const markdownCode =
    svg && publicUrl
      ? generateMarkdown({
          alt: altText,
          url: publicUrl,
          size: (svg.size as "half" | "full") || "half",
        })
      : ""

  // Generated ones only: a README pointing at an SVG with nothing in R2 shows a broken image.
  const otherHalves =
    svg?.size === "half"
      ? allSvgs.filter((other) => other.id !== svgId && other.size === "half" && other.storageUrl)
      : []
  const guessedLogin = guessGithubLogin(user?.user_metadata.github_login, [
    ...(svg ? [svg] : []),
    ...allSvgs.filter((other) => other.id !== svgId),
  ])
  const nextRefresh = svg ? nextRefreshAt(svg, new Date()) : null

  const plugins: string[] = (svg?.pluginsOrder || "")
    .split(",")
    .map((p: string) => p.trim())
    .filter(Boolean)

  const statusLabel =
    svg?.status === "completed" ? t("completed") : svg?.status === "generating" ? t("generating") : t("error")

  const headerTitle = svg?.name || t("title")

  // Outside the <h1>: a heading should not contain a control.
  const headerLeading = (
    <button
      type="button"
      onClick={() => router.push("/dashboard")}
      className={cn(BUTTON_ICON, "-ml-2 mt-0.5 md:mt-1.5")}
      aria-label={t("backToDashboard")}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  )

  const headerActions = svg ? (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          CHIP,
          svg.status === "failed" && "border-red-600 text-red-700 dark:border-red-400 dark:text-red-400"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[svg.status] ?? "bg-muted-foreground")} />
        {statusLabel}
      </span>
      <button
        type="button"
        className={BUTTON_SECONDARY_SM}
        onClick={() => router.push(`/dashboard/${svgId}/edit`)}
        aria-label={t("edit")}
      >
        <Edit2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("edit")}</span>
      </button>
      <button
        type="button"
        className={BUTTON_SECONDARY_SM}
        onClick={handleForceGenerate}
        disabled={generating || svg.status === "generating"}
        aria-label={t("regenerate")}
      >
        {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{t("regenerate")}</span>
      </button>
    </div>
  ) : undefined

  return (
    <DashboardLayout
      title={headerTitle}
      leading={headerLeading}
      description={svg ? `${t("created")} ${formatRelative(svg.createdAt, locale)}` : undefined}
      actions={headerActions}
    >
      <div>
        {/* Cooldown Warning */}
        {svg && cooldownRemaining !== null && cooldownRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2.5 rounded-xl border-2 border-foreground bg-amber-300 px-4 py-3 text-sm font-medium text-slate-950"
          >
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{t("cooldownWarning", { minutes: cooldownRemaining })}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Preview — the SVG on a dot-grid canvas, no chrome fighting for attention */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.25 }}
            className="lg:col-span-2"
          >
            <div className={cn(STICKER, "overflow-hidden")}>
              {imageUrl && !imageFailed ? (
                // The frame takes the card's height: a fixed minimum left ~420px of dots
                // around a full-width card drawn 280px tall on a phone.
                <div className="relative flex items-center justify-center bg-muted/50 p-4 sm:p-6 md:min-h-[420px] md:p-10">
                  <div
                    aria-hidden
                    className={cn(
                      HALFTONE,
                      "right-0 top-0 h-28 w-48 [mask-image:linear-gradient(to_bottom_left,black,transparent)]"
                    )}
                  />
                  <motion.img
                    key={`${svg?.id}-${cacheBuster}`}
                    src={imageUrl}
                    alt={svg?.name || "Profile SVG"}
                    className="relative z-10 h-auto max-w-full"
                    style={{ maxHeight: "560px" }}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onError={() => setImageFailed(true)}
                  />
                </div>
              ) : imageUrl ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <p className="mb-2 font-semibold text-foreground">{t("preview.errorLoading")}</p>
                  <p className="text-sm text-muted-foreground">{t("preview.errorLoadingDescription")}</p>
                </div>
              ) : svg?.status === "failed" ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <p className="mb-2 font-medium text-destructive">{t("preview.errorGenerating")}</p>
                  {svg.lastError && (
                    <div className="mb-4 max-w-md rounded-xl border-2 border-red-600 bg-red-50 p-3 text-sm text-red-800 dark:border-red-400 dark:bg-red-950/40 dark:text-red-300">
                      <p className="mb-1 font-medium">{t("preview.errorDetails")}</p>
                      <p className="break-words text-xs">{svg.lastError}</p>
                    </div>
                  )}
                  <p className="mb-4 text-sm text-muted-foreground">{t("preview.errorTryAgain")}</p>
                  <Button variant="outline" onClick={handleRetryGenerate} disabled={generating}>
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("toast.generating")}
                      </>
                    ) : (
                      t("preview.tryAgain")
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center md:min-h-[420px]">
                  <span className={cn(TILE, "mb-5 h-14 w-14 bg-cyan-300")}>
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </span>
                  <p className="mb-1 text-sm font-medium text-foreground">
                    {svg?.status === "generating" ? t("preview.generating") : t("preview.waiting")}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("preview.waitingDescription")}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Side panels */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.25 }}
            className="space-y-4"
          >
            {/* Markdown */}
            <PanelCard
              icon={Code2}
              title={t("markdown.title")}
              action={
                <Button
                  variant={copied ? "default" : "outline"}
                  size="sm"
                  onClick={handleCopyMarkdown}
                  className="h-7 gap-1.5 px-2.5 text-xs"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t("markdown.copied") : t("markdown.copy")}
                </Button>
              }
            >
              <p className="mb-3 text-xs text-muted-foreground">{t("markdown.description")}</p>
              {/* Wrapped, not scrolled: the column is ~250px wide and the markdown about
                  1100px, so a horizontal scroll showed a fifth of what gets pasted. The
                  URL has no spaces, hence overflow-wrap:anywhere rather than break-words. */}
              <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border-2 border-foreground/30 bg-muted/50 p-3 font-mono text-xs">
                <code className="text-foreground">{markdownCode}</code>
              </pre>
              {svg && (
                <div className="mt-3">
                  <Label htmlFor="embed-alt" className="mb-1.5 block text-xs text-muted-foreground">
                    {tEmbed("altLabel")}
                  </Label>
                  <Input
                    id="embed-alt"
                    value={typedAlt ?? svg.name ?? ""}
                    onChange={(e) => {
                      setTypedAlt(e.target.value)
                      writeEmbedAlt(svgId, e.target.value)
                    }}
                    placeholder={svg.name}
                    className="h-8 text-xs"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">{tEmbed("altHint")}</p>
                </div>
              )}
            </PanelCard>

            {svg && otherHalves.length > 0 && (
              <SideBySidePanel current={svg} currentAlt={altText} others={otherHalves} />
            )}

            {svg && TILE_PLUGINS.some((plugin) => plugins.includes(plugin)) && (
              <TilesPanel svgId={svgId} generatedAt={svg.lastGeneratedAt ?? null} />
            )}

            {svg && user && <ProfileReadmePanel userId={user.id} guessedLogin={guessedLogin} />}

            {/* URL */}
            {publicUrl && (
              <PanelCard
                icon={Link2}
                title={t("url.title")}
                action={
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      className={cn(BUTTON_ICON, "h-8 w-8")}
                      onClick={handleCopyUrl}
                      aria-label={t("url.copyUrl")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(BUTTON_ICON, "h-8 w-8")}
                      aria-label={t("url.open")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </span>
                }
              >
                <code className="block break-all rounded-lg border-2 border-foreground/30 bg-muted/50 p-3 text-xs text-foreground">
                  {publicUrl}
                </code>
              </PanelCard>
            )}

            {/* Info */}
            {svg && (
              <PanelCard icon={Info} title={t("info.title")}>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{t("info.style")}</dt>
                    <dd className="font-mono text-xs text-foreground">
                      {svg.style || "default"} · {svg.size === "full" ? "830px" : "415px"}
                    </dd>
                  </div>
                  {plugins.length > 0 && (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{t("info.plugins")}</dt>
                      <dd className="flex items-center gap-1">
                        {plugins.map((plugin) => {
                          const Icon = getPluginIcon(plugin)
                          const category = (PLUGINS_METADATA as Record<string, { category?: PluginCategory }>)[plugin]
                            ?.category
                          return Icon ? (
                            <span
                              key={plugin}
                              title={plugin}
                              className={cn(
                                TILE,
                                "h-7 w-7 rounded-lg",
                                category ? CATEGORY_STYLE[category].sticker : "bg-muted text-foreground"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                          ) : null
                        })}
                      </dd>
                    </div>
                  )}
                  {svg.lastGeneratedAt && (
                    <div className="flex items-center justify-between gap-4 border-t-2 border-foreground/10 pt-3">
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("info.lastGenerated")}
                      </dt>
                      <dd className="text-xs text-foreground" title={new Date(svg.lastGeneratedAt).toLocaleString()}>
                        {formatRelative(svg.lastGeneratedAt, locale)}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 border-t-2 border-foreground/10 pt-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      {tEmbed("nextRefresh.label")}
                    </dt>
                    <dd
                      className="text-right text-xs text-foreground"
                      title={
                        nextRefresh
                          ? tEmbed("nextRefresh.nightly", {
                              time: nextRefresh.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
                            })
                          : undefined
                      }
                    >
                      {nextRefresh
                        ? `${formatRelative(nextRefresh.toISOString(), locale)} · ${nextRefresh.toLocaleString(locale, {
                            weekday: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : tEmbed("nextRefresh.paused")}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t-2 border-foreground/10 pt-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{t("info.createdAt")}</dt>
                    <dd className="text-xs text-foreground" title={new Date(svg.createdAt).toLocaleString()}>
                      {formatRelative(svg.createdAt, locale)}
                    </dd>
                  </div>
                </dl>
              </PanelCard>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
