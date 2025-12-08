"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import Link from "next/link"
import { getPluginIcon } from "@/lib/plugins-data"
import type { ComponentType } from "react"

interface Platform {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

interface PlatformsSectionProps {
  platforms: Platform[]
}

interface PlatformCardProps {
  name: string
  icon: ComponentType<{ className?: string; style?: { color: string } }> | null
  description: string
  color: string
}

function PlatformCard({
  name,
  icon: Icon,
  description,
  color,
}: PlatformCardProps) {
  if (!Icon) {
    return null
  }

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="group"
      style={{ willChange: "transform" }}
    >
      <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 border-border/60 hover:border-primary/40 bg-card/50 backdrop-blur-sm relative">
        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)`,
          }}
        />
        
        <CardContent className="p-6 flex flex-col items-center text-center gap-4 relative z-10">
          {/* Icon container with gradient background */}
          <motion.div
            className="p-4 rounded-xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
              boxShadow: `0 4px 12px ${color}20`,
            }}
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{
                background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
              }}
            />
            <Icon
              className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:scale-110"
              style={{ color }}
            />
          </motion.div>
          
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function PlatformsSection({ platforms }: PlatformsSectionProps) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary w-fit mx-auto mb-4 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>{platforms.length} plugins available</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Connect the platforms that define you
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We use a plugin system: you pick which sources to show, which sections
          to include, and we generate the perfect SVG layout.
        </p>
      </motion.div>

      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            duration: 30,
          }}
          className="w-full"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.reset()}
        >
          <CarouselContent className="-ml-2 md:-ml-4 py-4">
            {platforms.map((platform, index) => {
              // Use getPluginIcon to get the correct react-icons component
              const Icon = getPluginIcon(platform.id)
              if (!Icon) {
                console.warn(`Icon not found for plugin "${platform.id}"`)
                return null
              }

              return (
                <CarouselItem
                  key={`${platform.id}-${index}`}
                  className="pl-2 md:pl-4 basis-auto md:basis-[200px] lg:basis-[200px]"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="w-[200px]"
                  >
                    <PlatformCard
                      name={platform.name}
                      icon={Icon}
                      description={platform.description}
                      color={platform.color}
                    />
                  </motion.div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-muted-foreground">
          Não achou um plugin?{" "}
          <Link
            href="https://github.com/WeebProfile/WeebProfile/blob/main/weeb-plugins/docs/CREATING_PLUGINS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 underline-offset-4 hover:underline inline-flex items-center gap-1"
          >
            Crie um!
            <span className="text-xs">↗</span>
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
