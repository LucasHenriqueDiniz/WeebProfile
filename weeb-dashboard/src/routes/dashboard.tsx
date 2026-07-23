import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState"
import { SvgLibraryRow } from "@/components/dashboard/SvgLibraryRow"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { SvgCardSkeleton } from "@/components/sections/TemplateCardSkeleton"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { ApiException, svgApi } from "@/lib/api"
import type { Svg } from "@/lib/db/schema"
import { useSvgStore } from "@/stores/svg-store"
import { generateMarkdown } from "@/lib/utils/markdown"
import { motion } from "framer-motion"
import { ArrowUpDown, Filter, Loader2, Plus } from "lucide-react"
import { Link, useRouter } from "@/i18n/navigation"
import { useEffect, useMemo, useState, useRef } from "react"
import { useTranslations } from "@/i18n/use-translations"

const styleColors: Record<string, string> = {
  default: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  terminal: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
}

// DEV-ONLY mock data for the ?mock=full preview state. Never imported in production
// (the whole call site is gated behind import.meta.env.DEV, which Vite strips).
// TEMP: remove once the redesign is approved.
const MOCK_SVGS = [
  {
    id: "mock-1",
    slug: "github-stats",
    name: "GitHub Stats",
    style: "default",
    size: "half",
    status: "completed",
    storageUrl: "/sora/sora-head.png",
    pluginsOrder: "github,anime,music",
    lastGeneratedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "mock-2",
    slug: "terminal-card",
    name: "Terminal Card",
    style: "terminal",
    size: "full",
    status: "generating",
    storageUrl: null,
    pluginsOrder: "github,steam",
    lastGeneratedAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "mock-3",
    slug: "anime-list",
    name: "Anime List",
    style: "default",
    size: "half",
    status: "completed",
    storageUrl: null,
    pluginsOrder: "myanimelist,anilist",
    lastGeneratedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "mock-4",
    slug: "pending-card",
    name: "Novo card",
    style: "default",
    size: "half",
    status: "pending",
    storageUrl: null,
    pluginsOrder: "github",
    lastGeneratedAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "mock-5",
    slug: "music-taste",
    name: "Music Taste",
    style: "default",
    size: "half",
    status: "completed",
    storageUrl: null,
    pluginsOrder: "lastfm,spotify,youtube-music",
    lastGeneratedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
]

type SortOption = "newest" | "oldest" | "name" | "status"
type FilterStatus = "all" | "completed" | "generating" | "pending"

export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { svgs: storeSvgs, svgsLoading: storeSvgsLoading, fetchSvgs, removeSvg, updateSvg } = useSvgStore()
  // DEV-ONLY: ?mock=empty / ?mock=full override the list for design review without ever
  // touching the persisted svg-store (which used to leak MOCK_SVGS into localStorage
  // forever - see mockOverride effect below).
  const [mockOverride, setMockOverride] = useState<Svg[] | null>(null)
  const svgs = mockOverride ?? storeSvgs
  const svgsLoading = mockOverride ? false : storeSvgsLoading
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
  const isTrulyEmpty = !svgsLoading && svgs.length === 0

  // Ref para garantir que só fazemos fetch uma vez por montagem
  const hasFetchedRef = useRef(false)

  // DEV-ONLY preview bypass: ?mock=empty or ?mock=full seeds the store with fake data
  // instead of fetching. import.meta.env.DEV is statically replaced by Vite, so this
  // branch is dead-code-eliminated from the production bundle.
  // TEMP: remove once the redesign is approved.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const mockFlag = new URLSearchParams(window.location.search).get("mock")
    if (mockFlag === "empty") {
      hasFetchedRef.current = true
      setMockOverride([])
    } else if (mockFlag === "full") {
      hasFetchedRef.current = true
      setMockOverride(MOCK_SVGS as unknown as Svg[])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // SELF-HEAL: an earlier version of the ?mock=full bypass wrote straight into the
  // persisted svg-store, so anyone who ever loaded that URL got fake "mock-*" SVGs
  // stuck in their dashboard forever (even with no dev server / mock flag). Strip them
  // out of the real store once on mount.
  useEffect(() => {
    const hasLeakedMocks = storeSvgs.some((svg) => svg.id.startsWith("mock-"))
    if (hasLeakedMocks) {
      useSvgStore.setState({ svgs: storeSvgs.filter((svg) => !svg.id.startsWith("mock-")) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // PERF: zustand's persist middleware rehydrates localStorage synchronously at module
  // eval time in this SPA (no SSR to reconcile against), so the previous code that waited
  // 100ms then another 200ms for "_hasHydrated" before calling fetchSvgs() was pure added
  // latency solving a hydration-mismatch problem that only exists with SSR. Removed - fetch
  // now fires the instant auth resolves.
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && !authLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchSvgs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

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

  const headerActions = !isTrulyEmpty ? (
    <Button
      asChild
      size="sm"
      className="gap-1.5 bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90 shadow-[0_0_16px_rgba(56,189,248,0.2)]"
    >
      <Link href="/dashboard/new">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{t("createNew")}</span>
      </Link>
    </Button>
  ) : undefined

  return (
    <DashboardLayout
      title={t("title")}
      description={
        !isTrulyEmpty
          ? `${total} ${t("total")}${readyCount > 0 ? ` · ${readyCount} ${t("ready")}` : ""}${generatingCount > 0 ? ` · ${generatingCount} ${t("generating")}` : ""}`
          : undefined
      }
      actions={headerActions}
    >
      <div className="w-full space-y-5">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Filters - apenas quando houver muitos SVGs */}
          {showAdvancedControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 mb-5"
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

          {/* Biblioteca de SVGs - lista de linhas (asset library), nao uma grade de cards
              identicos. O onboarding cuida sozinho do estado verdadeiramente vazio, abaixo. */}
          {!isTrulyEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden"
            >
              {svgsLoading && svgs.length === 0
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="p-3">
                      <SvgCardSkeleton index={index} />
                    </div>
                  ))
                : filteredAndSortedSvgs.length > 0
                  ? filteredAndSortedSvgs.map((svg, index) => (
                      <SvgLibraryRow
                        key={svg.id}
                        svg={svg}
                        index={index}
                        imageErrored={imageErrors.has(svg.id)}
                        onImageError={() => setImageErrors((prev) => new Set(prev).add(svg.id))}
                        onImageLoad={() =>
                          setImageErrors((prev) => {
                            const next = new Set(prev)
                            next.delete(svg.id)
                            return next
                          })
                        }
                        onCopyUrl={() => handleCopyUrl(svg)}
                        onView={() => router.push(`/dashboard/${svg.id}`)}
                        onEdit={() => router.push(`/dashboard/${svg.id}/edit`)}
                        onForceGenerate={() => handleForceGenerate(svg)}
                        onDelete={() => handleDeleteClick(svg.id)}
                        isGenerating={generatingId === svg.id}
                        isDeleting={deletingId === svg.id}
                        t={t}
                      />
                    ))
                  : null}

              {svgsLoading &&
                filteredAndSortedSvgs.length > 0 &&
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={`loading-${index}`} className="p-3">
                    <SvgCardSkeleton index={filteredAndSortedSvgs.length + index} />
                  </div>
                ))}
            </motion.div>
          )}

          {/* Onboarding real - substitui o antigo "ícone pequeno num canvas enorme" */}
          {isTrulyEmpty && <DashboardEmptyState />}

          {/* Empty State (filtro sem resultados - diferente do onboarding acima, só
              acontece quando já existem SVGs mas o filtro ativo não bate com nenhum) */}
          {!isTrulyEmpty && filteredAndSortedSvgs.length === 0 && !svgsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="text-center py-16 md:py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-violet-500/10 to-cyan-500/10 mb-6">
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
          )}

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
    </DashboardLayout>
  )
}
