"use client"

import { ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWizardStore } from "@/stores/wizard-store"

interface NavigationFooterProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSave: () => void
  isSaving?: boolean
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSave,
  isSaving = false,
}: NavigationFooterProps) {
  const { isValid } = useWizardStore()

  return (
    <div className="border-t bg-background/80 backdrop-blur-sm px-8 py-4 sticky bottom-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1 || isSaving}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {currentStep === 1 ? "Voltar ao Dashboard" : "Anterior"}
        </Button>

        {currentStep === totalSteps ? (
          <Button
            onClick={onSave}
            disabled={!isValid.step4 || isSaving}
            size="lg"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Criar Imagem
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!isValid[`step${currentStep}` as keyof typeof isValid] || isSaving}
            size="lg"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}





