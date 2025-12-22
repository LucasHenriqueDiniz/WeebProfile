import { useState, useEffect, useRef } from 'react'
import { getSectionConfigOptions, type SectionConfigOption } from '@weeb-plugins/plugins/metadata'

interface SectionConfigProps {
  pluginName: string
  sectionId: string
  config: Record<string, any>
  onChange: (config: Record<string, any>) => void
}

export default function SectionConfig({ pluginName, sectionId, config, onChange }: SectionConfigProps) {
  const [configOptions, setConfigOptions] = useState<SectionConfigOption[]>([])
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({})
  const prevPluginSectionRef = useRef<string>('')

  useEffect(() => {
    const options = getSectionConfigOptions(pluginName, sectionId)
    setConfigOptions(options)
    
    const currentKey = `${pluginName}:${sectionId}`
    
    // Only re-initialize when plugin/section actually changes
    if (prevPluginSectionRef.current !== currentKey) {
      const defaultConfig: Record<string, any> = {}
      options.forEach(option => {
        defaultConfig[option.key] = config[option.key] ?? option.defaultValue
      })
      setLocalConfig(defaultConfig)
      prevPluginSectionRef.current = currentKey
    }
  }, [pluginName, sectionId, config])

  const updateConfig = (key: string, value: any) => {
    setLocalConfig(prev => {
      const newConfig = { ...prev, [key]: value }
      // Call onChange immediately when user changes a value
      onChange(newConfig)
      return newConfig
    })
  }

  if (configOptions.length === 0) {
    return (
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '16px' }}>
        <p style={{ color: '#8b949e', fontSize: '14px', margin: 0 }}>No configuration options available for this section.</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#58a6ff', marginTop: 0, marginBottom: '16px' }}>
        ⚙️ Section Configuration
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {configOptions.map((option) => {
          if (option.type === 'boolean') {
            return (
              <div key={option.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#c9d1d9', fontWeight: '500' }}>
                  {option.label}
                  {option.description && (
                    <span style={{ fontSize: '11px', color: '#8b949e', fontWeight: 'normal', marginLeft: '8px' }}>
                      ({option.description})
                    </span>
                  )}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={localConfig[option.key] ?? option.defaultValue}
                    onChange={(e) => updateConfig(option.key, e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', color: '#8b949e' }}>
                    {localConfig[option.key] ?? option.defaultValue ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            )
          }

          if (option.type === 'number') {
            return (
              <div key={option.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#c9d1d9', fontWeight: '500' }}>
                  {option.label}
                  {option.description && (
                    <span style={{ fontSize: '11px', color: '#8b949e', fontWeight: 'normal', marginLeft: '8px' }}>
                      ({option.description})
                    </span>
                  )}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={localConfig[option.key] ?? option.defaultValue}
                    onChange={(e) => updateConfig(option.key, Number(e.target.value))}
                    min={option.min}
                    max={option.max}
                    step={option.step ?? 1}
                    style={{
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      width: '120px',
                    }}
                  />
                  {option.min !== undefined && option.max !== undefined && (
                    <span style={{ fontSize: '11px', color: '#6e7681' }}>
                      Range: {option.min} - {option.max}
                    </span>
                  )}
                </div>
              </div>
            )
          }

          if (option.type === 'string') {
            return (
              <div key={option.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#c9d1d9', fontWeight: '500' }}>
                  {option.label}
                  {option.required && (
                    <span style={{ fontSize: '11px', color: '#f85149', fontWeight: 'normal', marginLeft: '4px' }}>
                      *
                    </span>
                  )}
                  {option.description && (
                    <span style={{ fontSize: '11px', color: '#8b949e', fontWeight: 'normal', marginLeft: '8px' }}>
                      ({option.description})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={localConfig[option.key] ?? option.defaultValue}
                  onChange={(e) => updateConfig(option.key, e.target.value)}
                  placeholder={option.placeholder}
                  required={option.required}
                  style={{
                    background: '#0d1117',
                    border: option.required && !localConfig[option.key] ? '1px solid #f85149' : '1px solid #30363d',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    width: '100%',
                  }}
                />
              </div>
            )
          }

          if (option.type === 'select' && option.options) {
            return (
              <div key={option.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#c9d1d9', fontWeight: '500' }}>
                  {option.label}
                  {option.description && (
                    <span style={{ fontSize: '11px', color: '#8b949e', fontWeight: 'normal', marginLeft: '8px' }}>
                      ({option.description})
                    </span>
                  )}
                </label>
                <select
                  value={localConfig[option.key] ?? option.defaultValue}
                  onChange={(e) => updateConfig(option.key, e.target.value)}
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  {option.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

