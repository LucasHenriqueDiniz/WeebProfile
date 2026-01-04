/**
 * Preview Split
 * 
 * Split view for React and SVG previews side by side
 */

import { useState, useRef, useEffect } from 'react'
import ReactIframePreview from './ReactIframePreview'
import SvgIframePreview from './SvgIframePreview'
import type { StyleSnapshot } from '../../lib/iframe/iframeProtocol'

interface PreviewSplitProps {
  reactHtml: string
  reactCss: string
  svg: string
  background?: 'light' | 'dark'
  onReactElementSelect?: (snapshot: StyleSnapshot | null) => void
  onSvgElementSelect?: (snapshot: StyleSnapshot | null) => void
  selectedDebugId?: string | null
  hoveredDebugId?: string | null
  onElementHover?: (debugId: string | null) => void
  cssVarNames?: string[]
}

export default function PreviewSplit({
  reactHtml,
  reactCss,
  svg,
  background = 'dark',
  onReactElementSelect,
  onSvgElementSelect,
  selectedDebugId,
  hoveredDebugId,
  onElementHover,
  cssVarNames = [],
}: PreviewSplitProps) {
  const [splitPosition, setSplitPosition] = useState(50) // percentage
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  // Handle mouse drag for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      const clamped = Math.max(20, Math.min(80, percentage)) // Limit between 20% and 80%
      setSplitPosition(clamped)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isDraggingRef.current) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingRef.current])

  const handleMouseDown = () => {
    isDraggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* React Preview */}
      <div
        style={{
          width: `${splitPosition}%`,
          height: '100%',
          borderRight: '1px solid #30363d',
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: '#8b949e',
            marginBottom: '4px',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          React Renderer
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ReactIframePreview
            html={reactHtml}
            css={reactCss}
            background={background}
            onElementSelect={onReactElementSelect}
            selectedDebugId={selectedDebugId}
            hoveredDebugId={hoveredDebugId}
            onElementHover={onElementHover}
            cssVarNames={cssVarNames}
          />
        </div>
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: '4px',
          height: '100%',
          background: '#30363d',
          cursor: 'col-resize',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#58a6ff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#30363d'
        }}
      />

      {/* SVG Preview */}
      <div
        style={{
          width: `${100 - splitPosition}%`,
          height: '100%',
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: '#8b949e',
            marginBottom: '4px',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          SVG Output
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SvgIframePreview
            svg={svg}
            background={background}
            onElementSelect={undefined}
            selectedDebugId={selectedDebugId}
            hoveredDebugId={hoveredDebugId}
            onElementHover={onElementHover}
          />
        </div>
      </div>
    </div>
  )
}

