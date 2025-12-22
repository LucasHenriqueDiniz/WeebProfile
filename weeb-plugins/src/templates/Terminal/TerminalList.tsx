/**
 * TerminalList - Lista para estilo terminal
 */

import React from 'react'
import { TerminalLine } from './TerminalLine'
import type { TerminalLineProps } from '../types'

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

