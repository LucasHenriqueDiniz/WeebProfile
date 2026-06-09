"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useTranslations } from '@/i18n/use-translations'
import { Link } from "@/i18n/navigation"
import { TemplateCard } from "@/components/templates/TemplateCard"
import type { Template } from "@/types/template"

interface TemplatesGalleryProps {
  templates: Template[]
  loading?: boolean
}

export function TemplatesGallery({
  templates,
  loading = false
}: TemplatesGalleryProps) {
  const t = useTranslations('homepage.templatesGallery')
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          {t('title')}
        </h2>
        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
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

              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center space-y-6 z-10">
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 mx-auto shadow-lg shadow-purple-500/25"
                      whileHover={{ scale: 1.15, rotate: 360 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-10 h-10 text-white drop-shadow-sm" />
                    </motion.div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        {t('exploreCount', { count: templates.length + 10 })}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                        {t('exploreSubtitle')}
                      </p>
                      <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                        <span>{t('viewAll')}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Regular template cards */}
        {loading ? (
          // Show loading skeletons
          Array.from({ length: 3 }, (_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              custom={index + 1}
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
              className="h-80 bg-muted/30 rounded-lg animate-pulse"
            />
          ))
        ) : (
          templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              variant="hero"
              index={index + 1}
            />
          ))
        )}
      </motion.div>
    </section>
  )
}
