"use client"

import React, { useEffect, useRef, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { PluginStyles } from "@weeb/weeb-plugins/templates"
import {
  getStyleCSS,
  getActivePluginsCSS as getPluginsCSS,
  SHARED_CSS,
  getFontCssClient,
  getFontsForStyle,
} from "@weeb/weeb-plugins/styles"
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
  fontFamily?: string
  terminalHeaderText?: string
  customCss?: string
  customThemeColors?: Record<string, string> // Custom theme colors (only used when theme === 'custom')
  plugins?: Record<string, any> // Plugin configs for CSS loading
}

// Baseline for the preview document. The parent page's Tailwind does not reach
// inside the frame, so the handful of layout rules the container relied on
// (`flex flex-col relative`) are restated here.
const FRAME_RESET = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: transparent; }
#svg-main { display: flex; flex-direction: column; position: relative; }
`

/**
 * Renders the preview inside its own document.
 *
 * customCss is author-controlled and travels with public templates, so applying
 * someone else's template used to run their CSS against the dashboard itself: a
 * <style> element scopes to its document, not to the element it is nested under,
 * which left rules like `position: fixed` free to cover the real UI. A separate
 * document is what actually contains it -- the CSSOM does not cross the frame
 * boundary.
 *
 * The children stay a live React tree via createPortal rather than being
 * serialised into srcdoc, because PreviewRenderer may wrap them in framer-motion
 * transitions that only work while mounted. That requires `allow-same-origin` so
 * this document can reach in; `allow-scripts` is deliberately withheld, so
 * nothing inside the frame can execute on its own.
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
  fontFamily,
  terminalHeaderText,
  customCss,
  customThemeColors,
  plugins,
}: PreviewSvgContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)
  const [styleNode, setStyleNode] = useState<HTMLStyleElement | null>(null)

  // Load CSS from generated styles (browser-compatible)
  const [pluginsCss, setPluginsCss] = useState("")

  useEffect(() => {
    async function loadCSS() {
      try {
        // Get style CSS
        const styleCSS = getStyleCSS(style)

        // Get plugins CSS (only if plugins are provided)
        const activePluginsCSS = plugins ? await getPluginsCSS(plugins) : ""

        // @font-face is requested explicitly now that getStyleCSS no longer bakes
        // it in. The URL form is right for a browser document: /api/fonts serves
        // the woff2 with an immutable cache header, so it is fetched once rather
        // than re-parsed as a ~120KB data URI on every render.
        const fontIds = getFontsForStyle(style)
        const fontCSS = fontIds.length > 0 ? getFontCssClient(fontIds, "/api/fonts") : ""

        // SHARED_CSS carries the Tailwind utilities the plugin markup is written
        // against. While the preview rendered inside the dashboard document it
        // borrowed those from the host page's own Tailwind build; inside the frame
        // there is no such thing, and without this the preview renders unstyled.
        setPluginsCss([fontCSS, SHARED_CSS, styleCSS, activePluginsCSS].filter(Boolean).join("\n"))
      } catch (error) {
        console.warn("Could not load CSS:", error)
        setPluginsCss("")
      }
    }

    loadCSS()
  }, [style, plugins])

  // Build the frame document once it exists, then hand React a node to portal into.
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    function attach() {
      const doc = iframe?.contentDocument
      if (!doc) return
      // A second document.write would replace the document React has already
      // portaled into, silently emptying the preview.
      if (doc.getElementById("svg-main")) return

      doc.open()
      doc.write("<!doctype html><html><head></head><body></body></html>")
      doc.close()

      const reset = doc.createElement("style")
      reset.textContent = FRAME_RESET
      doc.head.appendChild(reset)

      const dynamic = doc.createElement("style")
      dynamic.setAttribute("data-preview-dynamic-css", "true")
      doc.head.appendChild(dynamic)

      const root = doc.createElement("div")
      root.id = "svg-main"
      doc.body.appendChild(root)

      setStyleNode(dynamic)
      setMountNode(root)
    }

    // about:blank frames are usually ready synchronously, but load can still fire
    // afterwards in some browsers and would blow away what we just wrote.
    attach()
    iframe.addEventListener("load", attach)
    return () => iframe.removeEventListener("load", attach)
  }, [])

  // Gerar CSS dinâmico para variáveis CSS do tema
  // Injeta as variáveis CSS do tema selecionado + customThemeColors (se houver)
  const themeCss = useMemo(() => {
    const selectedTheme = theme || "default"

    // Obter variáveis CSS do tema selecionado
    const themeVariables =
      style === "terminal"
        ? getTerminalThemeVariables(selectedTheme)
        : getDefaultThemeVariables(selectedTheme, customThemeColors)

    // Se houver customThemeColors, mesclar (customThemeColors sobrescreve)
    const finalVariables =
      customThemeColors && Object.keys(customThemeColors).length > 0
        ? { ...themeVariables, ...customThemeColors }
        : themeVariables

    // Converter para CSS
    const cssVariables = Object.entries(finalVariables)
      .map(([variable, color]) => `  ${variable}: ${color};`)
      .join("\n")

    return `/* Theme Variables */
    #svg-main {
