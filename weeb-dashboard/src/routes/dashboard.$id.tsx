import { useEffect, useState } from "react"
import { useSearchParams, useParams } from "@/src/compat/next-navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import { useTranslations, useLocale } from "@/i18n/use-translations"
import { Button } from "@/components/ui/button"
import { STATUS_DOT } from "@/components/dashboard/SvgLibraryRow"
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

/** Compact card shell shared by the side panels — quieter than the shadcn Card headers. */
function PanelCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: typeof Code2
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {action ? <span className="ml-auto">{action}</span> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function SvgViewPage() {
  const t = useTranslations("view")
  const locale = useLocale()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const svgId = params.id as string
  const urlFromQuery = searchParams.get("url")
  const { getSvg, getSvgSync, updateSvg } = useSvgStore()

  // Tentar pegar do cache imediatamente (síncrono)
  const cachedSvg = getSvgSync(svgId)
  const [svg, setSvg] = useState<any>(cachedSvg || null)
  const [loading, setLoading] = useState(!cachedSvg) // Só loading se não tiver cache
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

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

  const handleCopyMarkdown = async () => {
    const url = svg?.storageUrl || urlFromQuery
    if (!url || !svg) return

    const markdown = generateMarkdown({
      name: svg.name || "Profile",
      url,
      size: (svg.size as "half" | "full") || "half",
      lastGeneratedAt: svg.lastGeneratedAt,
    })

    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      toast({
        title: t("markdown.toastCopied"),
        description: t("markdown.toastCopiedDescription"),
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: t("markdown.toastError"),
        description: t("markdown.toastErrorDescription"),
        variant: "destructive",
      })
    }
  }

  const handleCopyUrl = async () => {
    const url = svg?.storageUrl || urlFromQuery
    if (!url) return

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: t("url.toastCopied"),
        description: t("url.toastCopiedDescription"),
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
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
        // Verificar se é um timeout do Vercel (serviço "acordando")
        if (error.data.code === "VERCEL_TIMEOUT" || error.data.retryable) {
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
      setSvg({ ...svg, status: "generating" })
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
        // Verificar se é um timeout do Vercel (serviço "acordando")
        if (error.data.code === "VERCEL_TIMEOUT" || error.data.retryable) {
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
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
            <img src="/sora/sora-head.png" alt="" className="mx-auto mb-4 h-12 w-12 object-contain opacity-60" />
            <h2 className="font-heading text-lg font-bold text-foreground">{t("notFound.title")}</h2>
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

  // Gerar markdown usando o helper (inclui cache-busting e formato correto por tamanho)
  const markdownCode =
    svg && baseImageUrl
      ? generateMarkdown({
          name: svg.name || "Profile",
          url: baseImageUrl,
          size: (svg.size as "half" | "full") || "half",
          lastGeneratedAt: svg.lastGeneratedAt,
        })
      : `![${svg?.name || "Profile"}](${baseImageUrl || imageUrl})`

  const plugins: string[] = (svg?.pluginsOrder || "")
    .split(",")
    .map((p: string) => p.trim())
    .filter(Boolean)

  const statusLabel =
    svg?.status === "completed" ? t("completed") : svg?.status === "generating" ? t("generating") : t("error")

  const headerTitle = svg?.name || t("title")

  // Fora do <h1>: heading não deve conter controle. Ver Header.leading.
  const headerLeading = (
    <button
      onClick={() => router.push("/dashboard")}
      className="-ml-1 flex-shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground"
      aria-label={t("backToDashboard")}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  )

  const headerActions = svg ? (
    <div className="flex items-center gap-3">
      <span className="hidden items-center gap-1.5 sm:flex">
        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[svg.status] ?? "bg-muted-foreground")} />
        <span className="text-xs text-muted-foreground">{statusLabel}</span>
      </span>
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/${svgId}/edit`)} className="gap-1.5">
        <Edit2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("edit")}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleForceGenerate}
        disabled={generating || svg.status === "generating"}
        className="gap-1.5"
      >
        {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{t("regenerate")}</span>
      </Button>
    </div>
  ) : undefined

  return (
    <DashboardLayout
      title={headerTitle}
      leading={headerLeading}
      description={svg ? `${t("created")} ${formatRelative(svg.createdAt, locale)}` : undefined}
      actions={headerActions}
    >
      <div className="py-2 md:py-4">
        {/* Cooldown Warning */}
        {svg && cooldownRemaining !== null && cooldownRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400"
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
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {imageUrl ? (
                <div className="relative flex min-h-[420px] items-center justify-center p-6 md:p-10">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.06)_1px,transparent_1px)] [background-size:18px_18px]"
                  />
                  <motion.img
                    key={`${svg?.id}-${cacheBuster}`}
                    src={imageUrl}
                    alt={svg?.name || "Profile SVG"}
                    className="relative z-10 h-auto max-w-full rounded-lg shadow-2xl"
                    style={{ maxHeight: "560px" }}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent) {
                        const errorMsg = t("preview.errorLoading")
                        const errorDesc = t("preview.errorLoadingDescription")
                        parent.innerHTML = `
                        <div class="flex flex-col items-center justify-center p-8 text-center relative z-10">
                          <div class="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <svg class="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                          </div>
                          <p class="text-foreground font-medium mb-2">${errorMsg}</p>
                          <p class="text-sm text-muted-foreground">${errorDesc}</p>
                        </div>
                      `
                      }
                    }}
                  />
                </div>
              ) : svg?.status === "failed" ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <p className="mb-2 font-medium text-destructive">{t("preview.errorGenerating")}</p>
                  {svg.lastError && (
                    <div className="mb-4 max-w-md rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive/80">
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
                <div className="flex min-h-[420px] flex-col items-center justify-center p-12 text-center">
                  <span className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/15 to-cyan-500/15">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
              <pre className="overflow-x-auto rounded-lg border border-border/50 bg-muted/50 p-3 font-mono text-xs">
                <code className="text-foreground">{markdownCode}</code>
              </pre>
            </PanelCard>

            {/* URL */}
            {imageUrl && (
              <PanelCard
                icon={Link2}
                title={t("url.title")}
                action={
                  <span className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleCopyUrl}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => window.open(imageUrl, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </span>
                }
              >
                <code className="block break-all rounded-lg border border-border/50 bg-muted/50 p-3 text-xs text-muted-foreground">
                  {imageUrl}
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
                          return Icon ? (
                            <span
                              key={plugin}
                              title={plugin}
                              className="flex h-6 w-6 items-center justify-center rounded bg-muted text-muted-foreground"
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                          ) : null
                        })}
                      </dd>
                    </div>
                  )}
                  {svg.lastGeneratedAt && (
                    <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-3">
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("info.lastGenerated")}
                      </dt>
                      <dd className="text-xs text-foreground" title={new Date(svg.lastGeneratedAt).toLocaleString()}>
                        {formatRelative(svg.lastGeneratedAt, locale)}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-3">
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
