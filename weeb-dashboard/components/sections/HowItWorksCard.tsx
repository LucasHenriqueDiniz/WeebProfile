"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Plug, Palette, Code, Link as LinkIcon, Grid3x3, Wand2, Copy, LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface HowItWorksItem {
  step: number
  title: string
  description: string
  icon: string
  bullets: string[]
  badge: string
  cta: {
    text: string
    href?: string
    action?: "modal" | "scroll" | "navigate"
  }
  screenshot?: string
}

interface HowItWorksCardProps {
  item: HowItWorksItem
  onCtaClick: () => void
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Link: LinkIcon,
  Plug,
  Grid3x3,
  Palette,
  Wand2,
  Code,
  Copy,
}

export function HowItWorksCard({ item, onCtaClick }: HowItWorksCardProps) {
  const Icon = iconMap[item.icon] || LinkIcon

  return (
    <Card className="group relative h-full overflow-visible border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl">
      {/* gradient overlay on hover, matching ComparisonSection cards */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)",
        }}
      />

      <CardContent className="relative z-10 flex h-full flex-col gap-4 p-6">
        {/* topo: step badge + badge utilitário */}
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {String(item.step).padStart(2, "0")}
          </span>
          <Badge variant="outline" className="text-[10px] font-medium">
            {item.badge}
          </Badge>
        </div>

        {/* ícone grande, mesmo padrão do ComparisonSection */}
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 transition-transform duration-300 group-hover:scale-110"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 rounded-xl bg-primary/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
          <Icon className="relative z-10 h-7 w-7 text-primary" />
        </motion.div>

        {/* título + descrição */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold leading-tight transition-colors group-hover:text-primary">{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        </div>

        {/* bullets */}
        <ul className="space-y-1.5">
          {item.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Button onClick={onCtaClick} variant="outline" size="sm" className="w-full">
            {item.cta.text}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
