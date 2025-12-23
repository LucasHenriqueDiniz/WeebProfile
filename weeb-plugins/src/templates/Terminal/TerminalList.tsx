/**
 * TerminalList - Lista para estilo terminal
 */

import React from 'react'
import { TerminalLine } from './TerminalLine.js'
import type { TerminalLineProps } from '../types.js'

interface TerminalListProps {
  data: TerminalLineProps[]
}

export function TerminalList({ data }: TerminalListProps): React.ReactElement {
  return (
    <>
      {data.map((item, index) => (
        <TerminalLine key={`terminal-line-${index}`} {...item} />
      ))}
    </>
  )
}

