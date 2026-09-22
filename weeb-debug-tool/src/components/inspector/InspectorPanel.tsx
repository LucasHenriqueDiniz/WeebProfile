/**
 * Inspector Panel
 *
 * Main inspector component with tabs for different views
 */

import { useState } from "react"
import ElementTab from "./ElementTab"
import StylesTab from "./StylesTab"
import VarsTab from "./VarsTab"
import DiffTab from "./DiffTab"
import type { StyleSnapshot } from "../../lib/iframe/iframeProtocol"
import { extractCssVarNames } from "../../lib/css/extractCssVars"

interface InspectorPanelProps {
  reactSnapshot: StyleSnapshot | null
  svgSnapshot: StyleSnapshot | null
  css?: string
  onClose?: () => void
}

type Tab = "element" | "styles" | "vars" | "diff"

export default function InspectorPanel({ reactSnapshot, svgSnapshot, css = "", onClose }: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("element")

  const cssVarNames = extractCssVarNames(css)

  const tabs: { id: Tab; label: string }[] = [
    { id: "element", label: "Element" },
    { id: "styles", label: "Styles" },
    { id: "vars", label: "Vars" },
    { id: "diff", label: "Diff" },
  ]

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "400px",
        background: "#161b22",
        borderLeft: "1px solid #30363d",
        boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #30363d",
          background: "#0d1117",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, color: "#58a6ff", fontSize: "16px", fontWeight: "600" }}>🔍 Inspector</h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #30363d",
              borderRadius: "4px",
              padding: "4px 8px",
              color: "#8b949e",
              cursor: "pointer",
              fontSize: "12px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#21262d"
              e.currentTarget.style.borderColor = "#484f58"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.borderColor = "#30363d"
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #30363d",
          background: "#0d1117",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "12px 8px",
              background: activeTab === tab.id ? "#161b22" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #58a6ff" : "2px solid transparent",
              color: activeTab === tab.id ? "#58a6ff" : "#8b949e",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: activeTab === tab.id ? "600" : "400",
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = "#21262d"
                e.currentTarget.style.color = "#c9d1d9"
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "#8b949e"
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "element" && <ElementTab snapshot={reactSnapshot} />}
        {activeTab === "styles" && <StylesTab snapshot={reactSnapshot} />}
        {activeTab === "vars" && <VarsTab snapshot={reactSnapshot} cssVarNames={cssVarNames} />}
        {activeTab === "diff" && <DiffTab reactSnapshot={reactSnapshot} svgSnapshot={svgSnapshot} />}
      </div>
    </div>
  )
}
