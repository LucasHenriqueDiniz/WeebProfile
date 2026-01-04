/**
 * Top Bar
 * 
 * Main control bar with plugin/section selectors, toggles, and actions
 */

import { useState } from 'react'
import type { Plugin } from '../../lib/api'
import { useDebugStore } from '../../store/debugStore'

interface TopBarProps {
  plugins: Plugin[]
  onRegenerate: () => void
  onCopySvg?: () => void
  onCopyHtml?: () => void
  onToggleConfig?: () => void
  configOpen?: boolean
}

export default function TopBar({ plugins, onRegenerate, onCopySvg, onCopyHtml, onToggleConfig, configOpen = false }: TopBarProps) {
  const {
    plugin,
    section,
    style,
    size,
    dev,
    uiPreferences,
    setConfig,
    setSyncSelectionEnabled,
    setShowHighlights,
    setDiffMode,
    setPreviewBackground,
  } = useDebugStore()

  const selectedPlugin = plugins.find((p) => p.name === plugin)
  const sections = selectedPlugin?.sections || []

  const handlePluginChange = (pluginName: string) => {
    const newPlugin = plugins.find((p) => p.name === pluginName)
    if (newPlugin && newPlugin.sections.length > 0) {
      setConfig({
        plugin: pluginName,
        section: newPlugin.sections[0]?.id || section,
        style,
        size,
        dev,
      })
    }
  }

  const handleSectionChange = (sectionId: string) => {
    setConfig({
      plugin,
      section: sectionId,
      style,
      size,
      dev,
    })
  }

  return (
    <div
      style={{
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {/* Plugin Selector */}
      <select
        value={plugin}
        onChange={(e) => handlePluginChange(e.target.value)}
        style={{
          background: '#21262d',
          border: '1px solid #30363d',
          borderRadius: '4px',
          padding: '6px 8px',
          color: '#c9d1d9',
          fontSize: '13px',
          minWidth: '150px',
        }}
      >
        {plugins.map((p) => (
          <option key={p.name} value={p.name}>
            {p.displayName || p.name}
          </option>
        ))}
      </select>

      {/* Section Selector */}
      <select
        value={section}
        onChange={(e) => handleSectionChange(e.target.value)}
        style={{
          background: '#21262d',
          border: '1px solid #30363d',
          borderRadius: '4px',
          padding: '6px 8px',
          color: '#c9d1d9',
          fontSize: '13px',
          minWidth: '150px',
        }}
      >
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name || s.id}
          </option>
        ))}
      </select>

      {/* Style Selector */}
      <select
        value={style}
        onChange={(e) => setConfig({ plugin, section, style: e.target.value as 'default' | 'terminal', size, dev })}
        style={{
          background: '#21262d',
          border: '1px solid #30363d',
          borderRadius: '4px',
          padding: '6px 8px',
          color: '#c9d1d9',
          fontSize: '13px',
        }}
      >
        <option value="default">Default</option>
        <option value="terminal">Terminal</option>
      </select>

      {/* Size Selector */}
      <select
        value={size}
        onChange={(e) => setConfig({ plugin, section, style, size: e.target.value as 'half' | 'full', dev })}
        style={{
          background: '#21262d',
          border: '1px solid #30363d',
          borderRadius: '4px',
          padding: '6px 8px',
          color: '#c9d1d9',
          fontSize: '13px',
        }}
      >
        <option value="half">Half</option>
        <option value="full">Full</option>
      </select>

      {/* Dev Mode Toggle */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#c9d1d9',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={dev}
          onChange={(e) => setConfig({ plugin, section, style, size, dev: e.target.checked })}
          style={{ cursor: 'pointer' }}
        />
        Dev Mode
      </label>

      <div style={{ width: '1px', height: '20px', background: '#30363d', margin: '0 4px' }} />

      {/* Actions */}
      <button
        onClick={onRegenerate}
        style={{
          background: '#21262d',
          border: '1px solid #30363d',
          borderRadius: '4px',
          padding: '6px 12px',
          color: '#c9d1d9',
          fontSize: '13px',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#30363d'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#21262d'
        }}
      >
        🔄 Regenerate
      </button>

      {onCopySvg && (
        <button
          onClick={onCopySvg}
          style={{
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '6px 12px',
            color: '#c9d1d9',
            fontSize: '13px',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#30363d'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#21262d'
          }}
        >
          📋 Copy SVG
        </button>
      )}

      {onCopyHtml && (
        <button
          onClick={onCopyHtml}
          style={{
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '4px',
            padding: '6px 12px',
            color: '#c9d1d9',
            fontSize: '13px',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#30363d'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#21262d'
          }}
        >
          📋 Copy HTML
        </button>
      )}

      <div style={{ width: '1px', height: '20px', background: '#30363d', margin: '0 4px' }} />

      {/* Toggles */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#c9d1d9',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={uiPreferences.syncSelectionEnabled}
          onChange={(e) => setSyncSelectionEnabled(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
        Sync Selection
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#c9d1d9',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={uiPreferences.showHighlights}
          onChange={(e) => setShowHighlights(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
        Highlights
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#c9d1d9',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={uiPreferences.diffMode}
          onChange={(e) => setDiffMode(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
        Diff Mode
      </label>

      <button
        onClick={() => setPreviewBackground(uiPreferences.previewBackground === 'dark' ? 'light' : 'dark')}
        style={{
          background: '#21262d',
          border: '1px solid #30363d',
          borderRadius: '4px',
          padding: '6px 12px',
          color: '#c9d1d9',
          fontSize: '13px',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#30363d'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#21262d'
        }}
      >
        {uiPreferences.previewBackground === 'dark' ? '🌙' : '☀️'} Background
      </button>

      {onToggleConfig && (
        <button
          onClick={onToggleConfig}
          style={{
            background: configOpen ? '#21262d' : '#21262d',
            border: `1px solid ${configOpen ? '#58a6ff' : '#30363d'}`,
            borderRadius: '4px',
            padding: '6px 12px',
            color: configOpen ? '#58a6ff' : '#c9d1d9',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: configOpen ? '600' : '400',
          }}
          onMouseOver={(e) => {
            if (!configOpen) {
              e.currentTarget.style.background = '#30363d'
            }
          }}
          onMouseOut={(e) => {
            if (!configOpen) {
              e.currentTarget.style.background = '#21262d'
            }
          }}
        >
          ⚙️ Config
        </button>
      )}
    </div>
  )
}

