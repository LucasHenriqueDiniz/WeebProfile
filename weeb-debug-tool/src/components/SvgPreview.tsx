import { useEffect, useRef, useState } from 'react'

interface SvgPreviewProps {
  svg: string
  height: number
  width: number
}

export default function SvgPreview({ svg, height, width }: SvgPreviewProps) {
  const [actualDimensions, setActualDimensions] = useState<{ width: number; height: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const svgElement = containerRef.current.querySelector('svg')
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect()
        setActualDimensions({ width: rect.width, height: rect.height })
      }
    }
  }, [svg])

  return (
    <div
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '8px',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#58a6ff' }}>🖼️ SVG Renderizado</h2>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#8b949e' }}>
          <span>
            Reported: <span style={{ color: '#58a6ff', fontFamily: 'monospace' }}>{width} × {height}px</span>
          </span>
          {actualDimensions && (
            <span>
              Actual: <span style={{ color: actualDimensions.width !== width || actualDimensions.height !== height ? '#f85149' : '#3fb950', fontFamily: 'monospace' }}>
                {actualDimensions.width.toFixed(0)} × {actualDimensions.height.toFixed(0)}px
              </span>
            </span>
          )}
        </div>
      </div>
      <div
        ref={containerRef}
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '200px',
          overflow: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {actualDimensions && (actualDimensions.width !== width || actualDimensions.height !== height) && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#1c2128', border: '1px solid #f85149', borderRadius: '4px', fontSize: '12px', color: '#f85149' }}>
          ⚠️ Dimension mismatch detected! Reported dimensions differ from actual rendered dimensions.
        </div>
      )}
    </div>
  )
}



