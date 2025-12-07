"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Link,
  Palette,
  Code,
  LucideIcon,
  CheckCircle2,
} from "lucide-react"

interface HowItWorksItem {
  step: number
  title: string
  description: string
  icon: string
  codeExample?: string
}

interface HowItWorksSectionProps {
  items: HowItWorksItem[]
}

const iconMap: Record<string, LucideIcon> = {
  Link,
  Palette,
  Code,
}

export function HowItWorksSection({ items }: HowItWorksSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          How it works
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
            Three simple steps to your perfect profile card
          </p>
          <p className="text-lg text-muted-foreground">
            Connect your accounts, customize everything, and embed anywhere. It's that simple.
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon]
          if (!Icon) return null

          return (
            <motion.div
              key={item.step}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: (i: number) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: i * 0.15, duration: 0.5 },
                }),
              }}
            >
              <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-card/50 backdrop-blur-sm group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 relative">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden"
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-primary/30" />
                        <Icon className="w-6 h-6 text-primary relative z-10" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                          STEP {item.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      {item.codeExample && (
                        <div className="mt-4 p-3 rounded-lg bg-muted/50 font-mono text-xs text-left overflow-x-auto border border-border/50">
                          <code className="text-foreground/80">{item.codeExample}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">
            No configuration files. No complex setup. Just click and create.
          </span>
        </div>
      </motion.div>
    </section>
  )
}
