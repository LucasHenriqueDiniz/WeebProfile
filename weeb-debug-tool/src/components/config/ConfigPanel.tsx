/**
 * Config Panel
 * 
 * Panel for configuring section options
 */

import SectionConfig from '../SectionConfig'
import { useDebugStore } from '../../store/debugStore'

interface ConfigPanelProps {
  onClose?: () => void
}

export default function ConfigPanel({ onClose }: ConfigPanelProps) {
  const { plugin, section, sectionConfig, setSectionConfig } = useDebugStore()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '400px',
        background: '#161b22',
        borderRight: '1px solid #30363d',
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.3)',
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
          background: '#0d1117',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, color: '#58a6ff', fontSize: '16px', fontWeight: '600' }}>
          ⚙️ Section Configuration
        </h3>
        {onClose && (
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
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <SectionConfig
          pluginName={plugin}
          sectionId={section}
          config={sectionConfig}
          onChange={setSectionConfig}
        />
      </div>
    </div>
  )
}

