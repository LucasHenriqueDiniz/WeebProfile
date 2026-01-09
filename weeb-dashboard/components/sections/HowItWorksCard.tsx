"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Plug, 
  Palette, 
  Code, 
  Link as LinkIcon,
  Grid3x3,
  Wand2,
  Copy,
  LucideIcon 
} from "lucide-react"
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
    action?: 'modal' | 'scroll' | 'navigate'
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
    <Card className="group relative h-full border border-border/70 bg-card/80 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.55)] hover:border-primary/60 hover:shadow-[0_22px_60px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-0.5">
      {/* glow de borda no hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/10 via-transparent to-sky-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <CardContent className="relative z-10 flex h-full flex-col gap-4 p-6">
        {/* topo: step badge + badge utilitário */}
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {String(item.step).padStart(2, '0')}
          </span>
          <Badge variant="secondary" className="text-[10px] font-medium">
            {item.badge}
          </Badge>
        </div>

        {/* ícone grande */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-sky-500 shadow-lg">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        {/* título + descrição */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* bullets */}
        <ul className="space-y-1.5">
          {item.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Button
            onClick={onCtaClick}
            variant="outline"
            size="sm"
            className="w-full group/btn"
          >
            {item.cta.text}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

