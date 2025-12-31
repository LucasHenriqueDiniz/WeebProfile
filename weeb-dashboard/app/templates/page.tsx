"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Heart, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { templateApi } from "@/lib/api"
import { ApiException } from "@/lib/api/client"

interface Template {
  id: string
  name: string
  description: string
  preview: string
  platforms: string[]
  style: string
  theme: string
  likes?: number
  liked?: boolean
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true)
        const response = await templateApi.list()
        // Transformar dados da API para o formato esperado
        const transformedTemplates = (response.templates || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description || "",
          preview: t.preview || t.storageUrl || "",
          platforms: t.platforms || (t.pluginsConfig ? Object.keys(t.pluginsConfig) : []),
          style: t.style || "default",
          theme: t.theme || "default",
          likes: t.likesCount || t.likes || 0,
          liked: t.userLiked || t.liked || false,
        }))
        setTemplates(transformedTemplates)
      } catch (err) {
        console.error("Error fetching templates:", err)
        setError(
          err instanceof ApiException
            ? err.data.message || err.message
            : "Failed to load templates"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleLike = async (templateId: string) => {
    try {
      const template = templates.find((t) => t.id === templateId)
      if (!template) return

      if (template.liked) {
        await templateApi.unlike(templateId)
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === templateId
              ? {
                  ...t,
                  liked: false,
                  likes: Math.max(0, (t.likes || 0) - 1),
                }
              : t
          )
        )
      } else {
        await templateApi.like(templateId)
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === templateId
              ? {
                  ...t,
                  liked: true,
                  likes: (t.likes || 0) + 1,
                }
              : t
          )
        )
      }
    } catch (err) {
      console.error("Error liking template:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header variant="home" />
      
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Templates Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover beautiful profile templates created by the community. Use them as inspiration or start from scratch.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Templates Grid */}
        {!loading && !error && (
          <>
            {templates.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 transition-all group h-full flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Preview */}
                        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted/30">
                          {template.preview ? (
                            <img
                              src={template.preview}
                              alt={template.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-muted-foreground">No preview</div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="mb-3">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                              {template.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {template.description}
                            </p>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">{template.style}</Badge>
                            {template.theme && (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400">
                                {template.theme}
                              </Badge>
                            )}
                          </div>

                          {/* Platforms */}
                          {template.platforms && template.platforms.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-muted-foreground mb-1">Platforms</p>
                              <div className="flex flex-wrap gap-1">
                                {template.platforms.slice(0, 3).map((platform) => (
                                  <Badge key={platform} variant="secondary" className="text-xs">
                                    {platform}
                                  </Badge>
                                ))}
                                {template.platforms.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{template.platforms.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              asChild
                            >
                              <Link href={`/dashboard/new?template=${template.id}`}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Use Template
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0"
                              onClick={() => handleLike(template.id)}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  template.liked
                                    ? "fill-red-500 text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                            {template.likes !== undefined && template.likes > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {template.likes}
                              </span>
                            )}
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
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                  <Plus className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No templates yet</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Be the first to create and share a template with the community!
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/dashboard/new">
                    <Plus className="w-4 h-4" />
                    Create Your First Template
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-center mt-12 pt-12 border-t border-border"
            >
              <h2 className="text-2xl font-bold mb-2">Create Your Own</h2>
              <p className="text-muted-foreground mb-6">
                Don&apos;t see what you&apos;re looking for? Create a custom profile from scratch.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard/new">
                  <Plus className="w-4 h-4" />
                  Create Custom Profile
                </Link>
              </Button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  )
}

