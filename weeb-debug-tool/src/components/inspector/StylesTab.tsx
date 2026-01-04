/**
 * Styles Tab
 * 
 * Shows inline styles and computed styles with filtering
 */

import { useState, useMemo } from 'react'
import type { StyleSnapshot } from '../../lib/iframe/iframeProtocol'

interface StylesTabProps {
  snapshot: StyleSnapshot | null
}

export default function StylesTab({ snapshot }: StylesTabProps) {
  const [filter, setFilter] = useState('')
  const [mode, setMode] = useState<'important' | 'all'>('important')

  if (!snapshot) {
    return (
      <div style={{ padding: '16px', color: '#8b949e', textAlign: 'center' }}>
        No element selected
      </div>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error)
  }

  // Filter styles
  const filteredStyles = useMemo(() => {
    const styles = Object.entries(snapshot.computedStyle)
    if (!filter) return styles

    const lowerFilter = filter.toLowerCase()
    return styles.filter(([prop]) => prop.toLowerCase().includes(lowerFilter))
  }, [snapshot.computedStyle, filter])

  // Inline styles
  const inlineStyles = Object.entries(snapshot.inlineStyle)

  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%' }}>
      {/* Controls */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter properties..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            flex: 1,
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '6px 8px',
            color: '#c9d1d9',
            fontSize: '12px',
          }}
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'important' | 'all')}
          style={{
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '6px 8px',
            color: '#c9d1d9',
            fontSize: '12px',
          }}
        >
          <option value="important">Important</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Inline Styles */}
      {inlineStyles.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>
            Inline Styles ({inlineStyles.length})
          </div>
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
              {inlineStyles.map(([property, value]) => (
                <div
                  key={property}
                  style={{
                    marginBottom: '6px',
                    padding: '4px',
                    borderRadius: '2px',
                    background: '#161b22',
                    cursor: 'pointer',
                  }}
                  onClick={() => copyToClipboard(`${property}: ${value};`)}
                  title="Click to copy"
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
      )}

      {/* Computed Styles */}
      <div>
        <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>
          Computed Styles ({filteredStyles.length})
        </div>
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
            {filteredStyles.length === 0 ? (
              <div style={{ color: '#8b949e', textAlign: 'center', padding: '16px' }}>
                No styles match filter
              </div>
            ) : (
              filteredStyles.map(([property, value]) => (
                <div
                  key={property}
                  style={{
                    marginBottom: '6px',
                    padding: '4px',
                    borderRadius: '2px',
                    background: '#161b22',
                    cursor: 'pointer',
                  }}
                  onClick={() => copyToClipboard(`${property}: ${value};`)}
                  title="Click to copy"
                >
                  <span style={{ color: '#79c0ff' }}>{property}</span>
                  <span style={{ color: '#8b949e' }}>: </span>
                  <span style={{ color: '#a5d6ff' }}>{value}</span>
                  <span style={{ color: '#8b949e' }}>;</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

