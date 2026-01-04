/**
 * Main App Component (Refactored)
 * 
 * New layout with TopBar, PreviewSplit, and InspectorPanel
 */

import { useEffect, useCallback, useRef, useState } from 'react'
import { api, type Plugin } from './lib/api'
import TopBar from './components/TopBar/TopBar'
import PreviewSplit from './components/workspace/PreviewSplit'
import InspectorPanel from './components/inspector/InspectorPanel'
import { useDebugStore } from './store/debugStore'
import type { StyleSnapshot } from './lib/iframe/iframeProtocol'

function App() {
  const {
    plugin,
    section,
    style,
    size,
    dev,
    uiPreferences,
    selectedDebugId,
    hoveredDebugId,
    lastOutputs,
    setConfig,
    setLastOutputs,
    setSnapshot,
    getSnapshot,
    setSelectedDebugId,
    setHoveredDebugId,
    incrementRenderVersion,
  } = useDebugStore()

  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(false)
  const [serverConnected, setServerConnected] = useState(false)
  const [serverStartTime, setServerStartTime] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [reactSnapshot, setReactSnapshot] = useState<StyleSnapshot | null>(null)
  const [svgSnapshot, setSvgSnapshot] = useState<StyleSnapshot | null>(null)

  // Generate previews
  const generatePreviews = useCallback(async () => {
    if (!plugin || !section) return

    setLoading(true)
    setError(null)
    try {
      // Generate React HTML first (with debug IDs)
      const reactResult = await api.generateReact({
        plugin,
        section,
        style,
        size,
      })

      // Generate SVG using the HTML with debug IDs
      const svgResult = await api.generateSvg({
        plugin,
        section,
        style,
        size,
        html: reactResult.html, // Pass HTML with debug IDs
        css: reactResult.css, // Pass CSS
      })

      setLastOutputs({
        html: reactResult.html,
        css: reactResult.css,
        svg: svgResult.svg,
      })

      incrementRenderVersion() // Invalidate cache
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate previews'
      setError(errorMessage)
      console.error('Error generating previews:', error)
    } finally {
      setLoading(false)
    }
  }, [plugin, section, style, size, setLastOutputs, incrementRenderVersion])

  // Generate previews ref for server restart detection
  const generatePreviewsRef = useRef(generatePreviews)
  useEffect(() => {
    generatePreviewsRef.current = generatePreviews
  }, [generatePreviews])

  // Check server connection
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('/health')
        if (response.ok) {
          const data = await response.json()
          setServerConnected(true)

          if (data.serverStartTime) {
            if (serverStartTime !== null && serverStartTime !== data.serverStartTime) {
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
        const { plugins } = await api.getPlugins()
        setPlugins(plugins)
      } catch (error) {
        console.error('Error loading plugins:', error)
      }
    }

    loadPlugins()
  }, [serverConnected])

  // Auto-generate on config change
  useEffect(() => {
    if (plugin && section && serverConnected) {
      generatePreviews()
    }
  }, [plugin, section, style, size, dev, serverConnected])

  // Handle element selection from React preview
  const handleReactElementSelect = useCallback((snapshot: StyleSnapshot | null) => {
    setReactSnapshot(snapshot)
    if (snapshot?.debugId) {
      setSelectedDebugId(snapshot.debugId)
      // Try to get SVG snapshot from cache or request it
      const cached = getSnapshot(snapshot.debugId)
      if (cached) {
        setSvgSnapshot(cached.svg)
      }
    } else {
      setSelectedDebugId(null)
    }
  }, [setSelectedDebugId, getSnapshot])

  // Handle element selection from SVG preview
  const handleSvgElementSelect = useCallback((snapshot: StyleSnapshot | null) => {
    setSvgSnapshot(snapshot)
    if (snapshot?.debugId) {
      setSelectedDebugId(snapshot.debugId)
      // Try to get React snapshot from cache or request it
      const cached = getSnapshot(snapshot.debugId)
      if (cached) {
        setReactSnapshot(cached.react)
      }
    } else {
      setSelectedDebugId(null)
    }
  }, [setSelectedDebugId, getSnapshot])

  // Handle hover
  const handleElementHover = useCallback((debugId: string | null) => {
    setHoveredDebugId(debugId)
  }, [setHoveredDebugId])

  // Copy functions
  const handleCopySvg = useCallback(() => {
    if (lastOutputs?.svg) {
      navigator.clipboard.writeText(lastOutputs.svg)
    }
  }, [lastOutputs])

  const handleCopyHtml = useCallback(() => {
    if (lastOutputs?.html) {
      navigator.clipboard.writeText(lastOutputs.html)
    }
  }, [lastOutputs])

  if (!serverConnected) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          color: '#8b949e',
        }}
      >
        Waiting for server to start...
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          color: '#f85149',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Error</div>
        <div style={{ color: '#8b949e' }}>{error}</div>
        <button
          onClick={generatePreviews}
          style={{
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '8px 16px',
            color: '#c9d1d9',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0d1117',
        color: '#c9d1d9',
        overflow: 'hidden',
      }}
    >
      {/* Top Bar */}
      <TopBar
        plugins={plugins}
        onRegenerate={generatePreviews}
        onCopySvg={handleCopySvg}
        onCopyHtml={handleCopyHtml}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Workspace (with margin for inspector) */}
        <div
          style={{
            flex: 1,
            marginRight: reactSnapshot || svgSnapshot ? '400px' : 0,
            transition: 'margin-right 0.2s',
            overflow: 'hidden',
          }}
        >
          {lastOutputs ? (
            <PreviewSplit
              reactHtml={lastOutputs.html}
              reactCss={lastOutputs.css}
              svg={lastOutputs.svg}
              background={uiPreferences.previewBackground}
              onReactElementSelect={handleReactElementSelect}
              onSvgElementSelect={handleSvgElementSelect}
              selectedDebugId={uiPreferences.syncSelectionEnabled ? selectedDebugId : undefined}
              hoveredDebugId={uiPreferences.showHighlights ? hoveredDebugId : undefined}
              onElementHover={handleElementHover}
            />
          ) : loading ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b949e',
              }}
            >
              Loading...
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b949e',
              }}
            >
              Select a plugin and section to start
            </div>
          )}
        </div>

        {/* Inspector Panel */}
        {(reactSnapshot || svgSnapshot) && (
          <InspectorPanel
            reactSnapshot={reactSnapshot}
            svgSnapshot={svgSnapshot}
            css={lastOutputs?.css || ''}
            onClose={() => {
              setReactSnapshot(null)
              setSvgSnapshot(null)
              setSelectedDebugId(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App

