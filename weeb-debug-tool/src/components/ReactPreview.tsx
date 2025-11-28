import { useEffect, useRef, useState } from 'react'

interface ReactPreviewProps {
  html: string
  css: string
}

export default function ReactPreview({ html, css }: ReactPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Inject CSS
      const styleId = 'debug-react-css'
      let styleEl = document.getElementById(styleId) as HTMLStyleElement
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = styleId
        document.head.appendChild(styleEl)
      }
      styleEl.textContent = css

      // Set HTML
      containerRef.current.innerHTML = html
    }
  }, [html, css])

  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const element = containerRef.current?.querySelector('#svg-main')
        if (element) {
          const rect = element.getBoundingClientRect()
          setDimensions({ width: rect.width, height: rect.height })
        }
      }
      updateDimensions()
      const timeout = setTimeout(updateDimensions, 100)
      return () => clearTimeout(timeout)
    }
  }, [html])

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
        <h2 style={{ margin: 0, color: '#58a6ff' }}>⚛️ React Element Renderizado</h2>
        {dimensions && (
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#8b949e' }}>
            <span>Width: <span style={{ color: '#58a6ff', fontFamily: 'monospace' }}>{dimensions.width.toFixed(0)}px</span></span>
            <span>Height: <span style={{ color: '#58a6ff', fontFamily: 'monospace' }}>{dimensions.height.toFixed(0)}px</span></span>
          </div>
        )}
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
      />
    </div>
  )
}



