"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AlertTriangle, Check } from "lucide-react"
import { motion } from "framer-motion"

interface WizardFooterProps {
  onFinish: () => void
  isSaving: boolean
  hasMissingEssential: boolean
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  canFinish: boolean
}

export function WizardFooter({
  onFinish,
  isSaving,
  hasMissingEssential,
  missingConfigs,
  canFinish,
}: WizardFooterProps) {
  return (
    <div className="sticky bottom-0 bg-card pt-2 border-t-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                onClick={onFinish}
                disabled={isSaving || hasMissingEssential || !canFinish}
                className={cn(
                  "w-full gap-2 shadow-lg",
                  hasMissingEssential
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-pink-500/20"
                )}
                size="lg"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Gerando...
                  </>
                ) : (
                  <>
                    {hasMissingEssential ? (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        Configuração incompleta
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Finalize
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          {hasMissingEssential && missingConfigs.length > 0 && (
            <TooltipContent side="top" className="max-w-sm">
              <div className="space-y-2">
                <p className="font-semibold text-sm">Configurações faltando:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {missingConfigs.map((missing, idx) => (
                    <li key={idx}>
                      <span className="font-medium capitalize">{missing.plugin}</span>: {missing.label}
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
