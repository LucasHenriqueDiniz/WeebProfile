"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Step {
  number: number
  title: string
}

interface StepIndicatorProps {
  currentStep: number
  steps: Step[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="sticky top-8">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isPending = step.number > currentStep

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-colors",
                isCurrent && "bg-primary/10 border border-primary/20",
                isCompleted && "bg-green-50 dark:bg-green-950/20",
                isPending && "opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isCompleted && "bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white",
                  isCurrent && "bg-primary border-primary text-primary-foreground",
                  isPending && "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Circle className={cn("w-4 h-4", isCurrent && "fill-current")} />
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Passo {step.number}</div>
                <div className={cn("font-medium", isCurrent && "text-primary")}>{step.title}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


