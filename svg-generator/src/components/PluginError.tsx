/**
 * Componente para exibir erros de plugins
 *
 * Renderiza uma mensagem de erro visual quando um plugin falha ao buscar dados ou renderizar
 */

import React from "react"

/**
 * The box's full height, margins included. The SVG's height is computed, not measured,
 * and a failed plugin used to add nothing to it: the box was drawn in 0px, invisible.
 * svg-generator.ts adds this for every failed plugin, so the box must not grow -- the
 * message is clamped to two lines.
 */
export const PLUGIN_ERROR_HEIGHT = 112

const BOX_HEIGHT = 96

interface PluginErrorProps {
  pluginName: string
  error: Error
  style?: string
  size?: string
}

export function PluginError({ pluginName, error }: PluginErrorProps): React.ReactElement {
  return (
    <div
      style={{
        boxSizing: "border-box",
        height: `${BOX_HEIGHT}px`,
        overflow: "hidden",
        padding: "16px",
        margin: `${(PLUGIN_ERROR_HEIGHT - BOX_HEIGHT) / 2}px 0`,
        backgroundColor: "#fee2e2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        color: "#991b1b",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "14px", lineHeight: "20px", marginBottom: "6px" }}>
        ⚠️ Erro no plugin: {pluginName}
      </div>
      <div
        style={{
          fontSize: "12px",
          lineHeight: "16px",
          fontFamily: "monospace",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {error.message || String(error)}
      </div>
    </div>
  )
}
