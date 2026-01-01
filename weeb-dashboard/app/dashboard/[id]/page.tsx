"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, CheckCircle2, ExternalLink, Edit, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { svgApi, ApiException } from "@/lib/api"
import { useSvgStore } from "@/stores/svg-store"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { SvgViewSkeleton } from "@/components/sections/TemplateCardSkeleton"

export default function SvgViewPage() {
  const params = useParams()
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
    if (!url) return

    const markdown = `![${svg?.name || "Profile"}](${url})`
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      toast({
        title: "Copiado!",
        description: "Código markdown copiado para a área de transferência",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código",
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
        title: "Copiado!",
        description: "URL copiada para a área de transferência",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a URL",
        variant: "destructive",
      })
    }
  }

  const handleForceGenerate = async () => {
    if (!svg) return

    try {
      setGenerating(true)
      await svgApi.generate(svgId, true) // force = true
      
      toast({
        title: "Gerando...",
        description: "A imagem está sendo gerada novamente",
      })
      
      // Atualizar status imediatamente - o useEffect vai fazer polling automaticamente
      updateSvg(svgId, { status: "generating" })
      setSvg({ ...svg, status: "generating" })
      
      // Recarregar do servidor após um delay para pegar dados atualizados
      // O useEffect já vai fazer polling, mas vamos forçar um refresh inicial
      setTimeout(async () => {
        const updatedSvg = await getSvg(svgId, true) // force refresh
        if (updatedSvg) {
          setSvg(updatedSvg)
        }
      }, 2000)
      
    } catch (error) {
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : "Não foi possível iniciar a geração"
      toast({
        title: "Erro",
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
            <CardTitle>Imagem não encontrada</CardTitle>
            <CardDescription>Esta imagem não existe ou você não tem permissão para visualizá-la</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Adicionar timestamp para forçar reload da imagem (cache busting)
  const baseImageUrl = svg?.storageUrl || urlFromQuery
  const imageUrl = baseImageUrl 
    ? `${baseImageUrl}${baseImageUrl.includes('?') ? '&' : '?'}t=${svg?.lastGeneratedAt ? new Date(svg.lastGeneratedAt).getTime() : Date.now()}`
    : null
  const markdownCode = `![${svg?.name || "Profile"}](${baseImageUrl || imageUrl})`

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Status Badge e Botão de Forçar Geração */}
        {svg && (
          <div className="flex items-center justify-between gap-4">
            <Badge
              variant={
                svg.status === "completed"
                  ? "default"
                  : svg.status === "generating"
                  ? "secondary"
                  : "destructive"
              }
            >
              {svg.status === "completed"
                ? "Concluída"
                : svg.status === "generating"
                ? "Gerando..."
                : "Erro"}
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
                  Gerando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Forçar Geração
                </>
              )}
            </Button>
          </div>
        )}

        {/* Cooldown Warning */}
        {svg && cooldownRemaining !== null && cooldownRemaining > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-700 dark:text-yellow-400">
            ⏱️ Cooldown ativo: aguarde {cooldownRemaining} minuto(s) antes de gerar novamente. Use "Forçar Geração" para ignorar.
          </div>
        )}

        {/* Layout Desktop: PREVIEW | DADOS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* PREVIEW Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview da Imagem</CardTitle>
                <CardDescription>Use o código markdown abaixo no seu README do GitHub</CardDescription>
              </CardHeader>
              <CardContent>
                {imageUrl ? (
                  <div className="border rounded-lg p-4 bg-muted/50 flex items-center justify-center">
                    <img
                      key={`${svg?.id}-${svg?.lastGeneratedAt || Date.now()}`} // Force re-render quando lastGeneratedAt mudar
                      src={imageUrl}
                      alt={svg?.name || "Profile SVG"}
                      className="max-w-full h-auto"
                      style={{ maxHeight: "400px" }}
                      onError={(e) => {
                        // Se a imagem não carregar, mostrar mensagem
                        const target = e.currentTarget
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center p-8">
                              <p class="text-muted-foreground mb-2">Erro ao carregar imagem</p>
                              <p class="text-sm text-muted-foreground">A imagem pode estar sendo gerada ainda. Aguarde alguns segundos.</p>
                            </div>
                          `
                        }
                      }}
                    />
                  </div>
                ) : svg?.status === "failed" ? (
                  <div className="border rounded-lg p-12 bg-destructive/10 flex flex-col items-center justify-center">
                    <p className="text-destructive font-medium mb-2">Erro ao gerar imagem</p>
                    {svg.lastError && (
                      <div className="text-sm text-destructive/80 mb-4 p-3 bg-destructive/5 rounded border border-destructive/20 max-w-md">
                        <p className="font-medium mb-1">Detalhes do erro:</p>
                        <p className="text-xs break-words">{svg.lastError}</p>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Houve um problema ao gerar sua imagem SVG. Tente gerar novamente.
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
                            title: "Gerando...",
                            description: "A imagem está sendo gerada novamente",
                          })
          // Recarregar após um delay com force para pegar dados atualizados
          setTimeout(() => {
            loadSvg(true) // force refresh
          }, 2000)
                        } catch (error) {
                          const errorMessage =
                            error instanceof ApiException
                              ? error.data.message || error.data.error || error.message
                              : "Não foi possível iniciar a geração"
                          toast({
                            title: "Erro",
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
                          Gerando...
                        </>
                      ) : (
                        "Tentar Novamente"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-12 bg-muted/50 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      {svg?.status === "generating" ? "Gerando imagem..." : "Aguardando geração..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Isso pode levar alguns segundos. A página será atualizada automaticamente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* DADOS Column */}
          <div className="space-y-6">
            {/* Markdown Code */}
            <Card>
              <CardHeader>
                <CardTitle>Código Markdown</CardTitle>
                <CardDescription>Copie e cole no seu README.md do GitHub</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Markdown</label>
                  <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-4 bg-muted rounded-md font-mono text-sm overflow-x-auto">
                  {markdownCode}
                </pre>
              </CardContent>
            </Card>

            {/* URL */}
            {imageUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>URL da Imagem</CardTitle>
                  <CardDescription>Link direto para a imagem SVG</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyUrl} className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar URL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(imageUrl, "_blank")}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <code className="text-sm break-all">{imageUrl}</code>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info */}
        {svg && (
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Estilo</div>
                  <div className="font-medium capitalize">{svg.style}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tamanho</div>
                  <div className="font-medium capitalize">{svg.size}</div>
                </div>
                {svg.lastGeneratedAt && (
                  <div>
                    <div className="text-muted-foreground">Última geração</div>
                    <div className="font-medium">
                      {new Date(svg.lastGeneratedAt).toLocaleString("pt-BR")}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground">Criado em</div>
                  <div className="font-medium">
                    {new Date(svg.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
    </div>
  )
}

