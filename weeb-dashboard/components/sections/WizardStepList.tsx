"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface Step {
  number: number
  title: string
  description: string
}

interface WizardStepListProps {
  steps: Step[]
  activeStep: number
  onStepChange: (step: number) => void
  stepIcons: Record<number, LucideIcon>
}

export function WizardStepList({ steps, activeStep, onStepChange, stepIcons }: WizardStepListProps) {
  return (
    <ol className="mt-4 space-y-5">
      {steps.map((step, index) => {
        const Icon = stepIcons[step.number] ?? stepIcons[1]
        const isActive = step.number === activeStep
        const isLast = index === steps.length - 1

        return (
          <motion.li
            key={step.number}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.12 }}
            className="relative flex gap-4 cursor-pointer group"
            onClick={() => onStepChange(step.number)}
            onMouseEnter={() => onStepChange(step.number)}
          >
            {/* linha vertical conector */}
            {!isLast && (
              <span className="pointer-events-none absolute left-5 top-8 h-full w-[2px] bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
            )}

            {/* ícone + número */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-primary via-sky-500 to-primary scale-110"
                    : "bg-gradient-to-br from-primary/60 via-sky-500/60 to-primary/60 group-hover:scale-105"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span
                className={`mt-1 text-[11px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.number}
              </span>
            </div>

            {/* conteúdo */}
            <motion.div
              className={`flex-1 rounded-2xl border px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.6)] transition-all ${
                isActive ? "border-primary/60 bg-card/90" : "border-border/70 bg-card/80 group-hover:border-primary/40"
              }`}
            >
              <h3
                className={`text-sm font-semibold transition-colors ${
                  isActive ? "text-foreground" : "text-foreground/90"
                }`}
              >
                {step.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          </motion.li>
        )
      })}
    </ol>
  )
}
