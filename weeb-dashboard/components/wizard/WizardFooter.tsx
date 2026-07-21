"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AlertTriangle, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "@/i18n/use-translations"

export interface WizardFooterProps {
  onFinish: () => void
  isSaving: boolean
  hasMissingEssential: boolean
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  canFinish: boolean
  isEditMode?: boolean
  /** Compact mode: just the button + tooltip, for the header's action slot on desktop.
      No warning banner - that already exists once above the plugin list, and repeating it
      here was one of three places the same message showed up. */
  compact?: boolean
}

export function WizardFooter({
  onFinish,
  isSaving,
  hasMissingEssential,
  missingConfigs,
  canFinish,
  isEditMode = false,
  compact = false,
}: WizardFooterProps) {
  const t = useTranslations("wizard.footer")

  // O rotulo do botao e sempre a acao ("Criar SVG"/"Salvar SVG"), nunca o proprio aviso
  // de erro - antes o botao virava literalmente "Configuração incompleta"/"Habilite pelo
  // menos um plugin", parecendo uma barra de erro em vez de uma acao desabilitada com
  // motivo. O motivo agora só aparece na tooltip.
  const label = isSaving ? t("generating") : isEditMode ? t("saveSvg") : t("createSvg")
  const isDisabled = isSaving || hasMissingEssential || !canFinish
  const disabledReason = hasMissingEssential
    ? missingConfigs[0]
      ? `${t("missingConfigs.title")}: ${missingConfigs[0].plugin} — ${missingConfigs[0].label}`
      : t("incompleteConfig")
    : !canFinish
      ? t("enablePlugin")
      : undefined

  const button = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={compact ? undefined : "w-full"}>
            <Button
              onClick={onFinish}
              disabled={isDisabled}
              variant={isDisabled ? "secondary" : "default"}
              size={compact ? "sm" : "lg"}
              className={cn(
                "gap-2 transition-all",
                compact ? "" : "w-full shadow-lg",
                !isDisabled ? "bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90 text-white shadow-[0_0_16px_rgba(56,189,248,0.2)]" : ""
              )}
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : isDisabled ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {label}
            </Button>
          </div>
        </TooltipTrigger>
        {disabledReason && (
          <TooltipContent side="bottom" className="max-w-sm">
            {hasMissingEssential && missingConfigs.length > 0 ? (
              <div className="space-y-2">
                <p className="font-semibold text-sm">{t("missingConfigs.title")}</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {missingConfigs.slice(0, 5).map((missing, idx) => (
                    <li key={idx}>
                      <span className="font-medium capitalize">{missing.plugin}</span>: {missing.label}
                    </li>
                  ))}
                  {missingConfigs.length > 5 && (
                    <li className="text-muted-foreground">
                      + {missingConfigs.length - 5} {t("missingConfigs.more")}
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-sm">{disabledReason}</p>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )

  if (compact) return button

  return (
    <div className="bg-card/95 backdrop-blur-sm pt-2 border-t-2 border-border">
      {hasMissingEssential && missingConfigs.length > 0 && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                {missingConfigs.length}{" "}
                {missingConfigs.length === 1 ? t("missingConfigs.singular") : t("missingConfigs.plural")}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{t("missingConfigs.fillRequired")}</p>
            </div>
          </div>
        </div>
      )}
      {button}
    </div>
  )
}
