"use client"

import { Header } from "@/components/layout/Header"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import { Package } from "lucide-react"
import { selectPluginsWithSections } from "@/stores/wizard-selectors"
import { useWizardStore } from "@/stores/wizard-store"
import { LivePreview } from "./LivePreview"

interface WizardShellProps {
  stats?: {
    style: string
    theme: string
    plugins: number
    sections: number
  }
  preview: ReactNode
  footer: ReactNode
  children: ReactNode
}

export function WizardShell({ stats, preview, footer, children }: WizardShellProps) {
  const { plugins, pluginsOrder } = useWizardStore()

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl"
        />
      </div>

      {/* Top Navigation */}
      <Header variant="wizard" stats={stats} />

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Configuration */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-6xl mx-auto">
              {/* Tabs */}
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="relative w-[450px] border-l border-border bg-card/50 backdrop-blur-sm overflow-y-auto overflow-x-hidden flex flex-col flex-shrink-0">
          <div className="scrollbar-hide pt-2 flex flex-col h-full max-h-[calc(100vh-100px)]">
            {/* SVG Preview - Exatamente 415px de largura */}
            <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 p-0 flex items-start justify-center mb-4" style={{ width: "450px" }}>
              {(() => {
                const pluginsWithSections = selectPluginsWithSections({ plugins, pluginsOrder })
                
                if (pluginsWithSections.length > 0) {
                  return (
                    <div className="w-full flex justify-center h-full" style={{ width: "415px" }}>
                      {preview}
                    </div>
                  )
                } else {
                  return (
                    <div className="flex items-center justify-center h-full" style={{ width: "415px" }}>
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                          <Package className="h-4 w-4 mr-2" />
                          Habilite pelo menos um plugin e selecione seções para ver o preview
                        </p>
                      </div>
                    </div>
                  )
                }
              })()}
            </div>

            {/* Footer */}
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}
