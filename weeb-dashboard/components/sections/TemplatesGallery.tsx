"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
}

interface TemplateCardProps {
  name: string
  description: string
  preview: string
  platforms: string[]
  index: number
}

function TemplateCard({
  name,
  description,
  preview,
  platforms,
  index,
}: TemplateCardProps) {
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
    >
      <motion.div whileHover={{ scale: 1.05, y: -8 }} transition={{ duration: 0.3 }}>
        <Card className="h-full cursor-pointer overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
            <img
              src={preview}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <Badge key={platform} variant="secondary">
                  {platform}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export function TemplatesGallery({ templates }: TemplatesGalleryProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Templates that feel like your vibe
        </h2>
        <p className="text-lg text-muted-foreground">
          Layouts for devs, gamers, readers and weebs
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
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            name={template.name}
            description={template.description}
            preview={template.preview}
            platforms={template.platforms}
            index={index}
          />
        ))}
      </motion.div>
    </section>
  )
}















