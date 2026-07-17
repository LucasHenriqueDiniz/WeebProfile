"use client"

import { Header } from "@/components/layout/Header"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import { Package } from "lucide-react"
import { selectPluginsWithSections } from "@/stores/wizard-selectors"
import { useWizardStore } from "@/stores/wizard-store"
import { LivePreview } from "./LivePreview"
import { useTranslations } from "@/i18n/use-translations"
import Image from "@/src/compat/next-image"

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
  const { plugins, pluginsOrder, size } = useWizardStore()
  const t = useTranslations("wizard.plugins")

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
      <Header variant="dashboard" />

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Configuration */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-6xl mx-auto">
              {/* Tabs */}
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">{children}</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="relative border-l border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col flex-shrink-0">
          {(() => {
            const pluginsWithSections = selectPluginsWithSections({ plugins, pluginsOrder })
            const previewWidth = size === "half" ? 450 : 900
            const contentWidth = size === "half" ? 415 : 830

            return (
              <>
                <div className="flex-1 overflow-y-auto scrollbar-hide pt-2" style={{ width: `${previewWidth}px` }}>
                  {/* SVG Preview - Responsive width */}
                  <div
                    className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 p-0 flex items-center justify-center mb-4 min-h-[400px]"
                    style={{ width: `${previewWidth}px` }}
                  >
                    {pluginsWithSections.length > 0 ? (
                      <div className="w-full flex justify-center h-full" style={{ width: `${contentWidth}px` }}>
                        {preview}
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center h-full w-full py-12"
                        style={{ width: `${contentWidth}px` }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex flex-col items-center justify-center space-y-4 px-4"
                        >
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="relative"
                          >
                            <Image
                              src="/sora/sora_main.png"
                              alt="Sora"
                              width={200}
                              height={200}
                              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                              draggable={false}
                            />
                          </motion.div>
                          <div className="text-center space-y-2 max-w-sm">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                              <span>{t("enablePluginToPreview")}</span>
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer - Always at bottom, no scrollbar */}
                <div className="flex-shrink-0 overflow-hidden" style={{ width: `${previewWidth}px` }}>
                  {footer}
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
