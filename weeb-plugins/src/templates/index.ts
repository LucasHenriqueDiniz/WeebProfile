/**
 * Templates de renderização
 */

export { RenderBasedOnStyle } from './RenderBasedOnStyle'
export { PluginStyles } from './PluginStyles'

// Default Templates
export { DefaultTitle } from './Default/DefaultTitle'
export { HorizontalMultipleItemsBar } from './Default/HorizontalMultipleItemsBar'
export { DefaultList } from './Default/DefaultList'
export { DefaultGrid } from './Default/DefaultGrid'
export { DefaultImageGrid } from './Default/DefaultImageGrid'
export { StatisticRow, type StatProps, type StatisticsRowProps } from './Default/DefaultStatRow'

// Terminal Templates
export { TerminalBody } from './Terminal/TerminalBody'
export { TerminalHeader } from './Terminal/TerminalHeader'
export { TerminalCommand } from './Terminal/TerminalCommand'
export { TerminalLineWithDots } from './Terminal/TerminalLineWithDots'
export { TerminalLineBreak } from './Terminal/TerminalLineBreak'
export { TerminalGrid } from './Terminal/TerminalGrid'
export { TerminalHorizontalMultipleItemsBar } from './Terminal/TerminalHorizontalMultipleItems'
export { TerminalLine } from './Terminal/TerminalLine'
export { TerminalList } from './Terminal/TerminalList'
export { default as TerminalTree } from './Terminal/TerminalTree'

// Types
export type { GridItemProps, ListItemProps, TerminalLineProps } from './types'
