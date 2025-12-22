"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Layout,
  Plug,
  Eye,
  Palette,
  Link as LinkIcon,
  Shield,
  type LucideIcon,
} from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  highlight?: string
}

interface FeaturesSectionProps {
  features: Feature[]
}

const iconMap: Record<string, LucideIcon> = {
  Layout,
  Plug,
  Eye,
  Palette,
  Link: LinkIcon,
  Shield,
}

export function ComparisonSection({ features }: FeaturesSectionProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              What makes it special
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to create the perfect profile card, all in one place.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon]
            if (!Icon) return null

            return (
              <motion.div
                key={feature.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: (i: number) => ({
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      delay: i * 0.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                    },
                  }),
                }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:border-primary/40 border-border/60 bg-card/50 backdrop-blur-sm group cursor-pointer overflow-visible">
                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)",
                    }}
                  />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="space-y-4">
                      {/* Icon */}
                      <motion.div
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-primary/30" />
                        <Icon className="w-7 h-7 text-primary relative z-10" />
                      </motion.div>

                      {/* Content */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          {feature.highlight && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                              {feature.highlight}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
