${cssVariables}
    }`
  }, [style, theme, customThemeColors])

  // Inject plugin CSS, theme variables and the author's custom CSS -- all of it
  // into the frame's own head, never the dashboard's.
  useEffect(() => {
    if (!styleNode) return
    styleNode.textContent = [pluginsCss, themeCss, customCss].filter(Boolean).join("\n")
  }, [styleNode, pluginsCss, themeCss, customCss])

  // Keep the frame element sized to the preview, and mirror size/theme onto the
  // portal root so selectors keyed on those attributes still match.
  useEffect(() => {
    if (!mountNode) return
    mountNode.className = String(size)
    mountNode.setAttribute("data-size", size)
    if (theme) mountNode.setAttribute("data-theme", theme)
    else mountNode.removeAttribute("data-theme")
    mountNode.style.width = `${width}px`
    mountNode.style.minHeight = `${height}px`
  }, [mountNode, size, theme, width, height])

  // The old container was a plain div with min-height, so it grew with its content
  // in the page flow. An iframe does not: it would clip at whatever height we gave
  // it. Track the real content height and grow the frame to match. Width is fixed,
  // so this cannot feed back into a resize loop.
  useEffect(() => {
    if (!mountNode) return
    const doc = mountNode.ownerDocument
    const frameWindow = doc.defaultView

    // Written straight to the element instead of through state: this has to stay
    // correct across late reflows (images finishing, sections toggling), and a
    // React round-trip only adds a frame of lag and a chance of a stale value
    // winning. `height` stays out of the JSX style object so nothing overwrites it.
    //
    // scrollHeight, not the observer's contentRect: children routinely overflow
    // the root's own box -- as a plain div that just spilled visibly into the
    // page, but an iframe clips it.
    const sync = () => {
      const frame = iframeRef.current
      if (!frame) return
      const measured = Math.max(
        mountNode.scrollHeight,
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight,
        height
      )
      if (Math.abs(parseFloat(frame.style.height || "0") - measured) > 1) {
        frame.style.height = `${measured}px`
      }
    }

    sync()

    // Images settle after first paint and are the main source of late growth.
    doc.addEventListener("load", sync, true)

    let observer: ResizeObserver | undefined
    if (frameWindow && typeof frameWindow.ResizeObserver !== "undefined") {
      observer = new frameWindow.ResizeObserver(sync)
      observer.observe(mountNode)
      observer.observe(doc.body)
      observer.observe(doc.documentElement)
    }

    // Belt and braces. The observers above did not reliably fire for this tree --
    // the first sync lands before the portal has painted, and nothing afterwards
    // woke it up, leaving the frame stuck at its initial height. A cheap poll is
    // what actually converges here; it costs one layout read per tick.
    const poll = window.setInterval(sync, 300)

    return () => {
      window.clearInterval(poll)
      doc.removeEventListener("load", sync, true)
      observer?.disconnect()
    }
  }, [mountNode, height])

  const frame = (
    <iframe
      ref={iframeRef}
      title="SVG preview"
      // allow-same-origin only: this document needs to reach in to portal React,
      // but nothing inside the frame should be able to run scripts.
      sandbox="allow-same-origin"
      scrolling="no"
      // height is driven imperatively by the sync effect above -- keeping it out
      // of this object is what stops a re-render from clobbering the measurement.
      style={{
        width: `${width}px`,
        border: "none",
        display: "block",
        colorScheme: "normal",
      }}
    />
  )

  // The portal is a sibling of the frame, not a child of it: an <iframe> takes no
  // React children, and nesting them there left the element in an invalid state.
  return (
    <>
      {frame}
      {mountNode &&
        createPortal(
          <PluginStyles
            style={style}
            terminalTheme={style === "terminal" ? theme || "default" : undefined}
            defaultTheme={style === "default" ? theme || "default" : undefined}
            hideTerminalHeader={hideTerminalHeader}
            fontFamily={fontFamily}
            terminalHeaderText={terminalHeaderText}
            customThemeColors={customThemeColors}
          >
            {children}
          </PluginStyles>,
          mountNode
        )}
    </>
  )
}
