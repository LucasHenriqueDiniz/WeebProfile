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

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] // GitHub shows only Mon, Wed, Fri
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Contribution level colors for legend
const CONTRIBUTION_LEVELS = [
  { label: 'No contributions.', color: 'rgba(128, 128, 128, 0.25)' },
  { label: 'Low contributions.', color: 'rgba(40, 167, 69, 0.4)' },
  { label: 'Medium-low contributions.', color: 'rgba(40, 167, 69, 0.6)' },
  { label: 'Medium-high contributions.', color: 'rgba(40, 167, 69, 0.8)' },
  { label: 'High contributions.', color: 'rgba(40, 167, 69, 1)' },
]

const DefaultCalendar = ({ 
  data, 
  size, 
  config 
}: { 
  data: GithubData['calendar']
  size: 'half' | 'full'
  config: GithubConfig
}) => {
  const isHalfMode = size === 'half'
  const hideWeeks = config.calendar_hide_weeks ?? false
  const hideMonths = config.calendar_hide_months ?? false
  const hideLegends = config.calendar_hide_legends ?? false
  
  // Helper to get month from date
  const getMonth = (dateString: string): number => {
    return new Date(dateString).getMonth()
  }
  
  // Helper to get the dominant month for a week (month that appears most, or first day if tie)
  const getWeekMonth = (week: any): number | null => {
    if (week.contributionDays.length === 0) return null
    
    // Count days per month in this week
    const monthCounts: Record<number, number> = {}
    week.contributionDays.forEach((day: any) => {
      const month = getMonth(day.date)
      monthCounts[month] = (monthCounts[month] || 0) + 1
    })
    
    // Find month with most days
    let maxCount = 0
    let dominantMonth: number | null = null
    for (const [month, count] of Object.entries(monthCounts)) {
      if (count > maxCount) {
        maxCount = count
        dominantMonth = parseInt(month, 10)
      }
    }
    
    // Fallback to first day's month
    return dominantMonth !== null ? dominantMonth : getMonth(week.contributionDays[0].date)
  }
  
  // Helper to calculate month labels with colspan (number of weeks per month)
  const calculateMonthLabels = (weeks: any[]): Array<{ month: number; colspan: number; startWeekIndex: number }> => {
    const monthLabels: Array<{ month: number; colspan: number; startWeekIndex: number }> = []
    let currentMonth: number | null = null
    let monthStartIndex = 0
    
    weeks.forEach((week, weekIndex) => {
      const weekMonth = getWeekMonth(week)
      if (weekMonth === null) return
      
      if (currentMonth === null) {
        currentMonth = weekMonth
        monthStartIndex = weekIndex
      } else if (currentMonth !== weekMonth) {
        // Month changed, save previous month
        monthLabels.push({
          month: currentMonth,
          colspan: weekIndex - monthStartIndex,
          startWeekIndex: monthStartIndex
        })
        currentMonth = weekMonth
        monthStartIndex = weekIndex
      }
    })
    
    // Don't forget the last month
    if (currentMonth !== null) {
      monthLabels.push({
        month: currentMonth,
        colspan: weeks.length - monthStartIndex,
        startWeekIndex: monthStartIndex
      })
    }
    
    return monthLabels
  }
  
  // Render single year calendar with GitHub-style layout
  const renderYearCalendar = (weeks: any[], year?: number) => {
    const yearMode = config.calendar_year_mode || "current_year"
    let allWeeks = weeks.slice().reverse()
    
    // If last_6_months, filter weeks and days within those weeks
    if (yearMode === "last_6_months") {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      sixMonthsAgo.setHours(0, 0, 0, 0)
      
      allWeeks = allWeeks
        .map((week: any) => {
          // Filter days within the week to only include last 6 months
          const filteredDays = week.contributionDays.filter((day: any) => {
            const dayDate = new Date(day.date)
            return dayDate >= sixMonthsAgo
          })
          
          // Only include weeks that have at least one day in the last 6 months
          if (filteredDays.length === 0) return null
          
          return {
            ...week,
            contributionDays: filteredDays
          }
        })
        .filter((week: any) => week !== null)
    }
    
    const displayWeeks = allWeeks
    
    // In half mode, split weeks into 2 rows (but not for last_6_months)
    const squareSize = '0.7rem'
    const gapSize = '0.1875rem' // 3px = 0.1875rem (3/16)
    const shouldSplit = isHalfMode && displayWeeks.length > 26 && yearMode !== "last_6_months"
    const midpoint = shouldSplit ? Math.ceil(displayWeeks.length / 2) : displayWeeks.length
    const firstRowWeeks = displayWeeks.slice(0, midpoint)
    const secondRowWeeks = shouldSplit ? displayWeeks.slice(midpoint) : []
    
    const renderWeekColumn = (week: any, weekIndex: number, allWeeksForRow: any[]) => {
      // Create array of 7 days, padding with nulls based on weekday
      const days: Array<any | null> = [null, null, null, null, null, null, null]
      week.contributionDays.forEach((day: any) => {
        const weekday = day.weekday !== undefined ? day.weekday : new Date(day.date).getDay()
        if (weekday >= 0 && weekday < 7) {
          days[weekday] = day
        }
      })
      
      return (
        <div key={weekIndex} className="flex flex-col" style={{ gap: gapSize }}>
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="rounded-sm"
              style={{
                width: squareSize,
                height: squareSize,
                backgroundColor: day ? getCalendarColor(day.color || '') : 'transparent',
              }}
              title={day ? `${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}` : ''}
            />
          ))}
        </div>
      )
    }
    
    const renderWeekRow = (rowWeeks: any[], rowIndex: number) => (
      <div key={rowIndex} className="flex" style={{ gap: gapSize }}>
        {rowWeeks.map((week, weekIndex) => renderWeekColumn(week, weekIndex, rowWeeks))}
      </div>
    )
    
    // Calculate month labels for both rows
    const firstRowMonthLabels = !hideMonths ? calculateMonthLabels(firstRowWeeks) : []
    const secondRowMonthLabels = !hideMonths && shouldSplit ? calculateMonthLabels(secondRowWeeks) : []
    
    const renderMonthLabels = (monthLabels: Array<{ month: number; colspan: number; startWeekIndex: number }>) => {
      if (hideMonths || monthLabels.length === 0) return null
      
      return (
        <div className="flex items-start" style={{ marginLeft: hideWeeks ? '0' : '1.75rem', position: 'relative', height: '0.8125rem' }}>
          {monthLabels.map((monthLabel, labelIndex) => {
            // Calculate the width: (colspan * squareSize) + (colspan - 1) * gapSize
            const width = `calc(${monthLabel.colspan} * ${squareSize} + ${monthLabel.colspan - 1} * ${gapSize})`
            // Calculate the left position: (startWeekIndex * squareSize) + (startWeekIndex * gapSize)
            const left = `calc(${monthLabel.startWeekIndex} * ${squareSize} + ${monthLabel.startWeekIndex} * ${gapSize})`
            
            return (
              <div
                key={labelIndex}
                className="text-xs text-default-muted font-medium"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: left,
                  width: width,
                  lineHeight: '1',
                }}
              >
                {MONTH_LABELS[monthLabel.month]}
              </div>
            )
          })}
        </div>
      )
    }
    
    return (
      <div className="flex flex-col" style={{ gap: '1rem' }}>
        {/* First calendar row */}
        <div className="flex flex-col" style={{ gap: '0.5rem' }}>
          {/* Month labels row for first row */}
          {renderMonthLabels(firstRowMonthLabels)}
          
          {/* Calendar grid - First row */}
          <div className="flex" style={{ gap: gapSize, minWidth: 0 }}>
            {/* Weekday labels column - GitHub style */}
            {!hideWeeks && (
              <div className="flex flex-col flex-shrink-0" style={{ width: '1.75rem', gap: gapSize }}>
                {WEEKDAY_LABELS.map((label, weekdayIndex) => (
                  <div
                    key={weekdayIndex}
                    className="text-xs text-default-muted font-medium"
                    style={{
                      height: squareSize,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      paddingRight: '0.25rem',
                    }}
                  >
                    {label && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-3px',
                        }}
                      >
                        {label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ minWidth: 0, flex: '1 1 auto' }}>
              {renderWeekRow(firstRowWeeks, 0)}
            </div>
          </div>
        </div>
        
        {/* Second calendar row (only in half mode) */}
        {shouldSplit && secondRowWeeks.length > 0 && (
          <div className="flex flex-col" style={{ gap: '0.5rem' }}>
            {/* Month labels row for second row */}
            {renderMonthLabels(secondRowMonthLabels)}
            
            {/* Calendar grid - Second row */}
            <div className="flex" style={{ gap: gapSize, minWidth: 0 }}>
              {/* Weekday labels column - GitHub style */}
              {!hideWeeks && (
                <div className="flex flex-col flex-shrink-0" style={{ width: '1.75rem', gap: gapSize }}>
                  {WEEKDAY_LABELS.map((label, weekdayIndex) => (
                    <div
                      key={weekdayIndex}
                      className="text-xs text-default-muted font-medium"
                      style={{
                        height: squareSize,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        paddingRight: '0.25rem',
                      }}
                    >
                      {label && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-3px',
                          }}
                        >
                          {label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                {renderWeekRow(secondRowWeeks, 1)}
              </div>
            </div>
          </div>
        )}
        
        {/* Legend removed from here - will be shown with contributions text below */}
      </div>
    )
  }
  
  // Se há múltiplos anos, exibir cada ano separadamente
  if (data.years && data.years.length > 1) {
    return (
      <div className="flex flex-col gap-4">
        {data.years.map((yearData) => (
          <div key={yearData.year} className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-default-text">
              {yearData.year} ({yearData.totalContributions} contributions)
            </div>
            {renderYearCalendar(yearData.weeks, yearData.year)}
          </div>
        ))}
        <div className="flex justify-end text-xs text-default-muted">
          Total: {data.totalContributions} contributions
        </div>
      </div>
    )
  }

  // Exibição padrão (um ano ou todos os anos combinados)
  const yearMode = config.calendar_year_mode || "current_year"
  let allWeeks = data.weeks.slice().reverse()
  
  // If last_6_months, filter weeks and days within those weeks
  if (yearMode === "last_6_months") {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    sixMonthsAgo.setHours(0, 0, 0, 0)
    
    allWeeks = allWeeks
      .map((week: any) => {
        // Filter days within the week to only include last 6 months
        const filteredDays = week.contributionDays.filter((day: any) => {
          const dayDate = new Date(day.date)
          return dayDate >= sixMonthsAgo
        })
        
        // Only include weeks that have at least one day in the last 6 months
        if (filteredDays.length === 0) return null
        
        return {
          ...week,
          contributionDays: filteredDays
        }
      })
      .filter((week: any) => week !== null)
  }
  
  const displayWeeks = allWeeks
  
  const getPeriodText = () => {
    switch (yearMode) {
      case "last_6_months":
        return "6 months"
      case "last_year":
        return "year"
      case "current_year":
        return "year"
      case "full":
        return "period"
      default:
        return isHalfMode ? "6 months" : "year"
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {renderYearCalendar(displayWeeks)}
      {/* Legend and contributions text - same line in both modes, hide legend in half if too cramped */}
      <div className="flex items-center justify-between text-xs text-default-muted mt-2">
        {!hideLegends && !isHalfMode && (
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1 items-center">
              {CONTRIBUTION_LEVELS.map((level, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="rounded-sm"
                    style={{ 
                      width: '0.7rem', 
                      height: '0.7rem', 
                      backgroundColor: level.color 
                    }}
                  />
                  {index < CONTRIBUTION_LEVELS.length - 1 && (
                    <span className="text-default-muted/60">•</span>
                  )}
                </div>
              ))}
            </div>
            <span>More</span>
          </div>
        )}
        <div>
          {data.totalContributions} contributions in the last {getPeriodText()}
        </div>
      </div>
    </div>
  )
}

const TerminalCalendar = ({ data, size, config }: { data: GithubData['calendar']; size: 'half' | 'full'; config: GithubConfig }) => {
  const isHalfMode = size === 'half'
  const yearMode = config.calendar_year_mode || "current_year"

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
          
          // If last_6_months, filter weeks and days (shouldn't happen in multi-year, but just in case)
          if (yearMode === "last_6_months") {
            const sixMonthsAgo = new Date()
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
            sixMonthsAgo.setHours(0, 0, 0, 0)
            
            weeks = weeks
              .map((week: any) => {
                const filteredDays = week.contributionDays.filter((day: any) => {
                  const dayDate = new Date(day.date)
                  return dayDate >= sixMonthsAgo
                })
                if (filteredDays.length === 0) return null
                return {
                  ...week,
                  contributionDays: filteredDays
                }
              })
              .filter((week: any) => week !== null)
          } else if (isHalfMode) {
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
  let weeks = data.weeks.slice().reverse()
  
  // If last_6_months, filter weeks and days within those weeks
  if (yearMode === "last_6_months") {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    sixMonthsAgo.setHours(0, 0, 0, 0)
    
    weeks = weeks
      .map((week: any) => {
        // Filter days within the week to only include last 6 months
        const filteredDays = week.contributionDays.filter((day: any) => {
          const dayDate = new Date(day.date)
          return dayDate >= sixMonthsAgo
        })
        
        // Only include weeks that have at least one day in the last 6 months
        if (filteredDays.length === 0) return null
        
        return {
          ...week,
          contributionDays: filteredDays
        }
      })
      .filter((week: any) => week !== null)
  } else {
    // Para outros modos no half, mostrar apenas últimas 26 semanas
    if (isHalfMode) {
      weeks = weeks.slice(-26)
    } else if (yearMode !== "full") {
      // Para modos normais em full, mostrar até 52 semanas
      weeks = weeks.slice(-52)
    }
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
        {data.totalContributions} contributions in the last {
          yearMode === "last_6_months" ? "6 months" :
          yearMode === "last_year" ? "year" :
          yearMode === "current_year" ? "year" :
          yearMode === "full" ? "period" :
          isHalfMode ? "6 months" : "year"
        }
      </div>
    </div>
  )
}

export function GithubCalendar({ data, config, style, size }: CalendarProps): React.ReactElement {
  const yearMode = config.calendar_year_mode || "current_year"
  const getTitle = () => {
    if (config.calendar_title) return config.calendar_title
    switch (yearMode) {
      case "last_6_months":
        return "Last 6 Months"
      case "last_year":
        return "Last Year"
      case "current_year":
        return "This Year"
      case "full":
        return "All Time"
      default:
        return "Contribution Calendar"
    }
  }
  const title = getTitle()
  const hideTitle = config.calendar_hide_title ?? false

  return (
    <section id="github-calendar">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCalendar />} />}
            <DefaultCalendar data={data} size={size} config={config} />
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
            <TerminalCalendar data={data} size={size} config={config} />
          </>
        }
      />
    </section>
  )
}

