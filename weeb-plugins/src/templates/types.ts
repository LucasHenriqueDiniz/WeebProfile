/**
 * Tipos compartilhados para templates
 */

import type React from 'react'

export interface GridItemProps {
  image?: string
  title: string
  subtitle?: string
  value: string
}

export interface ListItemProps {
  right: string | React.ReactNode
  center?: string | React.ReactNode
  left: string | React.ReactNode
  image?: string
}

export interface TerminalLineProps {
  right: string
  left: string
}

