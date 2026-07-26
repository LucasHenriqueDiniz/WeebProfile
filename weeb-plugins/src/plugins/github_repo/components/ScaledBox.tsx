import React from "react"
import { CONTENT_SIZE_SCALE, type ContentSize } from "../types"

interface ScaledBoxProps {
  size?: ContentSize
  children: React.ReactElement
}

// Escala o conteúdo inteiro (fonte, ícones, gráfico, padding, borda) com um único
// transform:scale - mais simples e consistente do que reescrever cada classe de
// tamanho em cada variante. O truque do width:100/factor% compensa a mudança de
// largura visual do scale, mantendo o conteúdo ocupando 100% do card real.
// calculateHeight (index.tsx) precisa multiplicar pela mesma escala.
export function ScaledBox({ size = "md", children }: ScaledBoxProps): React.ReactElement {
  const factor = CONTENT_SIZE_SCALE[size]
  if (factor === 1) return children

  return (
    <div style={{ transform: `scale(${factor})`, transformOrigin: "top left", width: `${100 / factor}%` }}>
      {children}
    </div>
  )
}
