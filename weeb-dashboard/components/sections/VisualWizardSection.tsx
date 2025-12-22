"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plug,
  Layout,
  Palette,
  Eye,
  LucideIcon,
} from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  steps: Array<{
    number: number
    title: string
    description: string
  }>
}

interface VisualWizardSectionProps {
  feature: Feature
}

const stepIcons: Record<number, LucideIcon> = {
  1: Plug,
  2: Layout,
  3: Palette,
  4: Eye,
}

export function VisualWizardSection({ feature }: VisualWizardSectionProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* fundo sutil */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-120px] h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* texto + timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Visual wizard
              </p>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                {feature.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>

            <ol className="mt-4 space-y-5">
              {feature.steps.map((step, index) => {
                const Icon = stepIcons[step.number] ?? Eye

                return (
                  <FeatureStepRow
                    key={step.number}
                    step={step}
                    Icon={Icon}
                    index={index}
                    isLast={index === feature.steps.length - 1}
                  />
                )
              })}
            </ol>
          </motion.div>

          {/* preview do builder */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <BuilderPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

interface FeatureStepRowProps {
  step: Feature["steps"][number]
  Icon: LucideIcon
  index: number
  isLast: boolean
}

function FeatureStepRow({ step, Icon, index, isLast }: FeatureStepRowProps) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
      className="relative flex gap-4"
    >
      {/* linha vertical */}
      {!isLast && (
        <span className="pointer-events-none absolute left-5 top-8 h-full w-[2px] bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
      )}

      {/* ícone + número */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-sky-500 to-primary shadow-lg">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="mt-1 text-[11px] font-semibold text-muted-foreground">
          {step.number}
        </span>
      </div>

      {/* conteúdo */}
      <div className="flex-1 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.6)]">
        <h3 className="text-sm font-semibold">{step.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.li>
  )
}

function BuilderPreview() {
  return (
    <Card className="relative border border-border/80 bg-slate-950/90 backdrop-blur-sm shadow-[0_22px_60px_rgba(15,23,42,0.95)] overflow-hidden rounded-3xl">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-sky-500/20 opacity-80 blur-2xl" />
      <CardContent className="relative z-10 p-5 md:p-6 space-y-4">
        {/* barra superior */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          </div>
          <p className="text-xs font-medium text-slate-300">
            Preview do perfil
          </p>
        </div>

        {/* conteúdo fake: painel + preview */}
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] items-stretch">
          {/* painel esquerdo */}
          <div className="space-y-3 rounded-2xl bg-slate-900/80 p-3">
            <div className="h-8 rounded-lg bg-gradient-to-r from-primary/40 to-sky-500/40" />
            <div className="space-y-2 pt-1">
              <div className="h-2.5 w-3/4 rounded-full bg-slate-700/80" />
              <div className="h-2.5 w-1/2 rounded-full bg-slate-700/60" />
            </div>
            <div className="mt-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-800/70 px-2.5 py-2"
                >
                  <div className="h-2.5 w-20 rounded-full bg-slate-600/80" />
                  <div className="h-6 w-10 rounded-md bg-primary/60" />
                </div>
              ))}
            </div>
          </div>

          {/* preview direito */}
          <motion.div
            initial={{ y: 6 }}
            animate={{ y: [6, 0, 6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-2xl bg-slate-900/80 p-3 overflow-hidden"
          >
            <div className="mb-3 h-10 w-24 rounded-full bg-slate-800/80" />
            <div className="flex gap-3">
              <div className="h-32 w-28 rounded-2xl bg-gradient-to-b from-cyan-500 via-sky-500 to-emerald-400" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-3/4 rounded-full bg-slate-700/80" />
                <div className="h-2.5 w-1/2 rounded-full bg-slate-700/70" />
                <div className="mt-3 space-y-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-full rounded-full bg-slate-800/80"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="pt-1 text-[11px] text-muted-foreground">
          Tudo o que você muda no builder aparece aqui em tempo real — cores,
          plugins, layout e muito mais.
        </p>
      </CardContent>
    </Card>
  )
}
