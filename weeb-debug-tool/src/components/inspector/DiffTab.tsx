/**
 * Diff Tab
 * 
 * Shows CSS differences: classes, variables, and computed styles
 */

import { useState, useMemo } from 'react'
import type { StyleSnapshot } from '../../lib/iframe/iframeProtocol'

interface DiffTabProps {
  reactSnapshot: StyleSnapshot | null
  svgSnapshot: StyleSnapshot | null
}

export default function DiffTab({ reactSnapshot, svgSnapshot }: DiffTabProps) {
  const [filter, setFilter] = useState<'all' | 'different' | 'missing'>('different')

  // Compare classes
  const classDiff = useMemo(() => {
    if (!reactSnapshot) return null

    const reactClasses = new Set(reactSnapshot.classList || [])
    const svgClasses = svgSnapshot ? new Set(svgSnapshot.classList || []) : new Set<string>()

    const onlyInReact = Array.from(reactClasses).filter((cls) => !svgClasses.has(cls))
    const onlyInSvg = Array.from(svgClasses).filter((cls) => !reactClasses.has(cls))
    const inBoth = Array.from(reactClasses).filter((cls) => svgClasses.has(cls))

    return {
      onlyInReact,
      onlyInSvg,
      inBoth,
      totalReact: reactClasses.size,
      totalSvg: svgClasses.size,
    }
  }, [reactSnapshot, svgSnapshot])

  // Compare CSS vars
  const varsDiff = useMemo(() => {
    if (!reactSnapshot) return null

    const reactVars = Object.keys(reactSnapshot.cssVars || {})
    const svgVars = svgSnapshot ? Object.keys(svgSnapshot.cssVars || {}) : []

    const reactVarsSet = new Set(reactVars)
    const svgVarsSet = new Set(svgVars)

    const onlyInReact = reactVars.filter((v) => !svgVarsSet.has(v))
    const onlyInSvg = svgVars.filter((v) => !reactVarsSet.has(v))
    const inBoth = reactVars.filter((v) => svgVarsSet.has(v))

    // Also compare values for vars in both
    const valueDiffs: Array<{ var: string; reactValue: string; svgValue: string }> = []
    inBoth.forEach((v) => {
      const reactValue = reactSnapshot.cssVars?.[v] || ''
      const svgValue = svgSnapshot?.cssVars?.[v] || ''
      if (reactValue !== svgValue) {
        valueDiffs.push({ var: v, reactValue, svgValue })
      }
    })

    return {
      onlyInReact,
      onlyInSvg,
      inBoth,
      valueDiffs,
      totalReact: reactVars.length,
      totalSvg: svgVars.length,
    }
  }, [reactSnapshot, svgSnapshot])

  // Compare computed styles (simplified - only show differences)
  const styleDiff = useMemo(() => {
    if (!reactSnapshot || !svgSnapshot) return null

    const reactStyles = reactSnapshot.computedStyle || {}
    const svgStyles = svgSnapshot.computedStyle || {}

    const diffs: Array<{ prop: string; reactValue: string; svgValue: string }> = []
    const allProps = new Set([...Object.keys(reactStyles), ...Object.keys(svgStyles)])

    allProps.forEach((prop) => {
      const reactValue = reactStyles[prop] || ''
      const svgValue = svgStyles[prop] || ''
      if (reactValue !== svgValue) {
        diffs.push({ prop, reactValue, svgValue })
      }
    })

    return diffs
  }, [reactSnapshot, svgSnapshot])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error)
  }

  if (!reactSnapshot) {
    return (
      <div style={{ padding: '16px', color: '#8b949e', textAlign: 'center' }}>
        Select an element in the React preview to see differences
      </div>
    )
  }

  const hasDifferences = (classDiff?.onlyInReact.length || 0) > 0 || (classDiff?.onlyInSvg.length || 0) > 0 || 
                         (varsDiff?.onlyInReact.length || 0) > 0 || (varsDiff?.onlyInSvg.length || 0) > 0 ||
                         (varsDiff?.valueDiffs.length || 0) > 0 || (styleDiff?.length || 0) > 0

  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%' }}>
      {/* Filter */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            flex: 1,
            background: filter === 'all' ? '#21262d' : 'transparent',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '6px 8px',
            color: filter === 'all' ? '#58a6ff' : '#8b949e',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('different')}
          style={{
            flex: 1,
            background: filter === 'different' ? '#21262d' : 'transparent',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '6px 8px',
            color: filter === 'different' ? '#58a6ff' : '#8b949e',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Differences
        </button>
        <button
          onClick={() => setFilter('missing')}
          style={{
            flex: 1,
            background: filter === 'missing' ? '#21262d' : 'transparent',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '6px 8px',
            color: filter === 'missing' ? '#58a6ff' : '#8b949e',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Missing
        </button>
      </div>

      {/* Classes Diff */}
      {classDiff && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>
            Classes (React: {classDiff.totalReact}, SVG: {classDiff.totalSvg})
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
            {(filter === 'all' || filter === 'missing') && classDiff.onlyInReact.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#f0883e', marginBottom: '4px', fontWeight: '600' }}>
                  Only in React ({classDiff.onlyInReact.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {classDiff.onlyInReact.map((cls) => (
                    <span
                      key={cls}
                      onClick={() => copyToClipboard(cls)}
                      style={{
                        background: '#f0883e20',
                        border: '1px solid #f0883e',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#f0883e',
                        cursor: 'pointer',
                      }}
                      title="Click to copy"
                    >
                      .{cls}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(filter === 'all' || filter === 'missing') && classDiff.onlyInSvg.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#58a6ff', marginBottom: '4px', fontWeight: '600' }}>
                  Only in SVG ({classDiff.onlyInSvg.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {classDiff.onlyInSvg.map((cls) => (
                    <span
                      key={cls}
                      onClick={() => copyToClipboard(cls)}
                      style={{
                        background: '#58a6ff20',
                        border: '1px solid #58a6ff',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#58a6ff',
                        cursor: 'pointer',
                      }}
                      title="Click to copy"
                    >
                      .{cls}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {filter === 'all' && classDiff.inBoth.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '4px', fontWeight: '600' }}>
                  In Both ({classDiff.inBoth.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {classDiff.inBoth.slice(0, 20).map((cls) => (
                    <span
                      key={cls}
                      onClick={() => copyToClipboard(cls)}
                      style={{
                        background: '#21262d',
                        border: '1px solid #30363d',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#c9d1d9',
                        cursor: 'pointer',
                      }}
                      title="Click to copy"
                    >
                      .{cls}
                    </span>
                  ))}
                  {classDiff.inBoth.length > 20 && (
                    <span style={{ color: '#8b949e', fontSize: '11px' }}>
                      +{classDiff.inBoth.length - 20} more
                    </span>
                  )}
                </div>
              </div>
            )}
            {!hasDifferences && filter === 'different' && (
              <div style={{ color: '#8b949e', textAlign: 'center', padding: '16px' }}>
                No class differences
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Variables Diff */}
      {varsDiff && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>
            CSS Variables (React: {varsDiff.totalReact}, SVG: {varsDiff.totalSvg})
          </div>
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '12px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {(filter === 'all' || filter === 'missing') && varsDiff.onlyInReact.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#f0883e', marginBottom: '4px', fontWeight: '600' }}>
                  Only in React ({varsDiff.onlyInReact.length})
                </div>
                <div style={{ fontFamily: 'Monaco, Menlo, monospace', fontSize: '11px' }}>
                  {varsDiff.onlyInReact.map((v) => {
                    const value = reactSnapshot.cssVars?.[v] || ''
                    return (
                      <div
                        key={v}
                        onClick={() => copyToClipboard(`${v}: ${value};`)}
                        style={{
                          marginBottom: '4px',
                          padding: '4px',
                          background: '#f0883e20',
                          borderRadius: '2px',
                          cursor: 'pointer',
                        }}
                        title="Click to copy"
                      >
                        <span style={{ color: '#f0883e' }}>{v}</span>
                        <span style={{ color: '#8b949e' }}>: </span>
                        <span style={{ color: '#a5d6ff' }}>{value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {(filter === 'all' || filter === 'missing') && varsDiff.onlyInSvg.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#58a6ff', marginBottom: '4px', fontWeight: '600' }}>
                  Only in SVG ({varsDiff.onlyInSvg.length})
                </div>
                <div style={{ fontFamily: 'Monaco, Menlo, monospace', fontSize: '11px' }}>
                  {varsDiff.onlyInSvg.map((v) => {
                    const value = svgSnapshot?.cssVars?.[v] || ''
                    return (
                      <div
                        key={v}
                        onClick={() => copyToClipboard(`${v}: ${value};`)}
                        style={{
                          marginBottom: '4px',
                          padding: '4px',
                          background: '#58a6ff20',
                          borderRadius: '2px',
                          cursor: 'pointer',
                        }}
                        title="Click to copy"
                      >
                        <span style={{ color: '#58a6ff' }}>{v}</span>
                        <span style={{ color: '#8b949e' }}>: </span>
                        <span style={{ color: '#a5d6ff' }}>{value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {varsDiff.valueDiffs.length > 0 && (filter === 'all' || filter === 'different') && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#f85149', marginBottom: '4px', fontWeight: '600' }}>
                  Different Values ({varsDiff.valueDiffs.length})
                </div>
                <div style={{ fontFamily: 'Monaco, Menlo, monospace', fontSize: '11px' }}>
                  {varsDiff.valueDiffs.map(({ var: v, reactValue, svgValue }) => (
                    <div
                      key={v}
                      onClick={() => copyToClipboard(`${v}: React="${reactValue}" SVG="${svgValue}"`)}
                      style={{
                        marginBottom: '4px',
                        padding: '4px',
                        background: '#f8514920',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                      title="Click to copy"
                    >
                      <span style={{ color: '#f85149' }}>{v}</span>
                      <div style={{ marginLeft: '8px', marginTop: '2px' }}>
                        <div style={{ color: '#f0883e' }}>React: {reactValue}</div>
                        <div style={{ color: '#58a6ff' }}>SVG: {svgValue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!hasDifferences && filter === 'different' && (
              <div style={{ color: '#8b949e', textAlign: 'center', padding: '16px' }}>
                No variable differences
              </div>
            )}
          </div>
        </div>
      )}

      {/* Style Differences Summary */}
      {styleDiff && styleDiff.length > 0 && (filter === 'all' || filter === 'different') && (
        <div>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>
            Computed Style Differences ({styleDiff.length})
          </div>
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto',
              fontSize: '11px',
              fontFamily: 'Monaco, Menlo, monospace',
            }}
          >
            {styleDiff.slice(0, 20).map(({ prop, reactValue, svgValue }) => (
              <div
                key={prop}
                onClick={() => copyToClipboard(`${prop}: React="${reactValue}" SVG="${svgValue}"`)}
                style={{
                  marginBottom: '4px',
                  padding: '4px',
                  background: '#21262d',
                  borderRadius: '2px',
                  cursor: 'pointer',
                }}
                title="Click to copy"
              >
                <span style={{ color: '#79c0ff' }}>{prop}</span>
                <div style={{ marginLeft: '8px', marginTop: '2px', fontSize: '10px' }}>
                  <div style={{ color: '#f0883e' }}>React: {reactValue || '(empty)'}</div>
                  <div style={{ color: '#58a6ff' }}>SVG: {svgValue || '(empty)'}</div>
                </div>
              </div>
            ))}
            {styleDiff.length > 20 && (
              <div style={{ color: '#8b949e', textAlign: 'center', marginTop: '8px' }}>
                +{styleDiff.length - 20} more differences
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
