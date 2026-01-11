"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useParams as useNextParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, CheckCircle2, ExternalLink, Edit, RefreshCw, ArrowLeft, Calendar, Image as ImageIcon, Code2, Link2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/i18n/navigation"
import Image from "next/image"
import { svgApi, ApiException } from "@/lib/api"
import { useSvgStore } from "@/stores/svg-store"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { SvgViewSkeleton } from "@/components/sections/TemplateCardSkeleton"
import { generateMarkdown } from "@/lib/utils/markdown"

export default function SvgViewPage() {
  const t = useTranslations('view')
  const params = useNextParams()
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
      size: (svg.size as 'half' | 'full') || 'half',
      lastGeneratedAt: svg.lastGeneratedAt,
    })

    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      toast({
        title: t('markdown.toastCopied'),
        description: t('markdown.toastCopiedDescription'),
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: t('markdown.toastError'),
        description: t('markdown.toastErrorDescription'),
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
        title: t('url.toastCopied'),
        description: t('url.toastCopiedDescription'),
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: t('url.toastError'),
        description: t('url.toastErrorDescription'),
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
        title: t('toast.generating'),
        description: t('toast.generatingDescription'),
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
      let errorMessage = t('toast.errorMessage')
      let errorTitle = t('toast.error')
      
      if (error instanceof ApiException) {
        // Verificar se é um timeout do Vercel (serviço "acordando")
        if (error.data.code === "VERCEL_TIMEOUT" || error.data.retryable) {
          errorTitle = t('toast.serviceStarting')
          errorMessage = error.data.message || t('toast.serviceStartingDescription')
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('notFound.title')}</CardTitle>
            <CardDescription>{t('notFound.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              {t('backToDashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
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
  const imageUrl = baseImageUrl 
    ? `${baseImageUrl}${baseImageUrl.includes('?') ? '&' : '?'}t=${cacheBuster}`
    : null
  
  // Gerar markdown usando o helper (inclui cache-busting e formato correto por tamanho)
  const markdownCode = svg && baseImageUrl
    ? generateMarkdown({
        name: svg.name || "Profile",
        url: baseImageUrl,
        size: (svg.size as 'half' | 'full') || 'half',
        lastGeneratedAt: svg.lastGeneratedAt,
      })
    : `![${svg?.name || "Profile"}](${baseImageUrl || imageUrl})`

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {svg?.name || t('title')}
              </h1>
              {svg && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t('created')} {new Date(svg.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          {svg && (
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  svg.status === "completed"
                    ? "default"
                    : svg.status === "generating"
                    ? "secondary"
                    : "destructive"
                }
                className="px-3 py-1"
              >
                {svg.status === "completed"
                  ? t('completed')
                  : svg.status === "generating"
                  ? t('generating')
                  : t('error')}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleForceGenerate}
                disabled={generating || svg.status === "generating"}
                className="gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('toast.generating')}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    {t('regenerate')}
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Cooldown Warning */}
        {svg && cooldownRemaining !== null && cooldownRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm text-yellow-700 dark:text-yellow-400 mb-6 flex items-center gap-2"
          >
            <span className="text-lg">⏱️</span>
            <span>{t('cooldownWarning', { minutes: cooldownRemaining })}</span>
          </motion.div>
        )}

        {/* Layout Desktop: PREVIEW | DADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PREVIEW Column - Takes 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">{t('preview.title')}</CardTitle>
                </div>
                <CardDescription>{t('preview.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {imageUrl ? (
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-6 md:p-8 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[400px] relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                    <motion.img
                      key={`${svg?.id}-${cacheBuster}`}
                      src={imageUrl}
                      alt={svg?.name || "Profile SVG"}
                      className="max-w-full h-auto rounded-lg shadow-2xl relative z-10"
                      style={{ maxHeight: "500px" }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        const target = e.currentTarget
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          const errorMsg = t('preview.errorLoading')
                          const errorDesc = t('preview.errorLoadingDescription')
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
                  <div className="border rounded-lg p-12 bg-destructive/10 flex flex-col items-center justify-center">
                    <p className="text-destructive font-medium mb-2">{t('preview.errorGenerating')}</p>
                    {svg.lastError && (
                      <div className="text-sm text-destructive/80 mb-4 p-3 bg-destructive/5 rounded border border-destructive/20 max-w-md">
                        <p className="font-medium mb-1">{t('preview.errorDetails')}</p>
                        <p className="text-xs break-words">{svg.lastError}</p>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {t('preview.errorTryAgain')}
                    </p>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          setGenerating(true)
                          await svgApi.generate(svgId, false)
                          updateSvg(svgId, { status: "generating" })
                          setSvg({ ...svg, status: "generating" })
                          toast({
                            title: t('toast.generating'),
                            description: t('toast.generatingDescription'),
                          })
          // Recarregar após um delay com force para pegar dados atualizados
          setTimeout(() => {
            loadSvg(true) // force refresh
          }, 2000)
                        } catch (error) {
                          let errorMessage = "Não foi possível iniciar a geração"
                          let errorTitle = "Erro"
                          
                          if (error instanceof ApiException) {
                            // Verificar se é um timeout do Vercel (serviço "acordando")
                            if (error.data.code === "VERCEL_TIMEOUT" || error.data.retryable) {
                              errorTitle = "Serviço iniciando"
                              errorMessage = error.data.message || "O serviço de geração está acordando. Por favor, aguarde alguns segundos e tente novamente."
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
                      }}
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('toast.generating')}
                        </>
                      ) : (
                        t('preview.tryAgain')
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-12 bg-muted/50 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      {svg?.status === "generating" ? t('preview.generating') : t('preview.waiting')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('preview.waitingDescription')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* DADOS Column - Takes 1 column on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="space-y-6"
          >
            {/* Markdown Code */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">{t('markdown.title')}</CardTitle>
                  </div>
                  <Button 
                    variant={copied ? "default" : "outline"} 
                    size="sm" 
                    onClick={handleCopyMarkdown}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {t('markdown.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t('markdown.copy')}
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>{t('markdown.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 bg-muted/50 rounded-lg font-mono text-xs md:text-sm overflow-x-auto border border-border/50">
                    <code className="text-foreground">{markdownCode}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* URL */}
            {imageUrl && (
              <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">{t('url.title')}</CardTitle>
                  </div>
                  <CardDescription>{t('url.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyUrl} 
                      className="flex-1 gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {t('url.copyUrl')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(imageUrl, "_blank")}
                      className="flex-1 gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('url.open')}
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                    <code className="text-xs break-all text-foreground">{imageUrl}</code>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Card - Moved here for better layout */}
            {svg && (
              <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">{t('info.title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('info.style')}</div>
                        <div className="font-semibold capitalize">{svg.style || "default"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('info.size')}</div>
                        <div className="font-semibold capitalize">{svg.size || "half"}</div>
                      </div>
                    </div>
                    {svg.lastGeneratedAt && (
                      <div className="space-y-1 pt-2 border-t border-border/50">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('info.lastGenerated')}</div>
                        <div className="font-semibold text-sm">
                          {new Date(svg.lastGeneratedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                    <div className="space-y-1 pt-2 border-t border-border/50">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('info.createdAt')}</div>
                      <div className="font-semibold text-sm">
                        {new Date(svg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  )
}

