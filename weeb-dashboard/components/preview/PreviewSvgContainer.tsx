"use client"

import React, { useEffect, useRef, useMemo, useState } from "react"
import { PluginStyles } from "@weeb/weeb-plugins/templates"
import { getStyleCSS, getActivePluginsCSS as getPluginsCSS } from "@weeb/weeb-plugins/styles"
import { getDefaultThemeVariables, getTerminalThemeVariables } from "@weeb/weeb-plugins/themes"

interface PreviewSvgContainerProps {
  width: number
  height: number
  size: "half" | "full"
  style: "default" | "terminal"
  children: React.ReactNode
  theme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  customCss?: string
  customThemeColors?: Record<string, string> // Custom theme colors (only used when theme === 'custom')
  plugins?: Record<string, any> // Plugin configs for CSS loading
}

/**
 * Container para preview que simula o SvgContainer do core-v2
 * mas renderiza HTML/CSS diretamente ao invés de SVG
 */
export function PreviewSvgContainer({
  width,
  height,
  size,
  style,
  children,
  theme,
  hideTerminalEmojis,
  hideTerminalHeader,
  customCss,
  customThemeColors,
  plugins,
}: PreviewSvgContainerProps) {
  const containerClass = `flex flex-col relative`
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Load CSS from generated styles (browser-compatible)
  const [pluginsCss, setPluginsCss] = useState('')
  
  useEffect(() => {
    async function loadCSS() {
      try {
        // Get style CSS
        const styleCSS = getStyleCSS(style)
        
        // Get plugins CSS (only if plugins are provided)
        const activePluginsCSS = plugins ? await getPluginsCSS(plugins) : ''
        
        // Combine
        setPluginsCss([styleCSS, activePluginsCSS].filter(Boolean).join('\n'))
      } catch (error) {
        console.warn('Could not load CSS:', error)
        setPluginsCss('')
      }
    }
    
    loadCSS()
  }, [style, plugins])

  // Gerar CSS dinâmico para variáveis CSS do tema
  // Injeta as variáveis CSS do tema selecionado + customThemeColors (se houver)
  const themeCss = useMemo(() => {
    const selectedTheme = theme || 'default'
    
    // Obter variáveis CSS do tema selecionado
    const themeVariables = style === 'terminal'
      ? getTerminalThemeVariables(selectedTheme)
      : getDefaultThemeVariables(selectedTheme, customThemeColors)
    
    // Se houver customThemeColors, mesclar (customThemeColors sobrescreve)
    const finalVariables = customThemeColors && Object.keys(customThemeColors).length > 0
      ? { ...themeVariables, ...customThemeColors }
      : themeVariables
    
    // Converter para CSS
    const cssVariables = Object.entries(finalVariables)
      .map(([variable, color]) => `  ${variable}: ${color};`)
      .join('\n')
    
    return `/* Theme Variables */
    #svg-main {
${cssVariables}
    }`
  }, [style, theme, customThemeColors])

  // Injetar CSS dinâmico (plugins CSS + variáveis do tema + CSS customizado)
  useEffect(() => {
    if (!containerRef.current) return

    const combinedCss = [pluginsCss, themeCss, customCss].filter(Boolean).join('\n')

    // Sempre criar o elemento style (pluginsCss sempre existe)
    if (!styleRef.current) {
      const styleElement = document.createElement("style")
      styleElement.setAttribute("data-preview-dynamic-css", "true")
      styleRef.current = styleElement
      containerRef.current.insertBefore(styleElement, containerRef.current.firstChild)
    }
    styleRef.current.textContent = combinedCss

    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current)
        styleRef.current = null
      }
    }
  }, [pluginsCss, themeCss, customCss])

  return (
    <div
      ref={containerRef}
      id="svg-main"
      className={`${containerClass} ${size}`}
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        position: "relative",
      }}
      data-size={size}
      data-theme={theme}
    >
      <PluginStyles
        style={style}
        terminalTheme={style === "terminal" ? (theme || "default") : undefined}
        defaultTheme={style === "default" ? (theme || "default") : undefined}
        hideTerminalHeader={hideTerminalHeader}
        customThemeColors={customThemeColors}
      >
        {children}
      </PluginStyles>
    </div>
  )
}

