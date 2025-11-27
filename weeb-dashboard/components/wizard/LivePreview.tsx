"use client"

import { useWizardStore } from "@/stores/wizard-store"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"

interface LivePreviewProps {
  compact?: boolean
}

export function LivePreview({ compact = false }: LivePreviewProps = {}) {
  const {
    plugins,
    pluginsOrder,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    customCss,
    customThemeColors,
  } = useWizardStore()

  const enabledPlugins = pluginsOrder.filter(
    (name) => plugins[name]?.enabled
  )

  if (enabledPlugins.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground">Habilite pelo menos um plugin para ver o preview</p>
      </div>
    )
  }

  // Calcular largura baseada no size (430px para half, 800px para full)
  const previewWidth = size === "half" ? 430 : 800

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div 
        className="flex items-start justify-center transition-all duration-200"
        style={{
          width: `${previewWidth}px`,
          maxWidth: "100%",
        }}
      >
        <div className="flex-shrink-0 w-full">
          <PreviewRenderer
            plugins={plugins}
            pluginsOrder={pluginsOrder}
            style={style}
            size={size}
            theme={theme}
            hideTerminalEmojis={hideTerminalEmojis}
            hideTerminalHeader={hideTerminalHeader}
            customCss={customCss}
            customThemeColors={theme === 'custom' ? customThemeColors : undefined}
          />
        </div>
      </div>
      <style jsx global>{`
        /* Custom scrollbar styles for container */
        .overflow-y-auto::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 6px;
          border: 2px solid hsl(var(--muted));
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  )
}
