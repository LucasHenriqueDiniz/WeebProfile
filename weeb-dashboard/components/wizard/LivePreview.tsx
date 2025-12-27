"use client"

import React from "react"
import { useWizardStore } from "@/stores/wizard-store"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { debugPreview } from "@/lib/debug"
import { useShallow } from "zustand/react/shallow"


export function LivePreview() {
  // Use useShallow to prevent unnecessary re-renders
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
  } = useWizardStore(
    useShallow((state) => ({
      plugins: state.plugins,
      pluginsOrder: state.pluginsOrder,
      style: state.style,
      size: state.size,
      theme: state.theme,
      hideTerminalEmojis: state.hideTerminalEmojis,
      hideTerminalHeader: state.hideTerminalHeader,
      customCss: state.customCss,
      customThemeColors: state.customThemeColors,
    }))
  )
  
  // Smart debounce: only debounce text input changes, not section/config changes
  // Use state to store debounced plugins
  const [debouncedPlugins, setDebouncedPlugins] = React.useState(plugins)
  const pluginsRef = React.useRef(plugins)
  const lastSectionsRef = React.useRef<Record<string, string[]>>(() => {
    // Initialize with current sections
    const initial: Record<string, string[]> = {}
    Object.keys(plugins).forEach(pluginName => {
      initial[pluginName] = plugins[pluginName]?.sections || []
    })
    return initial
  })
  const lastSectionConfigsRef = React.useRef<Record<string, Record<string, Record<string, unknown>>>>(() => {
    // Initialize with current sectionConfigs
    const initial: Record<string, Record<string, Record<string, unknown>>> = {}
    Object.keys(plugins).forEach(pluginName => {
      initial[pluginName] = plugins[pluginName]?.sectionConfigs || {}
    })
    return initial
  })
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  
  // Update ref when plugins change
  React.useEffect(() => {
    pluginsRef.current = plugins
  }, [plugins])
  
  // Check if change is in sections or sectionConfigs (should be instant)
  // vs text fields (should be debounced)
  React.useEffect(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    
    let isInstantUpdate = false
    
    // Check if sections or sectionConfigs changed
    for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
      const currentSections = JSON.stringify(pluginConfig.sections || [])
      const lastSections = JSON.stringify(lastSectionsRef.current[pluginName] || [])
      
      if (currentSections !== lastSections) {
        isInstantUpdate = true
        lastSectionsRef.current[pluginName] = pluginConfig.sections || []
      }
      
      // Check if sectionConfigs changed
      const currentSectionConfigs = JSON.stringify(pluginConfig.sectionConfigs || {})
      const lastSectionConfigs = JSON.stringify(lastSectionConfigsRef.current[pluginName] || {})
      
      if (currentSectionConfigs !== lastSectionConfigs) {
        isInstantUpdate = true
        lastSectionConfigsRef.current[pluginName] = pluginConfig.sectionConfigs || {}
      }
    }
    
    if (isInstantUpdate) {
      // Instant update for sections/configs
      setDebouncedPlugins(plugins)
    } else {
      // Debounced update for text fields (1000ms delay)
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedPlugins(pluginsRef.current)
        debounceTimerRef.current = null
      }, 1000)
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [plugins])

  debugPreview('Received props:', {
    pluginsOrder,
    pluginsCount: Object.keys(plugins).length,
  })

  // Calcular largura baseada no size (415px para half, 830px para full - tamanho exato do SVG)
  const previewWidth = size === "half" ? 415 : 830

  return (
    <div className="flex flex-col items-center justify-start" style={{ width: `${previewWidth}px` }}>
      <div className="flex-shrink-0 w-full" style={{ width: `${previewWidth}px` }}>
        <PreviewRenderer
          plugins={debouncedPlugins}
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
