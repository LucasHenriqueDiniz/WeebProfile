import LoadingScreen from "@/components/loading/LoadingScreen"
import { SvgCardSkeleton } from "@/components/sections/TemplateCardSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { ApiException, svgApi } from "@/lib/api"
import type { Svg } from "@/lib/db/schema"
import { useSvgStore } from "@/stores/svg-store"
import { generateMarkdown } from "@/lib/utils/markdown"
import { motion } from "framer-motion"
import {
  ArrowUpDown,
  Copy,
  Edit2,
  ExternalLink,
  Filter,
  Image as ImageIcon,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { Link, useRouter } from "@/i18n/navigation"
import { useEffect, useMemo, useState, useRef } from "react"
import { useTranslations } from "@/i18n/use-translations"

const styleColors: Record<string, string> = {
  default: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  terminal: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
}

type SortOption = "newest" | "oldest" | "name" | "status"
type FilterStatus = "all" | "completed" | "generating" | "pending"

export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { svgs, svgsLoading, fetchSvgs, removeSvg, updateSvg, _hasHydrated, setHasHydrated } = useSvgStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [svgToDelete, setSvgToDelete] = useState<string | null>(null)

  // Calcular contadores e flags de UI
  const total = svgs.length
  const readyCount = svgs.filter((s) => s.status === "completed").length
  const generatingCount = svgs.filter((s) => s.status === "generating").length

  const showAdvancedControls = total > 6

  // Ref para garantir que só fazemos fetch uma vez por montagem
  const hasFetchedRef = useRef(false)

  // Marcar como reidratado se ainda não foi marcado (fallback)
  useEffect(() => {
    if (typeof window !== "undefined" && !_hasHydrated) {
      // Aguardar um pouco para garantir que o zustand reidratou
      const timer = setTimeout(() => {
        setHasHydrated(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [_hasHydrated, setHasHydrated])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Só fazer fetch quando:
    // 1. Usuário está autenticado
    // 2. Auth terminou de carregar
    // 3. Store já foi reidratado (ou aguardou tempo suficiente)
    // 4. Ainda não fez fetch nesta montagem
    if (user && !authLoading && !hasFetchedRef.current) {
      // Aguardar reidratação se ainda não aconteceu
      if (!_hasHydrated) {
        const timer = setTimeout(() => {
          hasFetchedRef.current = true
          // Mesmo que não tenha reidratado, tentar buscar (store pode estar vazio)
          fetchSvgs()
        }, 200)
        return () => clearTimeout(timer)
      }

      hasFetchedRef.current = true
      // Se já temos SVGs carregados do localStorage, o fetchSvgs vai verificar o cache
      // e só fazer request se necessário (cache expirado ou forçado)
      fetchSvgs() // Sem force - o store verifica cache internamente
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, _hasHydrated])

  const handleDeleteClick = (id: string) => {
    setSvgToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!svgToDelete) return

    try {
      setDeletingId(svgToDelete)
      await svgApi.delete(svgToDelete)
      removeSvg(svgToDelete)
      toast({
        title: t("toast.svgDeleted"),
        description: t("toast.deletedSuccess"),
      })
    } catch (error) {
      console.error("Error deleting SVG:", error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : t("toast.errorDeletingMessage")
      toast({
        title: t("toast.errorDeleting"),
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
      setSvgToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleCopyUrl = async (svg: Svg) => {
    // Usar storageUrl se disponível, caso contrário usar a API route
    const url = svg.storageUrl || `${window.location.origin}/api/svg/${svg.id}`
    const markdown = generateMarkdown({
      name: svg.name,
      url,
      size: (svg.size as "half" | "full") || "half",
      lastGeneratedAt: svg.lastGeneratedAt,
    })
    await navigator.clipboard.writeText(markdown)
    toast({
      title: t("toast.markdownCopied"),
      description: t("toast.markdownCopiedDescription"),
    })
  }

  const handleForceGenerate = async (svg: Svg) => {
    try {
      setGeneratingId(svg.id)
      updateSvg(svg.id, { status: "generating" }) // Atualizar imediatamente para mostrar estado

      const result = await svgApi.generate(svg.id, true) // force = true

      toast({
        title: t("toast.generationStarted"),
        description: t("toast.generationStartedDescription"),
      })

      // A geração é assíncrona, então fazer refresh imediato e depois novamente após delay
      // Isso garante que pegamos o status atualizado quando a geração completar
      fetchSvgs(true) // Refresh imediato para pegar status atualizado

      // Se o resultado já retornou com SVG completo, atualizar store
      if (result.svg && result.svg.status === "completed") {
        updateSvg(svg.id, {
          status: result.svg.status,
          storageUrl: result.svg.storageUrl,
          lastGeneratedAt: result.svg.lastGeneratedAt,
          updatedAt: result.svg.updatedAt || new Date().toISOString(),
        })
        // Forçar re-render da imagem removendo do erro set se estava lá
        setImageErrors((prev) => {
          const next = new Set(prev)
          next.delete(svg.id)
          return next
        })
      }

      // Fazer refresh novamente após delay para garantir dados atualizados quando geração completar
      setTimeout(() => {
        fetchSvgs(true) // force refresh para pegar status final após geração
      }, 5000) // Aumentar delay para dar tempo da geração completar
    } catch (error) {
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : t("toast.errorGeneratingMessage")
      toast({
        title: t("toast.errorGenerating"),
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setGeneratingId(null)
    }
  }

  // Calcular cooldown restante para um SVG
  const getCooldownRemaining = (svg: Svg) => {
    if (!svg.lastGeneratedAt) return null
    const lastGenerated = new Date(svg.lastGeneratedAt)
    const now = new Date()
    const minutesSinceLastGeneration = (now.getTime() - lastGenerated.getTime()) / (1000 * 60)
    const COOLDOWN_MINUTES = 20
    const remaining = COOLDOWN_MINUTES - minutesSinceLastGeneration
    return remaining > 0 ? Math.ceil(remaining) : 0
  }

  // Filtrar e ordenar SVGs
  const filteredAndSortedSvgs = useMemo(() => {
    let filtered = [...svgs]

    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((svg) => svg.status === statusFilter)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case "oldest":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return filtered
  }, [svgs, statusFilter, sortBy])

  // Só mostrar loading completo no primeiro carregamento quando não tiver usuário
  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <div className="w-full space-y-6 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/50"
        >
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline">
                {total} {t("total")}
              </Badge>
              {readyCount > 0 && (
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-0">
                  {t("ready")} • {readyCount}
                </Badge>
              )}
              {generatingCount > 0 && (
                <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-0 gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t("generating")} • {generatingCount}
                </Badge>
              )}
            </div>
          </div>
          <Button asChild size="lg" className="gap-2 shadow-sm">
            <Link href="/dashboard/new">
              <Plus className="w-4 h-4" />
              {t("createNew")}
            </Link>
          </Button>
        </motion.div>

        {/* Filters - apenas quando houver muitos SVGs */}
        {showAdvancedControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative w-full sm:w-[180px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
                <SelectTrigger className="w-full pl-9">
                  <SelectValue placeholder={t("filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatus")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="generating">{t("generating")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:w-[180px]">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full pl-9">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("newestFirst")}</SelectItem>
                  <SelectItem value="oldest">{t("oldestFirst")}</SelectItem>
                  <SelectItem value="name">{t("nameAZ")}</SelectItem>
                  <SelectItem value="status">{t("status")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {/* SVGs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {/* Show loading skeletons if loading and no data */}
          {svgsLoading && svgs.length === 0
            ? Array.from({ length: 3 }).map((_, index) => <SvgCardSkeleton key={`skeleton-${index}`} index={index} />)
            : filteredAndSortedSvgs.length > 0
              ? /* Show actual SVGs */
                filteredAndSortedSvgs.map((svg, index) => (
                  <motion.div
                    key={svg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                  >
                    <Card className="hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 transition-all group h-full flex flex-col border-border/50">
                      <CardContent className="p-5 flex flex-col flex-1">
                        {/* Preview Image */}
                        {svg.storageUrl && svg.status === "completed" && !imageErrors.has(svg.id) ? (
                          <div className="mb-4 rounded-lg overflow-hidden border border-border bg-muted/30 shadow-sm relative group">
                            <img
                              src={`${svg.storageUrl}?v=${svg.lastGeneratedAt ? new Date(svg.lastGeneratedAt).getTime() : svg.updatedAt ? new Date(svg.updatedAt).getTime() : Date.now()}`}
                              alt={svg.name}
                              className="w-full h-auto object-contain transition-opacity"
                              loading="lazy"
                              key={`img-${svg.id}-${svg.lastGeneratedAt ? new Date(svg.lastGeneratedAt).getTime() : svg.updatedAt ? new Date(svg.updatedAt).getTime() : Date.now()}`}
                              onError={(e) => {
                                setImageErrors((prev) => new Set(prev).add(svg.id))
                                e.currentTarget.style.display = "none"
                              }}
                              onLoad={() => {
                                // Remover erro se a imagem carregar com sucesso
                                setImageErrors((prev) => {
                                  const next = new Set(prev)
                                  next.delete(svg.id)
                                  return next
                                })
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                        ) : imageErrors.has(svg.id) || (svg.storageUrl && svg.status === "completed") ? (
                          <div className="mb-4 rounded-lg border border-border bg-gradient-to-br from-purple-500/10 to-pink-500/10 aspect-video flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                            <img
                              src="/sora/sora-head.png"
                              alt="Sora - Error loading image"
                              className="w-16 h-16 object-contain opacity-60 mb-2 relative z-10"
                            />
                            <p className="text-xs text-muted-foreground relative z-10">{t("imageNotAvailable")}</p>
                          </div>
                        ) : (
                          <div className="mb-4 rounded-lg border border-border bg-muted/30 aspect-video flex items-center justify-center shadow-sm">
                            {svg.status === "generating" ? (
                              <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                        )}

                        {/* Info */}
                        <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-1.5 line-clamp-1">
                              {svg.name}
                            </h3>
                            <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded font-mono">
                              /{svg.slug || svg.id.slice(0, 8)}
                            </code>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                svg.status === "completed"
                                  ? "default"
                                  : svg.status === "generating"
                                    ? "secondary"
                                    : svg.status === "failed"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="gap-1"
                            >
                              {svg.status === "generating" && <Loader2 className="w-3 h-3 animate-spin" />}
                              {svg.status === "completed"
                                ? t("status.ready")
                                : svg.status === "failed"
                                  ? t("status.failed")
                                  : svg.status === "generating"
                                    ? t("status.generating")
                                    : t("status.pending")}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${styleColors[svg.style] || styleColors.default} border-0`}
                            >
                              {svg.style}
                            </Badge>
                          </div>

                          {/* Plugins */}
                          {svg.pluginsOrder && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">{t("plugins")}</p>
                              <div className="flex flex-wrap gap-1">
                                {svg.pluginsOrder
                                  .split(",")
                                  .slice(0, 4)
                                  .map((plugin) => (
                                    <Badge key={plugin} variant="outline" className="text-xs">
                                      {plugin}
                                    </Badge>
                                  ))}
                                {svg.pluginsOrder.split(",").length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{svg.pluginsOrder.split(",").length - 4}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Last Updated */}
                          {svg.lastGeneratedAt && (
                            <p className="text-xs text-muted-foreground">
                              {t("updated")} {new Date(svg.lastGeneratedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleCopyUrl(svg)}
                          >
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            {t("copyMarkdown")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => router.push(`/dashboard/${svg.id}`)}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            {t("view")}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/${svg.id}/edit`)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                {t("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleForceGenerate(svg)}
                                disabled={generatingId === svg.id || svg.status === "generating"}
                              >
                                {generatingId === svg.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                )}
                                {t("forceGenerate")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(svg.id)}
                                disabled={deletingId === svg.id}
                                className="text-destructive focus:text-destructive"
                              >
                                {deletingId === svg.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                {t("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : null}

          {/* Show skeletons when loading more data */}
          {svgsLoading && filteredAndSortedSvgs.length > 0 && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <SvgCardSkeleton key={`loading-${index}`} index={filteredAndSortedSvgs.length + index} />
              ))}
            </>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredAndSortedSvgs.length === 0 &&
          !svgsLoading &&
          (svgs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="text-center py-16 md:py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-6 shadow-sm">
                <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{t("noSvgsYet")}</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base">
                {t("noSvgsDescription")}
              </p>
              <Button asChild size="lg" className="gap-2 shadow-sm">
                <Link href="/dashboard/new">
                  <Plus className="w-4 h-4" />
                  {t("createFirst")}
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="text-center py-16 md:py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-6">
                <Filter className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{t("noResultsFound")}</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base">
                {t("noResultsDescription")}
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStatusFilter("all")
                  setSortBy("newest")
                }}
              >
                {t("clearFilter")}
              </Button>
            </motion.div>
          ))}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
              <DialogDescription>{t("deleteDialog.description")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setSvgToDelete(null)
                }}
              >
                {t("deleteDialog.cancel")}
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deletingId !== null}>
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("deleting")}
                  </>
                ) : (
                  t("deleteDialog.confirm")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
