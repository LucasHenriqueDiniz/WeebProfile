/**
 * Element Tab
 *
 * Shows element information: breadcrumb, attributes, classes, dataset, bbox
 */

import { useMemo } from "react"
import type { StyleSnapshot } from "../../lib/iframe/iframeProtocol"

interface ElementTabProps {
  snapshot: StyleSnapshot | null
}

export default function ElementTab({ snapshot }: ElementTabProps) {
  if (!snapshot) {
    return <div style={{ padding: "16px", color: "#8b949e", textAlign: "center" }}>No element selected</div>
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error)
  }

  return (
    <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
      {/* Tag Name */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "4px", textTransform: "uppercase" }}>Tag</div>
        <div
          style={{
            background: "#21262d",
            border: "1px solid #30363d",
            borderRadius: "4px",
            padding: "8px",
            fontFamily: "Monaco, Menlo, monospace",
            fontSize: "14px",
            color: "#58a6ff",
          }}
        >
          &lt;{snapshot.tagName}&gt;
        </div>
      </div>

      {/* Debug ID */}
      {snapshot.debugId && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "4px", textTransform: "uppercase" }}>
            Debug ID
          </div>
          <div
            style={{
              background: "#21262d",
              border: "1px solid #30363d",
              borderRadius: "4px",
              padding: "8px",
              fontFamily: "Monaco, Menlo, monospace",
              fontSize: "12px",
              color: "#79c0ff",
              wordBreak: "break-all",
              cursor: "pointer",
            }}
            onClick={() => copyToClipboard(snapshot.debugId!)}
            title="Click to copy"
          >
            {snapshot.debugId}
          </div>
        </div>
      )}

      {/* Classes */}
      {snapshot.classList.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "8px", textTransform: "uppercase" }}>
            Classes ({snapshot.classList.length})
          </div>
          <div
            style={{
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "6px",
              padding: "12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {snapshot.classList.map((cls) => (
              <span
                key={cls}
                style={{
                  background: "#21262d",
                  border: "1px solid #30363d",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "Monaco, Menlo, monospace",
                  color: "#79c0ff",
                  cursor: "pointer",
                }}
                onClick={() => copyToClipboard(cls)}
                title="Click to copy"
              >
                .{cls}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attributes */}
      {Object.keys(snapshot.attributes).length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "8px", textTransform: "uppercase" }}>
            Attributes ({Object.keys(snapshot.attributes).length})
          </div>
          <div
            style={{
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "6px",
              padding: "12px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <div style={{ fontFamily: "Monaco, Menlo, monospace", fontSize: "12px" }}>
              {Object.entries(snapshot.attributes).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    marginBottom: "6px",
                    padding: "4px",
                    borderRadius: "2px",
                    background: "#161b22",
                    cursor: "pointer",
                  }}
                  onClick={() => copyToClipboard(`${key}="${value}"`)}
                  title="Click to copy"
                >
                  <span style={{ color: "#79c0ff" }}>{key}</span>
                  <span style={{ color: "#8b949e" }}>=</span>
                  <span style={{ color: "#a5d6ff" }}>"{value}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bounding Box */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "8px", textTransform: "uppercase" }}>
          Dimensions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <div
            style={{
              background: "#21262d",
              border: "1px solid #30363d",
              borderRadius: "4px",
              padding: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", color: "#8b949e", marginBottom: "4px" }}>Width</div>
            <div
              style={{
                fontSize: "14px",
                color: "#58a6ff",
                fontFamily: "monospace",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => copyToClipboard(`${snapshot.bbox.width.toFixed(1)}px`)}
              title="Click to copy"
            >
              {snapshot.bbox.width.toFixed(1)}px
            </div>
          </div>
          <div
            style={{
              background: "#21262d",
              border: "1px solid #30363d",
              borderRadius: "4px",
              padding: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", color: "#8b949e", marginBottom: "4px" }}>Height</div>
            <div
              style={{
                fontSize: "14px",
                color: "#58a6ff",
                fontFamily: "monospace",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => copyToClipboard(`${snapshot.bbox.height.toFixed(1)}px`)}
              title="Click to copy"
            >
              {snapshot.bbox.height.toFixed(1)}px
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
