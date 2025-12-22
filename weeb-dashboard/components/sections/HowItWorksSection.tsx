"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Link, Palette, Code, LucideIcon } from "lucide-react"

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
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* fundo sutil */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="container relative">
        {/* header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Como funciona
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
            De <span className="text-primary">zero</span> ao perfil pronto em poucos passos
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Conecte suas contas, escolha um tema e publique um perfil lindo sem tocar em código
            (a não ser que você queira).
          </p>
        </div>

        {/* grid de passos */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon]
            if (!Icon) return null

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
              >
                <StepCard item={item} Icon={Icon} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StepCard({
  item,
  Icon,
}: {
  item: HowItWorksItem
  Icon: LucideIcon
}) {
  return (
    <Card className="group relative h-full border border-border/70 bg-card/80 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.55)] hover:border-primary/60 hover:shadow-[0_22px_60px_rgba(59,130,246,0.45)] transition-all">
      {/* glow de borda */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/10 via-transparent to-sky-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <CardContent className="relative z-10 flex h-full flex-col gap-4 p-6">
        {/* topo: badge + ícone */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            Passo {item.step}
          </span>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/40 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-sky-500 shadow-lg">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
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

        {/* código opcional */}
        {item.codeExample && (
          <div className="mt-2 rounded-xl border border-border/70 bg-muted/60 p-3 font-mono text-[11px] text-foreground/90">
            <code className="block whitespace-pre-wrap">
              {item.codeExample}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
