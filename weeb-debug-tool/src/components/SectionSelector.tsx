interface Section {
  id: string
  name: string
}

interface SectionSelectorProps {
  sections: Section[]
  selected: string
  onChange: (section: string) => void
}

export default function SectionSelector({ sections, selected, onChange }: SectionSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', color: '#8b949e', textTransform: 'uppercase' }}>Section</label>
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
        {sections.map((section) => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
      </select>
    </div>
  )
}








