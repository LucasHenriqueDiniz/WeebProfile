import React from 'react'
import type { IconType } from 'react-icons'
import { DefaultGrid } from '../../../templates/Default/DefaultGrid'
import { DefaultImageGrid } from '../../../templates/Default/DefaultImageGrid'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import TerminalTree from '../../../templates/Terminal/TerminalTree'
import type { GridItemProps, ListItemProps, TerminalLineProps } from '../../../templates/types'
import { getPseudoCommands } from '../../../utils/pseudo-commands'

interface TopItem {
  image?: string
  artist?: string
  totalPlays?: string
  album?: string
  plays?: string
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
    right: typeof item.right === 'string' ? item.right : String(item.right || ''),
    left: typeof item.left === 'string' ? item.left : String(item.left || ''),
  }))

  // Renderizar baseado no displayStyle
  if (displayStyle === 'list') {
    return (
      <section id={sectionId}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <div className="pb-2">
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={hideIntervals ? undefined : finalInterval}
                  icon={<Icon />}
                />
              )}
              <DefaultList data={listItems} />
            </div>
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
            <div className="pb-2">
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={hideIntervals ? undefined : finalInterval}
                  icon={<Icon />}
                />
              )}
              <DefaultImageGrid data={gridItems} />
            </div>
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
          <div className="pb-2">
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : finalInterval}
                icon={<Icon />}
              />
            )}
            <DefaultGrid data={gridItems} size={size} />
          </div>
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
          </>
        }
      />
    </section>
  )
}

