"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Link,
  Palette,
  Code,
  LucideIcon,
  ArrowRight,
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

interface HowItWorksStepProps {
  step: number
  title: string
  description: string
  icon: LucideIcon
  codeExample?: string
  isLast: boolean
  index: number
}

function HowItWorksStep({
  step,
  title,
  description,
  icon: Icon,
  codeExample,
  isLast,
  index,
}: HowItWorksStepProps) {
  return (
    <>
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2 },
          }),
        }}
        className="flex-1"
      >
        <Card className="h-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              {step}
            </div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="text-base mb-4">
              {description}
            </CardDescription>
            {codeExample && (
              <div className="mt-4 p-4 rounded-lg bg-muted font-mono text-sm text-left overflow-x-auto">
                <code>{codeExample}</code>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {!isLast && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden lg:flex items-center justify-center px-4"
        >
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              x: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowRight className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export function HowItWorksSection({ items }: HowItWorksSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col lg:flex-row gap-8 lg:gap-4"
      >
        {items.map((item, index) => {
          const Icon = iconMap[item.icon]
          if (!Icon) return null

          return (
            <HowItWorksStep
              key={item.step}
              step={item.step}
              title={item.title}
              description={item.description}
              icon={Icon}
              codeExample={item.codeExample}
              isLast={index === items.length - 1}
              index={index}
            />
          )
        })}
      </motion.div>
    </section>
  )
}















