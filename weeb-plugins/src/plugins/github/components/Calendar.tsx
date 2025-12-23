import React from 'react'
import { FaCalendar } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'
import { getCalendarColor } from '../utils'

interface CalendarProps {
  data: GithubData['calendar']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}


const DefaultCalendar = ({ data, size }: { data: GithubData['calendar']; size: 'half' | 'full' }) => {
  const isHalfMode = size === 'half'
  
  // Se há múltiplos anos, exibir cada ano separadamente
  if (data.years && data.years.length > 1) {
    return (
      <div className="flex flex-col gap-4">
        {data.years.map((yearData) => {
          let weeks = yearData.weeks.slice().reverse()
          if (isHalfMode) {
            weeks = weeks.slice(-26)
          }

          return (
            <div key={yearData.year} className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-default-text">
                {yearData.year} ({yearData.totalContributions} contributions)
              </div>
              <div className="flex flex-wrap gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.contributionDays.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-[0.7rem] h-[0.7rem] rounded-sm"
                        style={{
                          backgroundColor: getCalendarColor(day.color || ''),
                        }}
                        title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div className="flex justify-end text-xs text-default-muted">
          Total: {data.totalContributions} contributions
        </div>
      </div>
    )
  }

  // Exibição padrão (um ano ou todos os anos combinados)
  let weeks = data.weeks.slice(-52).reverse()
  if (isHalfMode) {
    weeks = weeks.slice(-26)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.contributionDays.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="w-[0.7rem] h-[0.7rem] rounded-sm"
                style={{
                  backgroundColor: getCalendarColor(day.color),
                }}
                title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end text-xs text-default-muted">
        {data.totalContributions} contributions in the last {isHalfMode ? '6 months' : 'year'}
      </div>
    </div>
  )
}

const TerminalCalendar = ({ data, size }: { data: GithubData['calendar']; size: 'half' | 'full' }) => {
  const isHalfMode = size === 'half'

  const getContributionSymbol = (count: number): string => {
    if (count === 0) return '⬚'
    if (count <= 3) return '▢'
    if (count <= 6) return '▣'
    if (count <= 9) return '▥'
    return '▩'
  }

  // Se há múltiplos anos, exibir cada ano separadamente
  if (data.years && data.years.length > 1) {
    return (
      <div className="flex flex-col gap-3">
        {data.years.map((yearData) => {
          let weeks = yearData.weeks.slice().reverse()
          if (isHalfMode) {
            weeks = weeks.slice(-26)
          }

          return (
            <div key={yearData.year} className="flex flex-col gap-2">
              <div className="text-terminal-warning text-sm font-semibold">
                {yearData.year} ({yearData.totalContributions} contributions)
              </div>
              <div className="inline-grid grid-flow-col gap-1 text-[0.75rem]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 w-[0.60rem]">
                    {week.contributionDays.map((day, dayIndex) => (
                      <span
                        key={`${weekIndex}-${dayIndex}`}
                        title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                        className="flex items-center justify-center text-baseline w-full h-full"
                        style={{
                          color: getCalendarColor(day.color || ''),
                        }}
                      >
                        {getContributionSymbol(day.contributionCount)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div className="text-terminal-muted text-right">
          Total: {data.totalContributions} contributions
        </div>
      </div>
    )
  }

  // Exibição padrão (um ano ou todos os anos combinados)
  let weeks = data.weeks.slice(-52).reverse()
  if (isHalfMode) {
    weeks = weeks.slice(-26)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-grid grid-flow-col gap-1 text-[0.75rem]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 w-[0.60rem]">
            {week.contributionDays.map((day, dayIndex) => (
              <span
                key={`${weekIndex}-${dayIndex}`}
                title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                className="flex items-center justify-center text-baseline w-full h-full"
                style={{
                  color: getCalendarColor(day.color || ''),
                }}
              >
                {getContributionSymbol(day.contributionCount)}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="text-terminal-muted text-right">
        {data.totalContributions} contributions in the last {isHalfMode ? '6 months' : 'year'}
      </div>
    </div>
  )
}

export function GithubCalendar({ data, config, style, size }: CalendarProps): React.ReactElement {
  const title = config.calendar_title ?? 'Contribution Calendar'
  const hideTitle = config.calendar_hide_title ?? false

  return (
    <section id="github-calendar">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCalendar />} />}
            <DefaultCalendar data={data} size={size} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'calendar',
                size,
              })}
            />
            <TerminalCalendar data={data} size={size} />
          </>
        }
      />
    </section>
  )
}

