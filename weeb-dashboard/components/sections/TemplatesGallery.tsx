"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { useMemo, useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

interface Template {
  id: string
  name: string
  description: string
  preview: string
  platforms: string[]
  style: string
  theme: string
}

interface TemplatesGalleryProps {
  templates: Template[]
  title?: string
  subtitle?: string
  totalTemplatesCount?: number
}

interface TemplateCardProps {
  name: string
  description: string
  preview: string
  platforms: string[]
  style: string
  theme: string
  index: number
}

// Mapear platforms para plugin IDs
const platformToPlugin: Record<string, string> = {
  "GitHub": "github",
  "Steam": "steam",
  "LastFM": "lastfm",
  "MyAnimeList": "myanimelist",
  "Goodreads": "goodreads",
}

function TemplateCard({
  name,
  description,
  preview,
  platforms,
  style,
  theme,
  index,
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const hasImage = preview && preview !== "/placeholder.svg"
  
  // Preparar plugins config para PreviewRenderer
  const pluginsConfig = useMemo(() => {
    const plugins: Record<string, any> = {}
    const pluginsOrder: string[] = []
    
    platforms.forEach((platform) => {
      const pluginId = platformToPlugin[platform]
      if (pluginId) {
        plugins[pluginId] = {
          enabled: true,
          sections: ["profile", "activity"], // Default sections
        }
        pluginsOrder.push(pluginId)
      }
    })
    
    return { plugins, pluginsOrder }
  }, [platforms])

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { delay: i * 0.15 },
        }),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full cursor-pointer hover:shadow-2xl transition-all group border-border/60 hover:border-primary/40 bg-card/50 backdrop-blur-sm">
        <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
          {hasImage ? (
            <>
              <img
                src={preview}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Preview overlay on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 z-10"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <PreviewRenderer
                        plugins={pluginsConfig.plugins}
                        pluginsOrder={pluginsConfig.pluginsOrder}
                        style={style as "default" | "terminal"}
                        size="half"
                        theme={theme}
                        width={400}
                        height={300}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <PreviewRenderer
                plugins={pluginsConfig.plugins}
                pluginsOrder={pluginsConfig.pluginsOrder}
                style={style as "default" | "terminal"}
                size="half"
                theme={theme}
                width={400}
                height={225}
              />
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">{name}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <Badge key={platform} variant="secondary" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TemplatesGallery({ templates, title, subtitle, totalTemplatesCount }: TemplatesGalleryProps) {
  const displayTitle = title || "Feeling lazy?"
  const displaySubtitle = subtitle || "Pick a template and customize it to match your vibe"
  const templateCount = totalTemplatesCount || templates.length

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          {displayTitle}
        </h2>
        <p className="text-lg text-muted-foreground">
          {displaySubtitle}
        </p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Special card: View all templates */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.9, y: 20 },
            visible: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { delay: 0 },
            },
          }}
        >
          <Link href="/templates">
            <Card className="h-full cursor-pointer hover:shadow-2xl transition-all group border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm relative overflow-hidden">
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                }}
              />
              
              <div className="relative aspect-video flex items-center justify-center p-8">
                <div className="text-center space-y-4 z-10">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 mx-auto"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                      Explore {templateCount}+ Templates
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Browse our full collection of pre-made templates
                    </p>
                    <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      <span>View all</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Regular template cards */}
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            name={template.name}
            description={template.description}
            preview={template.preview}
            platforms={template.platforms}
            style={template.style}
            theme={template.theme}
            index={index + 1}
          />
        ))}
      </motion.div>
    </section>
  )
}
