import { useEffect, useRef, useState } from 'react'
import { api, type HeightCalculationResponse } from '../lib/api'

interface HeightDebugProps {
  svg: string
  reactHtml: string
  svgHeight: number
  plugin?: string
  section?: string
  style?: string
  size?: 'half' | 'full'
  sectionConfig?: Record<string, any>
}

interface ElementMeasurement {
  selector: string
  height: number
  width: number
  top: number
  left: number
  className?: string
  id?: string
}

export default function HeightDebug({ 
  svg, 
  reactHtml, 
  svgHeight,
  plugin,
  section,
  style = 'default',
  size = 'half',
  sectionConfig = {},
}: HeightDebugProps) {
  const svgRef = useRef<HTMLDivElement>(null)
  const reactRef = useRef<HTMLDivElement>(null)
  const [reactHeight, setReactHeight] = useState(0)
  const [measurements, setMeasurements] = useState<{
    svg: ElementMeasurement[]
    react: ElementMeasurement[]
    mismatches: Array<{ selector: string; svgHeight: number; reactHeight: number; diff: number }>
    sections?: Array<{ sectionId: string; sectionName: string; svgHeight: number; reactHeight: number; diff: number; top: number }>
  } | null>(null)
  const [calculationDetails, setCalculationDetails] = useState<HeightCalculationResponse | null>(null)
  const [loadingCalculation, setLoadingCalculation] = useState(false)

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = svg
    }
  }, [svg])

  useEffect(() => {
    if (reactRef.current) {
      reactRef.current.innerHTML = reactHtml
      // Measure height after render
      setTimeout(() => {
        setReactHeight(reactRef.current?.scrollHeight || 0)
      }, 100)
    }
  }, [reactHtml])

  // Load calculation details when component mounts or when relevant props change
  useEffect(() => {
    if (plugin && section) {
      console.log('📊 Loading height calculation details for:', { plugin, section, style, size, sectionConfig })
      setLoadingCalculation(true)
      api.getHeightCalculation({
        plugin,
        section,
        style,
        size,
        sectionConfig,
      })
        .then((details) => {
          console.log('✅ Height calculation details loaded:', details)
          setCalculationDetails(details)
          setLoadingCalculation(false)
        })
        .catch((error) => {
          console.error('❌ Failed to load calculation details:', error)
          setLoadingCalculation(false)
        })
    } else {
      console.log('⚠️ Plugin or section not provided:', { plugin, section })
    }
  }, [plugin, section, style, size, JSON.stringify(sectionConfig)])

  interface SectionMeasurement {
    sectionId: string
    sectionName: string
    svgHeight: number
    reactHeight: number
    diff: number
    top: number
  }

  const measureElements = () => {
    if (!svgRef.current || !reactRef.current) return

    const svgContainer = svgRef.current.querySelector('#svg-main') || svgRef.current
    const reactContainer = reactRef.current.querySelector('#svg-main') || reactRef.current

    // Measure sections (elements with tag 'section' or with id starting with plugin prefix)
    const measureSections = (container: Element, type: 'svg' | 'react'): SectionMeasurement[] => {
      const sections: SectionMeasurement[] = []
      
      // Find all section elements
      const sectionElements = container.querySelectorAll('section')
      
      sectionElements.forEach((sectionEl) => {
        const rect = sectionEl.getBoundingClientRect()
        const sectionId = sectionEl.id || ''
        // Extract section name from ID (e.g., "mal-statistics" -> "statistics")
        const sectionName = sectionId
          .replace(/^(mal|gh|lfm)-/, '') // Remove plugin prefixes
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
          || 'Unknown Section'
        
        sections.push({
          sectionId: sectionId || 'unnamed-section',
          sectionName,
          svgHeight: type === 'svg' ? rect.height : 0,
          reactHeight: type === 'react' ? rect.height : 0,
          diff: 0,
          top: rect.top,
        })
      })

      return sections
    }

    const svgSections = measureSections(svgContainer as Element, 'svg')
    const reactSections = measureSections(reactContainer as Element, 'react')

    // Match sections by ID and compare heights
    const sectionMismatches: SectionMeasurement[] = []
    const reactSectionMap = new Map<string, SectionMeasurement>()
    
    reactSections.forEach(reactSection => {
      reactSectionMap.set(reactSection.sectionId, reactSection)
    })

    // Compare SVG sections with React sections
    svgSections.forEach(svgSection => {
      const reactSection = reactSectionMap.get(svgSection.sectionId)
      if (reactSection) {
        const diff = Math.abs(svgSection.svgHeight - reactSection.reactHeight)
        sectionMismatches.push({
          sectionId: svgSection.sectionId,
          sectionName: svgSection.sectionName,
          svgHeight: svgSection.svgHeight,
          reactHeight: reactSection.reactHeight,
          diff,
          top: svgSection.top,
        })
      } else {
        // Section exists in SVG but not in React
        sectionMismatches.push({
          sectionId: svgSection.sectionId,
          sectionName: svgSection.sectionName,
          svgHeight: svgSection.svgHeight,
          reactHeight: 0,
          diff: svgSection.svgHeight,
          top: svgSection.top,
        })
      }
    })

    // Also check for sections that exist in React but not in SVG
    reactSections.forEach(reactSection => {
      const svgSection = svgSections.find(s => s.sectionId === reactSection.sectionId)
      if (!svgSection) {
        sectionMismatches.push({
          sectionId: reactSection.sectionId,
          sectionName: reactSection.sectionName,
          svgHeight: 0,
          reactHeight: reactSection.reactHeight,
          diff: reactSection.reactHeight,
          top: reactSection.top,
        })
      }
    })

    // Also measure main container for overall comparison
    const svgMainRect = (svgContainer as Element).getBoundingClientRect()
    const reactMainRect = (reactContainer as Element).getBoundingClientRect()
    const mainDiff = Math.abs(svgMainRect.height - reactMainRect.height)

    // Convert to old format for compatibility, but prioritize sections
    const mismatches: Array<{ selector: string; svgHeight: number; reactHeight: number; diff: number }> = []
    
    if (mainDiff > 1) {
      mismatches.push({
        selector: '#svg-main',
        svgHeight: svgMainRect.height,
        reactHeight: reactMainRect.height,
        diff: mainDiff,
      })
    }

    // Add section mismatches
    sectionMismatches.forEach(section => {
      if (section.diff > 1) {
        mismatches.push({
          selector: `section#${section.sectionId}`,
          svgHeight: section.svgHeight,
          reactHeight: section.reactHeight,
          diff: section.diff,
        })
      }
    })

    setMeasurements({
      svg: [], // Not used anymore, but keeping for compatibility
      react: [], // Not used anymore, but keeping for compatibility
      mismatches,
      sections: sectionMismatches, // New: section-based measurements
    } as any)

    // Log to console
    console.group('📏 Section Measurements')
    console.log('SVG Sections:', svgSections)
    console.log('React Sections:', reactSections)
    if (sectionMismatches.length > 0) {
      console.warn('⚠️ Section Height Mismatches Found:', sectionMismatches)
    } else {
      console.log('✅ No section height mismatches detected')
    }
    console.groupEnd()
  }

  const exportMismatchReport = () => {
    if (!measurements || measurements.mismatches.length === 0) {
      alert('No mismatches found. Please click "Measure Elements" first.')
      return
    }

    const report = `# Height Mismatch Report

Generated: ${new Date().toLocaleString()}

## Summary

- **Total Mismatches**: ${measurements.mismatches.length}
- **SVG Height**: ${svgHeight}px
- **React Height**: ${reactHeight}px
- **Difference**: ${Math.abs(svgHeight - reactHeight)}px

## Mismatches Detected

${measurements.mismatches.map((mismatch, index) => `
### Mismatch #${index + 1}: \`${mismatch.selector}\`

- **SVG Height**: ${mismatch.svgHeight.toFixed(1)}px
- **React Height**: ${mismatch.reactHeight.toFixed(1)}px
- **Difference**: ${mismatch.diff.toFixed(1)}px

**Issue**: The hardcoded height calculation in the SVG generation method doesn't match the actual React render height.

**Recommendation**: Update the hardcoded height calculation for \`${mismatch.selector}\` to use ${mismatch.reactHeight.toFixed(1)}px instead of ${mismatch.svgHeight.toFixed(1)}px.
`).join('\n')}

