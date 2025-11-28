/**
 * TopItems - Componente genérico para exibir top items do LastFM (Artists, Albums, Tracks)
 * Renderiza Grid, List ou Default baseado no displayStyle
 */

import React from 'react'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { abbreviateNumber } from '../../../utils/number'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import TerminalTree from '../../../templates/Terminal/TerminalTree'
import { TerminalLineBreak } from '../../../templates/Terminal/TerminalLineBreak'
import { DefaultImageGrid } from '../../../templates/Default/DefaultImageGrid'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { DefaultGrid } from '../../../templates/Default/DefaultGrid'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import type { GridItemProps, ListItemProps, TerminalLineProps } from '../../../templates/types'
import type { IconType } from 'react-icons'

interface TopItem {
  image?: string
  // Para Artists
  artist?: string
  totalPlays?: string
  // Para Albums
  album?: string
  plays?: string
  // Para Tracks
  track?: string
}

interface TopItemsProps {
  data: TopItem[]
  interval?: string
  config: {
    max?: number
    title?: string
    hide_title?: boolean
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
  displayStyle: 'grid' | 'list' | 'default'
  sectionId: string
  sectionName: string
  icon: IconType
  terminalLabels: {
    rightText: string
    centerText?: string
    leftText: string
  }
  // Função para mapear item para GridItemProps
  mapToGridItem: (item: TopItem) => GridItemProps
  // Função para mapear item para ListItemProps
  mapToListItem: (item: TopItem) => ListItemProps
}

export function TopItems({
  data,
  interval,
  config,
  style = 'default',
  size = 'half',
  displayStyle,
  sectionId,
  sectionName,
  icon: Icon,
  terminalLabels,
  mapToGridItem,
  mapToListItem,
}: TopItemsProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.title || sectionName
  const hideTitle = config.hide_title || false
  const hideIntervals = config.hide_intervals || false
  const finalInterval = interval
  const maxItems = config.max || 5

  // Limitar dados
  const limitedData = data.length > maxItems ? data.slice(0, maxItems) : data

  // Preparar dados para cada estilo
  const gridItems: GridItemProps[] = limitedData.map(mapToGridItem)
  const listItems: ListItemProps[] = limitedData.map(mapToListItem)
  const terminalListItems: TerminalLineProps[] = listItems.map((item) => ({
    right: item.right,
    left: item.left || '',
  }))

  // Renderizar baseado no displayStyle
  if (displayStyle === 'list') {
    return (
      <section id={sectionId}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={hideIntervals ? undefined : finalInterval}
                  icon={<Icon />}
                />
              )}
              <DefaultList data={listItems} />
            </>
          }
          terminalComponent={
            <>
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: 'lastfm',
                  section: sectionId.replace('lastfm-', ''),
                  period: finalInterval,
                  limit: maxItems,
                  size,
                })}
              />
              <TerminalList data={terminalListItems} />
              <TerminalLineBreak />
            </>
          }
        />
      </section>
    )
  }

  if (displayStyle === 'grid') {
    return (
      <section id={sectionId}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={hideIntervals ? undefined : finalInterval}
                  icon={<Icon />}
                />
              )}
              <DefaultImageGrid data={gridItems} />
            </>
          }
          terminalComponent={
            <>
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: 'lastfm',
                  section: sectionId.replace('lastfm-', ''),
                  period: finalInterval,
                  limit: maxItems,
                  size,
                })}
              />
              <TerminalGrid
                data={gridItems}
                rightText={terminalLabels.rightText}
                centerText={terminalLabels.centerText}
                leftText={terminalLabels.leftText}
              />
              <TerminalLineBreak />
            </>
          }
        />
      </section>
    )
  }

  // displayStyle === 'default'
  return (
    <section id={sectionId}>
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : finalInterval}
                icon={<Icon />}
              />
            )}
            <DefaultGrid data={gridItems} size={size} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'lastfm',
                section: sectionId.replace('lastfm-', ''),
                period: finalInterval,
                limit: maxItems,
                size,
              })}
            />
            <TerminalTree data={gridItems} title={title} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

