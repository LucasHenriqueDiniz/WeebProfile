import React from "react"
import { CONTENT_SIZE_SCALE, type ContentSize } from "../types"

interface ScaledBoxProps {
  size?: ContentSize
  children: React.ReactElement
}

// Escala o conteúdo inteiro (fonte, ícones, gráfico, padding, borda) com um único
// `zoom` - mais simples e consistente do que reescrever cada classe de tamanho em
// cada variante.
//
// Importante: isso usa `zoom`, não `transform:scale`. transform:scale só afeta o
// resultado visual - a caixa continua ocupando o tamanho ORIGINAL (não escalado) no
// layout do pai, então o conteúdo aumentado (lg) vazava pra fora da section/
// foreignObject (cortado pelo overflow:hidden) e o reduzido (sm) deixava um vão vazio
// embaixo. `zoom` participa do layout de verdade - o container flex-column
// (#svg-main section) reserva a altura já escalada, batendo com o calculateHeight()
// (index.tsx), que soma exatamente essa mesma escala.
export function ScaledBox({ size = "md", children }: ScaledBoxProps): React.ReactElement {
  const factor = CONTENT_SIZE_SCALE[size]
  if (factor === 1) return children

  return <div style={{ zoom: factor }}>{children}</div>
}
