"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Plus, Edit2, Trash2, Copy, Loader2, ExternalLink, Zap, RefreshCw, Search, Filter, ArrowUpDown, Image as ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import type { Svg } from "@/lib/db/schema"
import { svgApi, ApiException } from "@/lib/api"
import { useSvgStore } from "@/stores/svg-store"

const styleColors: Record<string, string> = {
  default: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  terminal: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
}

type SortOption = "newest" | "oldest" | "name" | "status"
type FilterStatus = "all" | "completed" | "generating" | "pending"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { svgs, svgsLoading, fetchSvgs, removeSvg, updateSvg } = useSvgStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Buscar SVGs se o usuário estiver disponível
    // O store já gerencia cache, então não precisa verificar se já tem dados
    if (user) {
      fetchSvgs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta imagem?")) {
      return
    }

    try {
      setDeletingId(id)
      await svgApi.delete(id)
      // Remover do store
      removeSvg(id)
    } catch (error) {
      console.error("Error deleting SVG:", error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : "Erro ao deletar imagem"
      alert(errorMessage)
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopyUrl = async (svg: Svg) => {
    const url = `${window.location.origin}/api/svg/${svg.id}`
    const markdown = `![${svg.name}](${url})`
    await navigator.clipboard.writeText(markdown)
    alert("Markdown copiado para a área de transferência!\n\nCole no seu README.md do GitHub.")
  }

  const handleForceGenerate = async (svg: Svg) => {
    try {
      setGeneratingId(svg.id)
      await svgApi.generate(svg.id, true) // force = true
      // Atualizar status no store
      updateSvg(svg.id, { status: "generating" })
      // Recarregar após um delay para pegar o status atualizado
      setTimeout(() => {
        fetchSvgs(true) // force refresh
      }, 2000)
    } catch (error) {
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : "Não foi possível iniciar a geração"
      alert(errorMessage)
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

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (svg) =>
          svg.name.toLowerCase().includes(query) ||
          svg.slug?.toLowerCase().includes(query) ||
          svg.id.toLowerCase().includes(query)
      )
    }

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
  }, [svgs, searchQuery, statusFilter, sortBy])


  // Só mostrar loading se não tiver dados e estiver carregando
  if (authLoading || (svgsLoading && svgs.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-4xl text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }


  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">My SVGs</h1>
          <p className="text-muted-foreground mt-2">
            {filteredAndSortedSvgs.length} of {svgs.length} SVG
            {svgs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/dashboard/new">
            <Plus className="w-5 h-5" />
            Create New
          </Link>
        </Button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, slug, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative w-full sm:w-[180px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
            <SelectTrigger className="w-full pl-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full sm:w-[180px]">
          <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full pl-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total SVGs</p>
              <p className="text-3xl font-bold">{svgs.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-3xl font-bold">
                {svgs.filter(s => s.status === "completed").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Generating</p>
              <p className="text-3xl font-bold">
                {svgs.filter(s => s.status === "generating").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SVGs List */}
      {filteredAndSortedSvgs.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedSvgs.map((svg, index) => (
            <motion.div
              key={svg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="hover:shadow-lg hover:border-primary/50 transition-all group h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  {/* Preview Image */}
                  {svg.storageUrl && svg.status === "completed" ? (
                    <div className="mb-4 rounded-lg overflow-hidden border border-border bg-muted/50">
                      <img
                        src={svg.storageUrl}
                        alt={svg.name}
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="mb-4 rounded-lg border border-border bg-muted/50 aspect-video flex items-center justify-center">
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
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-1">
                        {svg.name}
                      </h3>
                      <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
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
                            : "outline"
                        }
                        className="gap-1"
                      >
                        {svg.status === "generating" && <Loader2 className="w-3 h-3 animate-spin" />}
                        {svg.status === "completed" ? "Ready" : svg.status}
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
                        <p className="text-xs text-muted-foreground">Plugins</p>
                        <div className="flex flex-wrap gap-1">
                          {svg.pluginsOrder.split(",").slice(0, 4).map((plugin) => (
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
                        Updated {new Date(svg.lastGeneratedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/${svg.id}`)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(svg)}
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/${svg.id}/edit`)}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleForceGenerate(svg)}
                      disabled={generatingId === svg.id || svg.status === "generating"}
                      title="Force Generate"
                    >
                      {generatingId === svg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(svg.id)}
                      disabled={deletingId === svg.id}
                      className="text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      {deletingId === svg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : svgs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
            <ImageIcon className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No SVGs yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
            Create your first WeebProfile SVG to showcase your stats on GitHub
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard/new">
              <Plus className="w-5 h-5" />
              Create Your First SVG
            </Link>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  )
}
