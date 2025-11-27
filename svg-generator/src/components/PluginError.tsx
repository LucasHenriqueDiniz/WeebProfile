/**
 * Componente para exibir erros de plugins visualmente no SVG
 */

import React from 'react'

interface PluginErrorProps {
  pluginName: string
  error: Error | string
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function PluginError({ pluginName, error, style = 'default', size = 'half' }: PluginErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error.message
  const errorName = typeof error === 'string' ? 'Error' : error.name

  const width = size === 'half' ? 415 : 830

  if (style === 'terminal') {
    return (
      <div
        className="terminal-error"
        style={{
          width: `${width}px`,
          padding: '20px',
          backgroundColor: '#1e1e1e',
          border: '2px solid #ff4444',
          borderRadius: '8px',
          color: '#ff6b6b',
          fontFamily: 'monospace',
          fontSize: '14px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ color: '#ff4444' }}>⚠</span>
          <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>
            {pluginName.toUpperCase()} ERROR
          </span>
        </div>
        <div style={{ color: '#ffaaaa', marginBottom: '5px' }}>
          <strong>{errorName}:</strong>
        </div>
        <div style={{ color: '#ffcccc', whiteSpace: 'pre-wrap' }}>{errorMessage}</div>
      </div>
    )
  }

  // Default style
  return (
    <div
      className="plugin-error"
      style={{
        width: `${width}px`,
        padding: '20px',
        backgroundColor: '#fff5f5',
        border: '2px solid #feb2b2',
        borderRadius: '8px',
        color: '#c53030',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H9v-2h2v2zm0-4H9V7h2v4z"
            fill="#c53030"
          />
        </svg>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {pluginName.charAt(0).toUpperCase() + pluginName.slice(1)} Error
        </span>
      </div>
      <div style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
        {errorName}:
      </div>
      <div style={{ fontSize: '14px', color: '#742a2a', whiteSpace: 'pre-wrap' }}>
        {errorMessage}
      </div>
    </div>
  )
}


