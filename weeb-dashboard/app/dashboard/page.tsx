"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Plus, Edit2, Trash2, Copy, Loader2, ExternalLink, Zap, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Svg } from "@/lib/db/schema"
import { svgApi, ApiException } from "@/lib/api"
import { useSvgStore } from "@/stores/svg-store"

const styleColors: Record<string, string> = {
  default: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  terminal: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { svgs, svgsLoading, fetchSvgs, removeSvg, updateSvg } = useSvgStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

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
            {svgs.length} SVG
            {svgs.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/dashboard/new">
            <Plus className="w-5 h-5" />
            Create New
          </Link>
        </Button>
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
      {svgs.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="space-y-4"
        >
          {svgs.map((svg, index) => (
            <motion.div
              key={svg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="hover:shadow-lg hover:border-primary/50 transition-all group">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    {/* Info */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {svg.name}
                      </h3>
                      <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded block w-fit">
                        /{svg.slug || svg.id.slice(0, 8)}
                      </code>
                    </div>

                    {/* Details */}
                    <div className="hidden md:grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Style</p>
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                            styleColors[svg.style] || styleColors.default
                          }`}
                        >
                          {svg.style}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="text-sm font-medium">
                          {svg.size === "half" ? "415px" : "830px"}
                        </p>
                      </div>
                    </div>

                    {/* Plugins */}
                    <div className="hidden lg:block space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Plugins
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {svg.pluginsOrder?.split(",").slice(0, 3).map((plugin) => (
                          <span
                            key={plugin}
                            className="text-xs px-2 py-1 rounded-full bg-muted/50 capitalize"
                          >
                            {plugin}
                          </span>
                        ))}
                        {svg.pluginsOrder && svg.pluginsOrder.split(",").length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted/50">
                            +{svg.pluginsOrder.split(",").length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        {svg.status === "completed" ? "Ready" : svg.status}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                          title="Forçar Geração"
                          onClick={() => handleForceGenerate(svg)}
                          disabled={generatingId === svg.id || svg.status === "generating"}
                        >
                          {generatingId === svg.id ? (
                            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4 text-muted-foreground" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Copy URL"
                          onClick={() => handleCopyUrl(svg)}
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View"
                          onClick={() => router.push(`/dashboard/${svg.id}`)}
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit"
                          onClick={() => router.push(`/dashboard/${svg.id}/edit`)}
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                          onClick={() => handleDelete(svg.id)}
                          disabled={deletingId === svg.id}
                        >
                          {deletingId === svg.id ? (
                            <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No SVGs yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first WeebProfile SVG to get started
          </p>
          <Button asChild className="gap-2">
            <Link href="/dashboard/new">
              <Plus className="w-4 h-4" />
              Create Your First SVG
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}
