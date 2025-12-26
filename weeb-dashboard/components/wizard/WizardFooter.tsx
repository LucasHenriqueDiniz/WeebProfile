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
  // UX 4: Better visual feedback for button states
  const getButtonText = () => {
    if (isSaving) return "Gerando..."
    if (hasMissingEssential) return "Configuração incompleta"
    if (!canFinish) return "Habilite pelo menos um plugin"
    return "Finalize"
  }

  const getButtonVariant = () => {
    if (isSaving) return "default"
    if (hasMissingEssential) return "destructive"
    if (!canFinish) return "secondary"
    return "default"
  }

  return (
    <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm pt-2 border-t-2 border-border">
      {/* UX 4: Status indicator above button */}
      {hasMissingEssential && missingConfigs.length > 0 && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                {missingConfigs.length} {missingConfigs.length === 1 ? "configuração faltando" : "configurações faltando"}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Preencha os campos obrigatórios para continuar
              </p>
            </div>
          </div>
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                onClick={onFinish}
                disabled={isSaving || hasMissingEssential || !canFinish}
                variant={getButtonVariant()}
                className={cn(
                  "w-full gap-2 shadow-lg transition-all",
                  !hasMissingEssential && canFinish && !isSaving
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-pink-500/20 text-white"
                    : ""
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
                    {getButtonText()}
                  </>
                ) : (
                  <>
                    {hasMissingEssential || !canFinish ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {getButtonText()}
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
                  {missingConfigs.slice(0, 5).map((missing, idx) => (
                    <li key={idx}>
                      <span className="font-medium capitalize">{missing.plugin}</span>: {missing.label}
                    </li>
                  ))}
                  {missingConfigs.length > 5 && (
                    <li className="text-muted-foreground">+ {missingConfigs.length - 5} mais...</li>
                  )}
                </ul>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
