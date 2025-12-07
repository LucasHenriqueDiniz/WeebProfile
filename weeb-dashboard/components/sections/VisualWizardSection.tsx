"use client"

import { motion } from "framer-motion"
import { 
  Plug, 
  Layout, 
  Palette, 
  Eye, 
  LucideIcon,
  ArrowRight,
  X,
  Check
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

interface FeatureStepProps {
  number: number
  title: string
  description: string
  icon: LucideIcon
  index: number
  isLast?: boolean
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
  isLast = false,
}: FeatureStepProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, x: -50, scale: 0.9 },
        visible: (i: number) => ({
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { 
            delay: i * 0.15, 
            duration: 0.6,
            type: "spring",
            stiffness: 80,
            damping: 15
          },
        }),
      }}
      className="relative group"
    >
      {/* Timeline line */}
      {!isLast && (
        <motion.div
          className="absolute left-8 top-24 w-full h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent hidden lg:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
        />
      )}
      
      <div className="flex gap-6 items-start">
        {/* Icon circle with animation */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 relative z-10"
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Icon className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/40"
            animate={{
              scale: [1, 1.3, 1.3],
              opacity: [0.6, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 pt-2 pb-12 lg:pb-16">
          <motion.div
            className="space-y-2"
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {title}
              </span>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed max-w-md">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function VisualWizardSection({
  feature,
}: VisualWizardSectionProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Visual builder</span>
            <span className="text-sm font-semibold text-muted-foreground">•</span>
            <span className="text-sm font-semibold text-foreground">Real-time preview</span>
            <span className="text-sm font-semibold text-muted-foreground">•</span>
            <span className="text-sm font-semibold text-foreground">No code required</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {feature.title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>

        {/* Horizontal Timeline Flow */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-0">
            {feature.steps.map((step, index) => {
              const Icon = stepIcons[step.number]
              const isLast = index === feature.steps.length - 1
              
              return (
                <div key={step.number} className="relative">
                  <FeatureStep
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    icon={Icon}
                    index={index}
                    isLast={isLast}
                  />
                  
                  {/* Arrow connector */}
                  {!isLast && (
                    <motion.div
                      className="absolute left-8 top-24 w-8 h-8 hidden lg:flex items-center justify-center"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary/60" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </div>
    </section>
  )
}
















