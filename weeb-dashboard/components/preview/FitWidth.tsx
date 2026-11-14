"use client"

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"

interface FitWidthProps {
  /** The child's own width in px: the card's 415 or 830, plus any frame drawn around it. */
  width: number
  children: ReactNode
  className?: string
}

/**
 * Shows a fixed-width child scaled down to the width it is given, never up.
 *
 * Card previews render at the SVG's real width, 415 or 830px, and every place that
 * showed one sat in a column narrower than that at common laptop widths: the wizard
 * column is ~310px at 1034px wide, and a full-width card fits nowhere under ~1800px.
 * The card came out cut on the right, and the gallery thumbnails were a crop from
 * the middle of it.
 *
 * The scale is applied with a transform, so the child keeps laying out at its real
 * width and the card looks exactly as the generated SVG will, only smaller. Its
 * height keeps changing after mount (the preview iframe grows as images load), so
 * both the available width and the child's height are observed.
 */
export function FitWidth({ width, children, className }: FitWidthProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [innerHeight, setInnerHeight] = useState(0)

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const measure = () => {
      const available = outer.clientWidth
      setScale(available > 0 ? Math.min(1, available / width) : 1)
      // offsetHeight is the untransformed layout height, which is what gets scaled.
      setInnerHeight(inner.offsetHeight)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(outer)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [width])

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        height: innerHeight ? `${innerHeight * scale}px` : undefined,
        marginInline: "auto",
        overflow: "hidden",
      }}
    >
      <div ref={innerRef} style={{ width: `${width}px`, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  )
}
