"use client"

import { LoadingAnimation } from "@/components/loading/LoadingAnimation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { templateApi } from "@/lib/api"
import { useLocaleNavigation } from '@/lib/navigation'
import { ensureConsistentPlatforms } from "@/lib/templates-utils"
import { motion } from "framer-motion"
import { Filter, Search } from "lucide-react"
import { defaultThemes, terminalThemes } from "@weeb/weeb-plugins/themes"
import { useTranslations } from 'next-intl'
import { useEffect, useState, useMemo } from "react"
import { Link } from "@/i18n/navigation"
import { TemplateCard } from "@/components/templates/TemplateCard"
import type { Template } from "@/types/template"


export function TemplatesPageClient() {
  const t = useTranslations('templatesPage')
  const { toLocalePath } = useLocaleNavigation()
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [styleFilter, setStyleFilter] = useState("all")
  const [themeFilter, setThemeFilter] = useState("all")
  const [sortByValue, setSortByValue] = useState("newest")

  // Get all available themes from weeb-plugins
  const availableThemes = useMemo(() => {
    const themes = ['all']
    
    // Add default themes
    Object.keys(defaultThemes).forEach(theme => {
      // Convert theme names to more display-friendly format
      if (theme === 'default') {
        themes.push('default')
      } else if (theme.startsWith('default')) {
        // Extract color name from themes like 'defaultPurple', 'defaultPink', etc.
        const colorName = theme.replace('default', '').toLowerCase()
        themes.push(colorName)
      } else {
        themes.push(theme)
      }
    })
    
    // Add terminal themes
    Object.keys(terminalThemes).forEach(theme => {
      if (!themes.includes(theme)) {
        themes.push(theme)
      }
    })
    
    return themes
  }, [])


  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true)
        // Try to fetch authenticated templates first, fallback to public templates
        let response
        try {
          response = await templateApi.list()
        } catch (authError) {
          // If authentication fails, try fetching public templates
          console.log("Authentication failed, fetching public templates...")
          response = await fetch('/api/templates?public=true')
          if (!response.ok) {
            throw new Error('Failed to fetch public templates')
          }
          response = await response.json()
        }

        // Transformar dados da API para o formato esperado
        const transformedTemplates = (response.templates || []).map((t: any) => {
          const platforms = ensureConsistentPlatforms(t)
          return {
            id: t.id,
            name: t.name,
            description: t.description || "",
            preview: t.svgId ? `/svgs/${t.svgId}` : undefined,
            platforms,
            style: t.style || "default",
            theme: t.theme || "default",
            size: t.size || "half",
            likes: t.likesCount || t.likes || 0,
            liked: t.userLiked || t.liked || false,
            pluginsConfig: t.pluginsConfig,
            pluginsOrder: t.pluginsOrder,
          }
        })
        setTemplates(transformedTemplates)
      } catch (err) {
        console.error("Error fetching templates:", err)
        setError("Failed to load templates")
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...templates]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.platforms.some((platform: string) =>
          platform.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Style filter
    if (styleFilter !== "all") {
      filtered = filtered.filter(template => template.style === styleFilter)
    }

    // Theme filter
    if (themeFilter !== "all") {
      filtered = filtered.filter(template => template.theme === themeFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortByValue) {
        case "newest":
          return new Date(b.id).getTime() - new Date(a.id).getTime()
        case "oldest":
          return new Date(a.id).getTime() - new Date(b.id).getTime()
        case "mostLiked":
          return (b.likes || 0) - (a.likes || 0)
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }, [templates, searchTerm, styleFilter, themeFilter, sortByValue])

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4"
        >
          {t('title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('filters.style.label')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">{t('filters.style.all')}</SelectItem>
                <SelectItem value="default">{t('filters.style.default')}</SelectItem>
                <SelectItem value="terminal">{t('filters.style.terminal')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={themeFilter} onValueChange={setThemeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('filters.theme.label')} />
              </SelectTrigger>
              <SelectContent>
                {availableThemes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme === 'all' 
                      ? t('filters.theme.all')
                      : theme === 'default'
                      ? t('filters.theme.default')
                      : theme.charAt(0).toUpperCase() + theme.slice(1)
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortByValue} onValueChange={setSortByValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('sort.label')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="newest">{t('sort.newest')}</SelectItem>
                <SelectItem value="oldest">{t('sort.oldest')}</SelectItem>
                <SelectItem value="mostLiked">{t('sort.mostLiked')}</SelectItem>
                <SelectItem value="name">{t('sort.name')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoadingAnimation />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-2">{t('noTemplatesFound')}</h3>
              <p className="text-muted-foreground mb-6">{t('noTemplatesFoundDescription')}</p>
              <Button asChild>
                <Link href={toLocalePath('/dashboard/new')}>{t('createYourOwn')}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  variant="grid"
                  showLike={true}
                  onLike={handleLike}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

