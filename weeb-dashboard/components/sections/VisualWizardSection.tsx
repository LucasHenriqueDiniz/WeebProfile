"use client"

import { motion } from "framer-motion"
import { Plug, Layout, Palette, Eye, LucideIcon } from "lucide-react"

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

interface FeatureStepProps {
  number: number
  title: string
  description: string
  icon: LucideIcon
  index: number
}

const stepIcons: Record<number, LucideIcon> = {
  1: Plug,
  2: Layout,
  3: Palette,
  4: Eye,
}

function FeatureStep({
  number,
  title,
  description,
  icon: Icon,
  index,
}: FeatureStepProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: (i: number) => ({
          opacity: 1,
          x: 0,
          transition: { delay: i * 0.15 },
        }),
      }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}

export function VisualWizardSection({
  feature,
}: VisualWizardSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Screenshot Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-primary/20 to-accent/20 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">Dashboard Preview</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Steps */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              {feature.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>

          <div className="space-y-6">
            {feature.steps.map((step, index) => {
              const Icon = stepIcons[step.number]
              return (
                <FeatureStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={Icon}
                  index={index}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
















