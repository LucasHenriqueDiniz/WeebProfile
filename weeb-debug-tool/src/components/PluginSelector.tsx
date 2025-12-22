import { api, type Plugin } from '../lib/api'

interface PluginSelectorProps {
  plugins: Plugin[]
  selected: string
  onChange: (plugin: string) => void
}

export default function PluginSelector({ plugins, selected, onChange }: PluginSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', color: '#8b949e', textTransform: 'uppercase' }}>Plugin</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '4px',
          padding: '8px 12px',
          color: '#c9d1d9',
          fontSize: '14px',
          minWidth: '200px',
          cursor: 'pointer',
        }}
      >
        {plugins.map((plugin) => (
          <option key={plugin.name} value={plugin.name}>
            {plugin.displayName || plugin.name}
          </option>
        ))}
      </select>
    </div>
  )
}









