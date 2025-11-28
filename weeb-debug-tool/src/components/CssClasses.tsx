import { useMemo } from 'react'

interface CssClassesProps {
  html: string
}

export default function CssClasses({ html }: CssClassesProps) {
  const classes = useMemo(() => {
    const classRegex = /class=["']([^"']+)["']/g
    const classSet = new Set<string>()
    let match

    while ((match = classRegex.exec(html)) !== null) {
      const classList = match[1].split(/\s+/)
      classList.forEach((cls) => {
        if (cls.trim()) {
          classSet.add(cls.trim())
        }
      })
    }

    return Array.from(classSet).sort()
  }, [html])

  return (
    <div
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <h2 style={{ marginBottom: '16px', color: '#58a6ff' }}>CSS Classes</h2>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#8b949e' }}>
        Found {classes.length} unique class{classes.length !== 1 ? 'es' : ''}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {classes.map((cls) => (
          <span
            key={cls}
            style={{
              background: '#21262d',
              border: '1px solid #30363d',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'Monaco, Menlo, monospace',
              color: '#58a6ff',
            }}
          >
            {cls}
          </span>
        ))}
      </div>
    </div>
  )
}









