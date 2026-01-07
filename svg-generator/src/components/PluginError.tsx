/**
 * Componente para exibir erros de plugins
 * 
 * Renderiza uma mensagem de erro visual quando um plugin falha ao buscar dados ou renderizar
 */

import React from "react"

interface PluginErrorProps {
  pluginName: string
  error: Error
  style?: string
  size?: string
}

export function PluginError({ pluginName, error, style, size }: PluginErrorProps): React.ReactElement {
  return (
    <div
      style={{
        padding: "1rem",
        margin: "0.5rem 0",
        backgroundColor: "#fee2e2",
        border: "1px solid #fecaca",
        borderRadius: "0.5rem",
        color: "#991b1b",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
        ⚠️ Erro no plugin: {pluginName}
      </div>
      <div style={{ fontSize: "0.875rem", fontFamily: "monospace" }}>
        {error.message || String(error)}
      </div>
    </div>
  )
}






