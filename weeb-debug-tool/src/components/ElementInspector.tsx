import { useMemo } from 'react'

export interface InspectedElement {
  tagName: string
  classes: string[]
  id: string | null
  styles: Record<string, string>
  computedStyles: Record<string, string>
  boundingBox: {
    width: number
    height: number
    top: number
    left: number
  }
  html: string
  selector: string
}

interface ElementInspectorProps {
  element: InspectedElement | null
  onClose: () => void
}

export default function ElementInspector({ element, onClose }: ElementInspectorProps) {
  if (!element) return null

  const { styleEntries, cssVariables } = useMemo(() => {
    const allStyles = Object.entries(element.computedStyles || element.styles).sort(([a], [b]) => a.localeCompare(b))
    const variables: Array<[string, string]> = []
    const styles: Array<[string, string]> = []
    
    allStyles.forEach(([prop, value]) => {
      if (prop.startsWith('--')) {
        variables.push([prop, value])
      } else {
        styles.push([prop, value])
      }
    })
    
    return { styleEntries: styles, cssVariables: variables }
  }, [element])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '400px',
        background: '#161b22',
        borderLeft: '1px solid #30363d',
        boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0d1117',
        }}
      >
        <h3 style={{ margin: 0, color: '#58a6ff', fontSize: '16px', fontWeight: '600' }}>
          🔍 Element Inspector
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '4px 8px',
            color: '#8b949e',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#21262d'
            e.currentTarget.style.borderColor = '#484f58'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = '#30363d'
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Element Info */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              background: '#21262d',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '12px',
              fontFamily: 'Monaco, Menlo, monospace',
              fontSize: '13px',
              color: '#c9d1d9',
              marginBottom: '12px',
              wordBreak: 'break-all',
            }}
          >
            <div style={{ color: '#58a6ff', marginBottom: '4px' }}>
              &lt;{element.tagName.toLowerCase()}
              {element.id && (
                <>
                  {' '}
                  <span style={{ color: '#79c0ff' }}>id</span>=
                  <span style={{ color: '#a5d6ff' }}>"{element.id}"</span>
                </>
              )}
              {element.classes.length > 0 && (
                <>
                  {' '}
                  <span style={{ color: '#79c0ff' }}>class</span>=
                  <span style={{ color: '#a5d6ff' }}>"{element.classes.join(' ')}"</span>
                </>
              )}
              &gt;
            </div>
          </div>

          {/* Dimensions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                background: '#21262d',
                border: '1px solid #30363d',
                borderRadius: '4px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '4px' }}>Width</div>
              <div style={{ fontSize: '14px', color: '#58a6ff', fontFamily: 'monospace', fontWeight: '600' }}>
                {element.boundingBox.width.toFixed(1)}px
              </div>
            </div>
            <div
              style={{
                background: '#21262d',
                border: '1px solid #30363d',
                borderRadius: '4px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '4px' }}>Height</div>
              <div style={{ fontSize: '14px', color: '#58a6ff', fontFamily: 'monospace', fontWeight: '600' }}>
                {element.boundingBox.height.toFixed(1)}px
              </div>
            </div>
          </div>
        </div>

        {/* Classes */}
        {element.classes.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#c9d1d9',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Classes ({element.classes.length})
            </h4>
            <div
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {element.classes.map((cls) => (
                <span
                  key={cls}
                  style={{
                    background: '#21262d',
                    border: '1px solid #30363d',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'Monaco, Menlo, monospace',
                    color: '#79c0ff',
                  }}
                >
                  .{cls}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CSS Variables */}
        {cssVariables.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#c9d1d9',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              CSS Variables ({cssVariables.length})
            </h4>
            <div
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              <div style={{ fontFamily: 'Monaco, Menlo, monospace', fontSize: '12px' }}>
                {cssVariables.map(([property, value]) => (
                  <div
                    key={property}
                    style={{
                      marginBottom: '6px',
                      padding: '4px',
                      borderRadius: '2px',
                      background: '#161b22',
                    }}
                  >
                    <span style={{ color: '#f0883e' }}>{property}</span>
                    <span style={{ color: '#8b949e' }}>: </span>
                    <span style={{ color: '#a5d6ff' }}>{value}</span>
                    <span style={{ color: '#8b949e' }}>;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Styles */}
        <div>
          <h4
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#c9d1d9',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Computed Styles ({styleEntries.length})
          </h4>
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <div style={{ fontFamily: 'Monaco, Menlo, monospace', fontSize: '12px' }}>
              {styleEntries.map(([property, value]) => (
                <div
                  key={property}
                  style={{
                    marginBottom: '6px',
                    padding: '4px',
                    borderRadius: '2px',
                    background: '#161b22',
                  }}
                >
                  <span style={{ color: '#79c0ff' }}>{property}</span>
                  <span style={{ color: '#8b949e' }}>: </span>
                  <span style={{ color: '#a5d6ff' }}>{value}</span>
                  <span style={{ color: '#8b949e' }}>;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

