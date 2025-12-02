"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PluginEssentialConfigs } from "@/components/PluginEssentialConfigs"

interface PluginEssentialConfigsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pluginName?: string // Opcional: filtra para um plugin específico
}

export function PluginEssentialConfigsModal({
  open,
  onOpenChange,
  pluginName,
}: PluginEssentialConfigsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pluginName ? `Configurar ${pluginName}` : "Configurar Plugins"}
          </DialogTitle>
          <DialogDescription>
            {pluginName
              ? `Configure as credenciais sensíveis do plugin ${pluginName}`
              : "Configure as credenciais sensíveis dos plugins (API keys, tokens, etc.). Estas serão usadas em todas as suas imagens SVG."}
          </DialogDescription>
        </DialogHeader>

        <PluginEssentialConfigs
          activePlugins={pluginName ? [pluginName] : undefined}
          onSave={() => {
            // Fechar modal após salvar
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

