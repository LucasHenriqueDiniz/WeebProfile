/**
 * Vars Tab
 *
 * Shows CSS variables (defined and inherited)
 */

import { useState, useMemo } from "react"
import type { StyleSnapshot } from "../../lib/iframe/iframeProtocol"

interface VarsTabProps {
  snapshot: StyleSnapshot | null
  cssVarNames?: string[]
}

export default function VarsTab({ snapshot, cssVarNames = [] }: VarsTabProps) {
  const [filter, setFilter] = useState("")

  if (!snapshot) {
    return <div style={{ padding: "16px", color: "#8b949e", textAlign: "center" }}>No element selected</div>
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error)
  }

  // Get CSS vars from snapshot (already resolved values)
  const cssVars = Object.entries(snapshot.cssVars || {})

  // Filter vars
  const filteredVars = useMemo(() => {
    if (!filter) return cssVars

    const lowerFilter = filter.toLowerCase()
    return cssVars.filter(([prop]) => prop.toLowerCase().includes(lowerFilter))
  }, [cssVars, filter])

  return (
    <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
      {/* Filter */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Filter variables..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: "100%",
            background: "#21262d",
            border: "1px solid #30363d",
            borderRadius: "4px",
            padding: "6px 8px",
            color: "#c9d1d9",
            fontSize: "12px",
          }}
        />
      </div>

      {/* CSS Variables */}
      {filteredVars.length === 0 ? (
        <div style={{ color: "#8b949e", textAlign: "center", padding: "16px" }}>
          {cssVarNames.length === 0
            ? "No CSS variables found. Make sure CSS is loaded and variables are defined."
            : "No variables match filter"}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "8px", textTransform: "uppercase" }}>
            CSS Variables ({filteredVars.length})
          </div>
          <div
            style={{
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "6px",
              padding: "12px",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <div style={{ fontFamily: "Monaco, Menlo, monospace", fontSize: "12px" }}>
              {filteredVars.map(([property, value]) => (
                <div
                  key={property}
                  style={{
                    marginBottom: "6px",
                    padding: "4px",
                    borderRadius: "2px",
                    background: "#161b22",
                    cursor: "pointer",
                  }}
                  onClick={() => copyToClipboard(`${property}: ${value};`)}
                  title="Click to copy"
                >
                  <span style={{ color: "#f0883e" }}>{property}</span>
                  <span style={{ color: "#8b949e" }}>: </span>
                  <span style={{ color: "#a5d6ff" }}>{value}</span>
                  <span style={{ color: "#8b949e" }}>;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