## Detailed Measurements

### SVG Elements (${measurements.svg.length} total)

${measurements.svg.slice(0, 50).map((m, i) => `- \`${m.selector}\`: ${m.height.toFixed(1)}px × ${m.width.toFixed(1)}px`).join('\n')}
${measurements.svg.length > 50 ? `\n... and ${measurements.svg.length - 50} more elements` : ''}

### React Elements (${measurements.react.length} total)

${measurements.react.slice(0, 50).map((m, i) => `- \`${m.selector}\`: ${m.height.toFixed(1)}px × ${m.width.toFixed(1)}px`).join('\n')}
${measurements.react.length > 50 ? `\n... and ${measurements.react.length - 50} more elements` : ''}

---

**Note**: This report was generated by the Weeb Debug Tool. Use the React render heights as the source of truth for fixing hardcoded height calculations.
`

    // Create and download file
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `height-mismatch-report-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const diff = Math.abs(svgHeight - reactHeight)

  return (
    <div
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#58a6ff' }}>Height Comparison</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={measureElements}
            style={{
              background: '#238636',
              border: '1px solid #2ea043',
              borderRadius: '4px',
              padding: '8px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#2ea043')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#238636')}
          >
            📏 Measure Elements
          </button>
          {measurements && measurements.mismatches.length > 0 && (
            <button
              onClick={exportMismatchReport}
              style={{
                background: '#1f6feb',
                border: '1px solid #388bfd',
                borderRadius: '4px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#388bfd')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#1f6feb')}
            >
              📄 Export Report
            </button>
          )}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ background: '#161b22', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#c9d1d9', margin: 0 }}>SVG</h3>
            <span style={{ background: '#21262d', border: '1px solid #30363d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#58a6ff', fontFamily: 'monospace' }}>
              {svgHeight}px
            </span>
          </div>
          <div
            ref={svgRef}
            style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: `${Math.max(svgHeight, 200)}px`,
              overflow: 'auto',
            }}
          />
        </div>

        <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ background: '#161b22', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#c9d1d9', margin: 0 }}>React</h3>
            <span style={{ background: '#21262d', border: '1px solid #30363d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#58a6ff', fontFamily: 'monospace' }}>
              {reactHeight}px
            </span>
          </div>
          <div
            ref={reactRef}
            style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: `${Math.max(reactHeight, 200)}px`,
              overflow: 'auto',
            }}
          />
        </div>
      </div>

      {/* Height Calculation Details */}
      {calculationDetails && calculationDetails.details && (
        <div style={{ 
          background: '#21262d', 
          border: '1px solid #30363d', 
          borderRadius: '4px', 
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#58a6ff', margin: 0 }}>
              📊 Height Calculation Details
            </h3>
            <span style={{ 
              background: calculationDetails.source === 'plugin-calculator' ? '#238636' : '#7c3aed',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              color: 'white',
            }}>
              {calculationDetails.source === 'plugin-calculator' ? 'Plugin Calculator' : 'Estimated'}
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#8b949e', fontSize: '12px' }}>Calculated Height:</span>
              <span style={{ color: '#58a6ff', fontSize: '12px', fontWeight: '600', fontFamily: 'monospace' }}>
                {calculationDetails.height}px
              </span>
            </div>
            {calculationDetails.details.titleHeight !== undefined && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8b949e', fontSize: '12px' }}>Title Height:</span>
                <span style={{ color: '#c9d1d9', fontSize: '12px', fontFamily: 'monospace' }}>
                  {calculationDetails.details.titleHeight}px
                </span>
              </div>
            )}
            {calculationDetails.details.contentHeight !== undefined && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8b949e', fontSize: '12px' }}>Content Height:</span>
                <span style={{ color: '#c9d1d9', fontSize: '12px', fontFamily: 'monospace' }}>
                  {calculationDetails.details.contentHeight}px
                </span>
              </div>
            )}
            {calculationDetails.details.itemCount !== undefined && calculationDetails.details.itemCount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8b949e', fontSize: '12px' }}>Items:</span>
                <span style={{ color: '#c9d1d9', fontSize: '12px', fontFamily: 'monospace' }}>
                  {calculationDetails.details.itemCount}
                  {calculationDetails.details.itemHeight && ` × ${calculationDetails.details.itemHeight}px`}
                </span>
              </div>
            )}
            {calculationDetails.details.gaps !== undefined && calculationDetails.details.gaps > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8b949e', fontSize: '12px' }}>Gaps:</span>
                <span style={{ color: '#c9d1d9', fontSize: '12px', fontFamily: 'monospace' }}>
                  {calculationDetails.details.gaps}px
                </span>
              </div>
            )}
          </div>

          {calculationDetails.details.breakdown && calculationDetails.details.breakdown.length > 0 && (
            <div style={{ 
              background: '#161b22', 
              border: '1px solid #30363d', 
              borderRadius: '4px', 
              padding: '12px',
              marginTop: '12px',
            }}>
              <div style={{ color: '#8b949e', fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>
                Calculation Breakdown:
              </div>
              {calculationDetails.details.breakdown.map((line, index) => (
                <div 
                  key={index}
                  style={{ 
                    color: '#c9d1d9', 
                    fontSize: '11px', 
                    fontFamily: 'monospace',
                    marginBottom: '4px',
                    paddingLeft: '8px',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loadingCalculation && (
        <div style={{ 
          background: '#21262d', 
          border: '1px solid #30363d', 
          borderRadius: '4px', 
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#8b949e',
          fontSize: '12px',
        }}>
          Loading calculation details...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: '4px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#c9d1d9' }}>Height Difference</span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: diff > 10 ? '#f85149' : '#3fb950',
                fontFamily: 'monospace',
              }}
            >
              {diff}px
            </span>
          </div>
        </div>

        {measurements && (
          <div style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: '4px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#c9d1d9' }}>Mismatches Found</span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: measurements.mismatches.length > 0 ? '#f85149' : '#3fb950',
                  fontFamily: 'monospace',
                }}
              >
                {measurements.mismatches.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Section-based Height Comparison */}
      {measurements && measurements.sections && measurements.sections.length > 0 && (
        <div style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#58a6ff', marginBottom: '12px', marginTop: 0 }}>
            📊 Height by Section
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
            {measurements.sections
              .sort((a, b) => a.top - b.top) // Sort by position
              .map((section, index) => {
                const hasMismatch = section.diff > 1
                return (
                  <div
                    key={index}
                    style={{
                      background: hasMismatch ? '#1c2128' : '#161b22',
                      border: `1px solid ${hasMismatch ? '#f85149' : '#30363d'}`,
                      borderRadius: '4px',
                      padding: '12px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ 
                      color: hasMismatch ? '#f85149' : '#c9d1d9', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      fontSize: '13px',
                    }}>
                      {section.sectionName}
                      {hasMismatch && <span style={{ marginLeft: '8px', fontSize: '11px' }}>⚠️</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', color: '#8b949e', fontSize: '11px' }}>
                      <div>
                        <div style={{ color: '#6e7681', marginBottom: '2px' }}>SVG</div>
                        <div style={{ color: '#f85149', fontFamily: 'monospace', fontWeight: '600' }}>
                          {section.svgHeight.toFixed(1)}px
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#6e7681', marginBottom: '2px' }}>React</div>
                        <div style={{ color: '#3fb950', fontFamily: 'monospace', fontWeight: '600' }}>
                          {section.reactHeight.toFixed(1)}px
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#6e7681', marginBottom: '2px' }}>Diff</div>
                        <div style={{ 
                          color: hasMismatch ? '#f85149' : '#8b949e', 
                          fontFamily: 'monospace', 
                          fontWeight: '600' 
                        }}>
                          {section.diff > 0 ? (section.diff > 0 ? '+' : '') : ''}{section.diff.toFixed(1)}px
                        </div>
                      </div>
                    </div>
                    {section.sectionId && (
                      <div style={{ 
                        marginTop: '8px', 
                        paddingTop: '8px', 
                        borderTop: '1px solid #30363d',
                        fontSize: '10px',
                        color: '#6e7681',
                        fontFamily: 'monospace',
                      }}>
                        ID: {section.sectionId}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Legacy element-based mismatches (for non-section elements) */}
      {measurements && measurements.mismatches.length > 0 && (
        <div style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f85149', marginBottom: '12px', marginTop: 0 }}>
            ⚠️ Other Height Mismatches
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {measurements.mismatches
              .filter(m => !m.selector.startsWith('section#')) // Filter out sections (already shown above)
              .map((mismatch, index) => (
                <div
                  key={index}
                  style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    padding: '12px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ color: '#c9d1d9', marginBottom: '4px', fontFamily: 'monospace', fontWeight: '600' }}>
                    {mismatch.selector}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: '#8b949e' }}>
                    <span>SVG: <span style={{ color: '#f85149' }}>{mismatch.svgHeight.toFixed(1)}px</span></span>
                    <span>React: <span style={{ color: '#3fb950' }}>{mismatch.reactHeight.toFixed(1)}px</span></span>
                    <span>Diff: <span style={{ color: '#f85149', fontWeight: '600' }}>{mismatch.diff.toFixed(1)}px</span></span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {measurements && (
        <div style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
          <details>
            <summary style={{ cursor: 'pointer', color: '#58a6ff', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
              📊 Detailed Measurements (click to expand)
            </summary>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
              <div>
                <h4 style={{ color: '#c9d1d9', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>SVG Elements ({measurements.svg.length})</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '11px', fontFamily: 'monospace' }}>
                  {measurements.svg.slice(0, 20).map((m, i) => (
                    <div key={i} style={{ color: '#8b949e', marginBottom: '4px', padding: '4px', background: '#161b22', borderRadius: '2px' }}>
                      {m.selector}: {m.height.toFixed(1)}px × {m.width.toFixed(1)}px
                    </div>
                  ))}
                  {measurements.svg.length > 20 && (
                    <div style={{ color: '#8b949e', fontStyle: 'italic' }}>... and {measurements.svg.length - 20} more</div>
                  )}
                </div>
              </div>
              <div>
                <h4 style={{ color: '#c9d1d9', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>React Elements ({measurements.react.length})</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '11px', fontFamily: 'monospace' }}>
                  {measurements.react.slice(0, 20).map((m, i) => (
                    <div key={i} style={{ color: '#8b949e', marginBottom: '4px', padding: '4px', background: '#161b22', borderRadius: '2px' }}>
                      {m.selector}: {m.height.toFixed(1)}px × {m.width.toFixed(1)}px
                    </div>
                  ))}
                  {measurements.react.length > 20 && (
                    <div style={{ color: '#8b949e', fontStyle: 'italic' }}>... and {measurements.react.length - 20} more</div>
                  )}
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}



