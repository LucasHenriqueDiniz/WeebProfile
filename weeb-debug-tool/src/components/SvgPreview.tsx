import { useEffect, useRef, useState } from "react"
import type { InspectedElement } from "./ElementInspector"

interface SvgPreviewProps {
  svg: string
  height: number
  width: number
  background?: "light" | "dark"
  onElementClick?: (element: InspectedElement | null) => void
  inspectedSelector?: string | null
  inspectMode?: boolean
  hoveredSelector?: string | null
  onElementHover?: (selector: string | null) => void
}

export default function SvgPreview({
  svg,
  height,
  width,
  background = "dark",
  onElementClick,
  inspectedSelector,
  inspectMode = false,
  hoveredSelector,
  onElementHover,
}: SvgPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement | null>(null)
  const hoverHighlightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current && onElementClick && inspectMode) {
      const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        try {
          const target = e.target as HTMLElement
          if (
            !target ||
            target === containerRef.current ||
            target.tagName === "svg" ||
            !containerRef.current?.contains(target)
          ) {
            onElementClick?.(null)
            return
          }

          // Get element info
          const computed = window.getComputedStyle(target)
          const rect = target.getBoundingClientRect()
          const containerRect = containerRef.current!.getBoundingClientRect()

          const inspectedElement: InspectedElement = {
            tagName: target.tagName,
            classes: Array.from(target.classList || []),
            id: target.id || null,
            styles: {},
            computedStyles: {},
            boundingBox: {
              width: rect.width,
              height: rect.height,
              top: rect.top - containerRect.top,
              left: rect.left - containerRect.left,
            },
            html: target.outerHTML?.slice(0, 200) || "",
            selector: target.id
              ? `#${target.id}`
              : target.className
                ? `.${Array.from(target.classList).join(".")}`
                : target.tagName.toLowerCase(),
          }

          // Extract computed styles safely
          try {
            for (let i = 0; i < computed.length; i++) {
              const prop = computed[i]
              inspectedElement.computedStyles[prop] = computed.getPropertyValue(prop) || ""
            }
          } catch (err) {
            console.warn("Error extracting computed styles:", err)
          }

          onElementClick?.(inspectedElement)
        } catch (err) {
          console.error("Error in click handler:", err)
          onElementClick?.(null)
        }
      }

      // Add hover handlers
      const handleMouseMove = (e: MouseEvent) => {
        if (!inspectMode || !onElementHover) return
        try {
          const target = e.target as HTMLElement
          if (
            !target ||
            target === containerRef.current ||
            target.tagName === "svg" ||
            !containerRef.current?.contains(target)
          ) {
            onElementHover?.(null)
            return
          }
          const selector = target.id
            ? `#${target.id}`
            : target.className
              ? `.${Array.from(target.classList).join(".")}`
              : target.tagName.toLowerCase()
          onElementHover?.(selector)
        } catch (err) {
          console.warn("Error in hover handler:", err)
        }
      }

      containerRef.current.addEventListener("click", handleClick, true)
      if (onElementHover) {
        containerRef.current.addEventListener("mousemove", handleMouseMove)
      }
      return () => {
        containerRef.current?.removeEventListener("click", handleClick, true)
        if (onElementHover) {
          containerRef.current?.removeEventListener("mousemove", handleMouseMove)
        }
      }
    }
  }, [svg, onElementClick, inspectMode, onElementHover])

  // Highlight inspected element (selected)
  useEffect(() => {
    if (!inspectedSelector || !containerRef.current) {
      if (highlightRef.current) {
        highlightRef.current.remove()
        highlightRef.current = null
      }
      return
    }

    try {
      const element = containerRef.current.querySelector(inspectedSelector)
      if (element && containerRef.current.contains(element)) {
        const rect = element.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        if (highlightRef.current) {
          highlightRef.current.remove()
        }

        const highlight = document.createElement("div")
        highlight.style.position = "absolute"
        highlight.style.border = "2px solid #58a6ff"
        highlight.style.pointerEvents = "none"
        highlight.style.left = `${rect.left - containerRect.left}px`
        highlight.style.top = `${rect.top - containerRect.top}px`
        highlight.style.width = `${rect.width}px`
        highlight.style.height = `${rect.height}px`
        highlight.style.zIndex = "999"
        highlight.style.borderRadius = "2px"
        highlight.style.transition = "all 0.1s ease"

        if (!containerRef.current.style.position || containerRef.current.style.position === "static") {
          containerRef.current.style.position = "relative"
        }
        containerRef.current.appendChild(highlight)
        highlightRef.current = highlight
      }
    } catch (err) {
      console.warn("Error highlighting element:", err)
    }

    return () => {
      if (highlightRef.current) {
        highlightRef.current.remove()
        highlightRef.current = null
      }
    }
  }, [inspectedSelector])

  // Highlight hovered element
  useEffect(() => {
    if (!hoveredSelector || !containerRef.current || hoveredSelector === inspectedSelector) {
      if (hoverHighlightRef.current) {
        hoverHighlightRef.current.remove()
        hoverHighlightRef.current = null
      }
      return
    }

    try {
      const element = containerRef.current.querySelector(hoveredSelector)
      if (element && containerRef.current.contains(element)) {
        const rect = element.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        if (hoverHighlightRef.current) {
          hoverHighlightRef.current.remove()
        }

        const highlight = document.createElement("div")
        highlight.style.position = "absolute"
        highlight.style.border = "1px solid #79c0ff"
        highlight.style.pointerEvents = "none"
        highlight.style.left = `${rect.left - containerRect.left}px`
        highlight.style.top = `${rect.top - containerRect.top}px`
        highlight.style.width = `${rect.width}px`
        highlight.style.height = `${rect.height}px`
        highlight.style.zIndex = "998"
        highlight.style.borderRadius = "2px"
        highlight.style.opacity = "0.6"
        highlight.style.transition = "all 0.05s ease"

        if (!containerRef.current.style.position || containerRef.current.style.position === "static") {
          containerRef.current.style.position = "relative"
        }
        containerRef.current.appendChild(highlight)
        hoverHighlightRef.current = highlight
      }
    } catch (err) {
      console.warn("Error highlighting hovered element:", err)
    }

    return () => {
      if (hoverHighlightRef.current) {
        hoverHighlightRef.current.remove()
        hoverHighlightRef.current = null
      }
    }
  }, [hoveredSelector, inspectedSelector])

  const backgroundColor = background === "dark" ? "#0d1117" : "#ffffff"
  const borderColor = background === "dark" ? "#30363d" : "#d0d7de"

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "8px",
        padding: "20px",
        overflow: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0, color: "#58a6ff" }}>🖼️ SVG Renderizado</h2>
        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#8b949e" }}>
          <span>
            Dimensions:{" "}
            <span style={{ color: "#58a6ff", fontFamily: "monospace" }}>
              {width} × {height}px
            </span>
          </span>
        </div>
      </div>
      <div
        ref={containerRef}
        style={{
          background: backgroundColor,
          border: `1px solid ${borderColor}`,
          padding: "20px",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "200px",
          overflow: "auto",
          cursor: inspectMode ? "crosshair" : "default",
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {inspectMode && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#58a6ff",
            fontStyle: "italic",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>🔍</span>
          <span>Inspect mode active - Click on any element to inspect</span>
        </div>
      )}
    </div>
  )
}
