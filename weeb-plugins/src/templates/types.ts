/**
 * Tipos compartilhados para templates
 */

import type React from "react"

export interface GridItemProps {
  image?: string | null
  title: string
  subtitle?: string
  value: string
}

export interface ListItemProps {
  right: string | React.ReactNode
  center?: string | React.ReactNode
  left: string | React.ReactNode
  image?: string | null
}

export interface TerminalLineProps {
  right: string
  left: string
}
