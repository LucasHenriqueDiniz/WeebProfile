import { useState, useEffect, useCallback, useRef } from 'react'
import { api, type Plugin } from './lib/api'
import PluginSelector from './components/PluginSelector'
import SectionSelector from './components/SectionSelector'
import ReactPreview from './components/ReactPreview'
import SvgPreview from './components/SvgPreview'
import CssClasses from './components/CssClasses'
import SectionConfig from './components/SectionConfig'
import ElementInspector, { type InspectedElement } from './components/ElementInspector'

type Tab = 'react' | 'svg' | 'classes'

function App() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [selectedPlugin, setSelectedPlugin] = useState<string>('myanimelist')
  const [selectedSection, setSelectedSection] = useState<string>('statistics')
  const [style, setStyle] = useState<'default' | 'terminal'>('default')
  const [size, setSize] = useState<'half' | 'full'>('half')
  const [activeTab, setActiveTab] = useState<Tab>('react')
  const [svgData, setSvgData] = useState<{ svg: string; height: number; width: number } | null>(null)
  const [reactData, setReactData] = useState<{ html: string; css: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [serverConnected, setServerConnected] = useState(false)
  const [serverStartTime, setServerStartTime] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sectionConfig, setSectionConfig] = useState<Record<string, any>>({})
  const [previewBackground, setPreviewBackground] = useState<'light' | 'dark'>('dark')
  const [inspectedElement, setInspectedElement] = useState<InspectedElement | null>(null)
  const [inspectMode, setInspectMode] = useState(false)
  const [hoveredSelector, setHoveredSelector] = useState<string | null>(null)

  // Generate previews - use ref to always get latest sectionConfig without causing re-renders
  const sectionConfigRef = useRef(sectionConfig)
  useEffect(() => {
    sectionConfigRef.current = sectionConfig
  }, [sectionConfig])

  const generatePreviews = useCallback(async () => {
    if (!selectedPlugin || !selectedSection) return

    setLoading(true)
    setError(null)
    try {
      const [svgResult, reactResult] = await Promise.all([
        api.generateSvg({ plugin: selectedPlugin, section: selectedSection, style, size, sectionConfig: sectionConfigRef.current }),
        api.generateReact({ plugin: selectedPlugin, section: selectedSection, style, size, sectionConfig: sectionConfigRef.current }),
      ])

      setSvgData(svgResult)
      setReactData(reactResult)
      setLastUpdate(new Date())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate previews'
      setError(errorMessage)
      console.error('Error generating previews:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedPlugin, selectedSection, style, size])

  // Store generatePreviews in ref to avoid dependency issues
  const generatePreviewsRef = useRef(generatePreviews)
  useEffect(() => {
    generatePreviewsRef.current = generatePreviews
  }, [generatePreviews])

  // Check server connection and detect restarts
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('/health')
        if (response.ok) {
          const data = await response.json()
          setServerConnected(true)
          
          // Detect server restart by comparing serverStartTime
          if (data.serverStartTime) {
            if (serverStartTime !== null && serverStartTime !== data.serverStartTime) {
              // Server restarted! Regenerate previews
              console.log('🔄 Server restarted, regenerating previews...')
              generatePreviewsRef.current()
            }
            setServerStartTime(data.serverStartTime)
          }
        }
      } catch (error) {
        setServerConnected(false)
        console.debug('Server not ready yet:', error)
      }
    }

    checkServer()
    const interval = setInterval(checkServer, 1000)
    return () => clearInterval(interval)
  }, [serverStartTime])

  // Load plugins on mount
  useEffect(() => {
    if (!serverConnected) return

    const loadPlugins = async () => {
      try {
        const data = await api.getPlugins()
        setPlugins(data.plugins)
        if (data.plugins.length > 0) {
          // Only set if plugin doesn't exist in the list
          const pluginExists = data.plugins.some(p => p.name === selectedPlugin)
          if (!pluginExists) {
            setSelectedPlugin(data.plugins[0].name)
            const firstSection = data.plugins[0].sections[0]?.id
            if (firstSection) {
              setSelectedSection(firstSection)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load plugins:', error)
      }
    }

    loadPlugins()
  }, [serverConnected])

  // Update section automatically when plugin changes
  useEffect(() => {
    if (plugins.length === 0) return
    const currentPlugin = plugins.find((p) => p.name === selectedPlugin)
    if (currentPlugin && currentPlugin.sections.length > 0) {
      const firstSection = currentPlugin.sections[0]?.id
      if (firstSection) {
        // Check if current section exists in new plugin, otherwise use first section
        const sectionExists = currentPlugin.sections.some(s => s.id === selectedSection)
        if (!sectionExists) {
          setSelectedSection(firstSection)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlugin, plugins])

  // Reset section config when plugin or section changes
  useEffect(() => {
    setSectionConfig({})
  }, [selectedPlugin, selectedSection])

  // Generate on mount and when selection changes (but not when sectionConfig changes)
  useEffect(() => {
    generatePreviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlugin, selectedSection, style, size])


  const currentPlugin = plugins.find((p) => p.name === selectedPlugin)
  const sections = currentPlugin?.sections || []

  // Show loading state if server not connected
  if (!serverConnected) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#58a6ff', marginBottom: '16px' }}>🔍 Weeb Debug Tool</h1>
        <p style={{ color: '#8b949e' }}>Connecting to server...</p>
        <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '8px' }}>
          Make sure the backend server is running on port 5001
        </p>
      </div>
    )
  }

  // Show loading state if plugins not loaded yet
  if (plugins.length === 0 && !loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#58a6ff', marginBottom: '16px' }}>🔍 Weeb Debug Tool</h1>
        <p style={{ color: '#8b949e' }}>Loading plugins...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '20px', padding: '20px', background: '#161b22', borderRadius: '8px', border: '1px solid #30363d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#58a6ff', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '4px' }}>🔍 Weeb Debug Tool</h1>
            <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Visualize and inspect plugin sections in real-time</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: serverConnected ? '#3fb950' : '#f85149',
                  boxShadow: serverConnected ? '0 0 8px #3fb950' : 'none',
                }}
              />
              <span style={{ fontSize: '12px', color: '#8b949e' }}>
                {serverConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {lastUpdate && (
              <span style={{ fontSize: '11px', color: '#6e7681' }}>
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div
            style={{
              background: '#1c2128',
              border: '1px solid #f85149',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#f85149' }}>⚠️</span>
            <span style={{ color: '#f85149', fontSize: '14px' }}>{error}</span>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <PluginSelector
            plugins={plugins}
            selected={selectedPlugin}
            onChange={setSelectedPlugin}
          />
          
          <SectionSelector
            sections={sections}
            selected={selectedSection}
            onChange={setSelectedSection}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#8b949e', textTransform: 'uppercase' }}>Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as 'default' | 'terminal')}
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                padding: '8px 12px',
                color: '#c9d1d9',
                fontSize: '14px',
                minWidth: '120px',
                cursor: 'pointer',
              }}
            >
              <option value="default">Default</option>
              <option value="terminal">Terminal</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#8b949e', textTransform: 'uppercase' }}>Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as 'half' | 'full')}
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                padding: '8px 12px',
                color: '#c9d1d9',
                fontSize: '14px',
                minWidth: '120px',
                cursor: 'pointer',
              }}
            >
              <option value="half">Half</option>
              <option value="full">Full</option>
            </select>
          </div>

          <button
            onClick={generatePreviews}
            disabled={loading}
            style={{
              background: loading ? '#30363d' : '#238636',
              border: '1px solid',
              borderColor: loading ? '#30363d' : '#2ea043',
              borderRadius: '4px',
              padding: '8px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = '#2ea043'
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = '#238636'
            }}
          >
            {loading ? (
              <>
                <span>⏳</span>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>

        {/* Section Configuration */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #30363d', paddingTop: '20px' }}>
          <SectionConfig
            pluginName={selectedPlugin}
            sectionId={selectedSection}
            config={sectionConfig}
            onChange={setSectionConfig}
          />
        </div>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #30363d', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['react', 'svg', 'classes'] as Tab[]).map((tab) => {
              const icons: Record<Tab, string> = {
                react: '⚛️',
                svg: '🖼️',
                classes: '🎨',
              }
              const labels: Record<Tab, string> = {
                react: 'React Preview',
                svg: 'SVG Preview',
                classes: 'CSS Classes',
              }
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setInspectedElement(null) // Close inspector when switching tabs
                }}
                style={{
                  padding: '10px 20px',
                  background: activeTab === tab ? '#1c2128' : 'transparent',
                  border: 'none',
                  color: activeTab === tab ? '#58a6ff' : '#8b949e',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? '600' : '500',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.color = '#c9d1d9'
                    e.currentTarget.style.background = '#21262d'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.color = '#8b949e'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{icons[tab]}</span>
                <span>{labels[tab]}</span>
                {activeTab === tab && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '2px',
                      background: '#58a6ff',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </button>
            )
          })}
          </div>
          {(activeTab === 'react' || activeTab === 'svg') && (
            <>
              <button
                onClick={() => {
                  setInspectMode(!inspectMode)
                  if (inspectMode) {
                    setInspectedElement(null)
                    setHoveredSelector(null)
                  }
                }}
                style={{
                  padding: '8px 16px',
                  background: inspectMode ? '#1a472a' : '#21262d',
                  border: `1px solid ${inspectMode ? '#238636' : '#30363d'}`,
                  borderRadius: '4px',
                  color: inspectMode ? '#3fb950' : '#c9d1d9',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!inspectMode) {
                    e.currentTarget.style.background = '#30363d'
                    e.currentTarget.style.borderColor = '#484f58'
                  }
                }}
                onMouseOut={(e) => {
                  if (!inspectMode) {
                    e.currentTarget.style.background = '#21262d'
                    e.currentTarget.style.borderColor = '#30363d'
                  }
                }}
              >
                <span>{inspectMode ? '✅' : '🔍'}</span>
                <span>{inspectMode ? 'Inspecting' : 'Inspect'}</span>
              </button>
              <button
                onClick={() => setPreviewBackground(previewBackground === 'dark' ? 'light' : 'dark')}
                style={{
                  padding: '8px 16px',
                  background: '#21262d',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#30363d'
                  e.currentTarget.style.borderColor = '#484f58'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#21262d'
                  e.currentTarget.style.borderColor = '#30363d'
                }}
              >
                <span>{previewBackground === 'dark' ? '🌙' : '☀️'}</span>
                <span>{previewBackground === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        {activeTab === 'react' && reactData && (
          <ReactPreview 
            html={reactData.html} 
            css={reactData.css} 
            background={previewBackground}
            onElementClick={inspectMode ? setInspectedElement : undefined}
            inspectedSelector={inspectedElement?.selector || null}
            inspectMode={inspectMode}
            hoveredSelector={hoveredSelector}
            onElementHover={inspectMode ? setHoveredSelector : undefined}
          />
        )}
        {activeTab === 'react' && !reactData && !loading && (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#8b949e' }}>No React preview available. Click Refresh to generate.</p>
          </div>
        )}
        {activeTab === 'svg' && svgData && (
          <SvgPreview 
            svg={svgData.svg} 
            height={svgData.height} 
            width={svgData.width} 
            background={previewBackground}
            onElementClick={inspectMode ? setInspectedElement : undefined}
            inspectedSelector={inspectedElement?.selector || null}
            inspectMode={inspectMode}
            hoveredSelector={hoveredSelector}
            onElementHover={inspectMode ? setHoveredSelector : undefined}
          />
        )}
        {activeTab === 'svg' && !svgData && !loading && (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#8b949e' }}>No SVG preview available. Click Refresh to generate.</p>
          </div>
        )}
        {activeTab === 'classes' && reactData && (
          <CssClasses html={reactData.html} />
        )}
        {activeTab === 'classes' && !reactData && !loading && (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#8b949e' }}>No React preview available. Click Refresh to generate.</p>
          </div>
        )}
      </div>

      {/* Element Inspector */}
      <ElementInspector element={inspectedElement} onClose={() => setInspectedElement(null)} />
    </div>
  )
}

export default App

