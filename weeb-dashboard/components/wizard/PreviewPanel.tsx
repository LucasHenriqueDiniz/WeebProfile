"use client"

import { ExternalLink, Copy, CheckCheck } from "lucide-react"
import { useWizardStore } from "@/stores/wizard-store"
import { LivePreview } from "./LivePreview"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface PreviewPanelProps {
  isVisible: boolean
}

export function PreviewPanel({ isVisible }: PreviewPanelProps) {
  const { slug, size, style, plugins, pluginsOrder } = useWizardStore()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  
  const activePlugins = pluginsOrder.filter(
    (name) => plugins[name]?.enabled
  )

  const dimensions = size === "half" ? "415x600px" : "830x600px"
  const imageUrl = slug && typeof window !== "undefined" ? `${window.location.origin}/api/${slug}.svg` : ""

  const copyToClipboard = () => {
    if (!imageUrl) return
    navigator.clipboard.writeText(imageUrl)
    setCopied(true)
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const openInNewTab = () => {
    if (!imageUrl || typeof window === "undefined") return
    window.open(imageUrl, "_blank")
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "lg:w-[520px] xl:w-[600px]",
        "bg-background/95 backdrop-blur-sm border-l border-border flex flex-col transition-all duration-300 shadow-xl"
      )}
    >
      {/* Preview Content - Full height, scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Preview Container - SVG full height, scroll only on container */}
        <div className="min-h-full flex items-start justify-center bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 py-4">
          {activePlugins.length > 0 ? (
            <div className="w-full flex items-start justify-center">
              <LivePreview compact />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Nenhum plugin ativo
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Adicione plugins para ver o preview
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Info and Actions (at the bottom of scrollable content) */}
        {activePlugins.length > 0 && (
          <div className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
            <div className="p-4 space-y-4">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="text-muted-foreground/70 font-medium">Tamanho</div>
                  <div className="font-semibold text-foreground">{dimensions}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground/70 font-medium">Estilo</div>
                  <div className="font-semibold text-foreground capitalize">{style}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-muted-foreground/70 font-medium">Plugins Ativos</div>
                  <div className="font-semibold text-foreground">
                    {activePlugins.length} {activePlugins.length === 1 ? "plugin" : "plugins"}
                  </div>
                </div>
              </div>

              {/* URL Section */}
              {slug && (
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      URL da Imagem
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <code className="flex-1 px-3 py-2 rounded-md text-xs font-mono bg-muted/50 text-foreground border border-border/50 truncate">
                      {typeof window !== "undefined" ? imageUrl.replace(window.location.origin, "") : `/api/${slug}.svg`}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="shrink-0 h-9 w-9"
                      title="Copiar URL"
                    >
                      {copied ? (
                        <CheckCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Button - Discreto */}
              {slug && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openInNewTab}
                  className="w-full gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir em nova aba
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
