import React from "react"
import { FaCalendar } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { ContributionDay, ContributionWeek, GithubConfig, GithubData } from "../types"
import { getCalendarColor, firstDayOfLastSixMonths } from "../utils"

interface CalendarProps {
  data: GithubData["calendar"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
}

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] // GitHub shows only Mon, Wed, Fri
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 * A GitHub day ("2026-05-17") as the tooltip shows it. `new Date` reads the plain date as UTC
 * midnight, so it is formatted in UTC: in the machine's zone, one behind UTC (the dashboard
 * preview in São Paulo) named the day before.
 */
const formatDay = (date: string): string => new Date(date).toLocaleDateString(undefined, { timeZone: "UTC" })

// Contribution level colors for legend
const CONTRIBUTION_LEVELS = [
  { label: "No contributions.", color: "rgba(128, 128, 128, 0.25)" },
  { label: "Low contributions.", color: "rgba(40, 167, 69, 0.4)" },
  { label: "Medium-low contributions.", color: "rgba(40, 167, 69, 0.6)" },
  { label: "Medium-high contributions.", color: "rgba(40, 167, 69, 0.8)" },
  { label: "High contributions.", color: "rgba(40, 167, 69, 1)" },
]

const DefaultCalendar = ({
  data,
  size,
  config,
}: {
  data: GithubData["calendar"]
  size: "half" | "full"
  config: GithubConfig
}) => {
  const isHalfMode = size === "half"
  const hideWeeks = config.calendar_hide_weeks ?? false
  const hideMonths = config.calendar_hide_months ?? false
  const hideLegends = config.calendar_hide_legends ?? false

  // Helper to get month from date
  const getMonth = (dateString: string): number => {
    // GitHub's plain dates read as UTC midnight: in a zone behind UTC, getMonth() put each
    // month's 1st in the month before, and a month label could move a column
    return new Date(dateString).getUTCMonth()
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
          startWeekIndex: monthStartIndex,
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
        startWeekIndex: monthStartIndex,
      })
    }

    return monthLabels
  }

  // Render single year calendar with GitHub-style layout
  const renderYearCalendar = (weeks: any[], _year?: number) => {
    const yearMode = config.calendar_year_mode || "current_year"
    let allWeeks = weeks.slice().reverse()

    // If last_6_months, filter weeks and days within those weeks
    if (yearMode === "last_6_months") {
      const sixMonthsAgo = firstDayOfLastSixMonths(allWeeks)

      allWeeks = allWeeks
        .map((week: any) => {
          // Filter days within the week to only include last 6 months
          const filteredDays = week.contributionDays.filter((day: any) => {
            return day.date >= sixMonthsAgo
          })

          // Only include weeks that have at least one day in the last 6 months
          if (filteredDays.length === 0) return null

          return {
            ...week,
            contributionDays: filteredDays,
          }
        })
        .filter((week: any) => week !== null)
    }

    const displayWeeks = allWeeks

    // In half mode, split weeks into 2 rows (but not for last_6_months)
    const squareSize = "0.7rem"
    const gapSize = "0.1875rem" // 3px = 0.1875rem (3/16)
    const shouldSplit = isHalfMode && displayWeeks.length > 26 && yearMode !== "last_6_months"
    const midpoint = shouldSplit ? Math.ceil(displayWeeks.length / 2) : displayWeeks.length
    const firstRowWeeks = displayWeeks.slice(0, midpoint)
    const secondRowWeeks = shouldSplit ? displayWeeks.slice(midpoint) : []

    // As duas linhas usam o mesmo número de colunas para que as células fiquem do
    // mesmo tamanho nas duas — 53 semanas viram 27 + 26, e a segunda apenas deixa
    // a última coluna vazia.
    const columnsPerRow = Math.max(firstRowWeeks.length, secondRowWeeks.length)

    // Grade de colunas iguais em vez de larguras fixas: com 27 colunas de 0.7rem e
    // gap de 3px o total dá 380px, mais que os 368px disponíveis no half, e a última
    // semana (mais o rótulo do mês) ficava cortada. Com `1fr` as colunas encolhem só
    // quando falta espaço; o `maxWidth` mantém o tamanho original quando sobra, como
    // no full. A altura não muda: as células continuam com `height: squareSize`.
    const gridStyle: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))`,
      gap: gapSize,
      maxWidth: `calc(${columnsPerRow} * ${squareSize} + ${columnsPerRow - 1} * ${gapSize})`,
    }

    const renderWeekColumn = (week: any, weekIndex: number, _allWeeksForRow: any[]) => {
      // Create array of 7 days, padding with nulls based on weekday
      const days: Array<any | null> = [null, null, null, null, null, null, null]
      week.contributionDays.forEach((day: any) => {
        const weekday = day.weekday !== undefined ? day.weekday : new Date(day.date).getUTCDay()
        if (weekday >= 0 && weekday < 7) {
          days[weekday] = day
        }
      })

      return (
        <div key={weekIndex} className="flex flex-col" style={{ gap: gapSize, minWidth: 0 }}>
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="rounded-sm"
              style={{
                width: "100%",
                height: squareSize,
                backgroundColor: day ? getCalendarColor(day.color || "") : "transparent",
              }}
              title={day ? `${day.contributionCount} contributions on ${formatDay(day.date)}` : ""}
            />
          ))}
        </div>
      )
    }

    const renderWeekRow = (rowWeeks: any[], rowIndex: number) => (
      <div key={rowIndex} style={gridStyle}>
        {rowWeeks.map((week, weekIndex) => renderWeekColumn(week, weekIndex, rowWeeks))}
      </div>
    )

    // Calculate month labels for both rows
    const firstRowMonthLabels = !hideMonths ? calculateMonthLabels(firstRowWeeks) : []
    const secondRowMonthLabels = !hideMonths && shouldSplit ? calculateMonthLabels(secondRowWeeks) : []

    const renderMonthLabels = (monthLabels: Array<{ month: number; colspan: number; startWeekIndex: number }>) => {
      if (hideMonths || monthLabels.length === 0) return null

      // Os rótulos usam a MESMA grade das semanas, posicionados por `grid-column`.
      // Antes eram absolutos com posição em px derivada do tamanho fixo da célula;
      // como as colunas agora podem encolher, essa conta sairia do lugar.
      return (
        <div
          style={{
            ...gridStyle,
            marginLeft: hideWeeks ? "0" : `calc(1.75rem + ${gapSize})`,
            height: "0.8125rem",
            alignItems: "start",
          }}
        >
          {monthLabels.map((monthLabel, labelIndex) => {
            return (
              <div
                key={labelIndex}
                className="text-xs text-default-muted font-medium"
                style={{
                  gridColumn: `${monthLabel.startWeekIndex + 1} / span ${monthLabel.colspan}`,
                  lineHeight: "1",
                  minWidth: 0,
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
      <div className="flex flex-col" style={{ gap: "1rem" }}>
        {/* First calendar row */}
        <div className="flex flex-col" style={{ gap: "0.5rem" }}>
          {/* Month labels row for first row */}
          {renderMonthLabels(firstRowMonthLabels)}

          {/* Calendar grid - First row */}
          <div className="flex" style={{ gap: gapSize, minWidth: 0 }}>
            {/* Weekday labels column - GitHub style */}
            {!hideWeeks && (
              <div className="flex flex-col flex-shrink-0" style={{ width: "1.75rem", gap: gapSize }}>
                {WEEKDAY_LABELS.map((label, weekdayIndex) => (
                  <div
                    key={weekdayIndex}
                    className="text-xs text-default-muted font-medium"
                    style={{
                      height: squareSize,
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      paddingRight: "0.25rem",
                    }}
                  >
                    {label && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-3px",
                        }}
                      >
                        {label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ minWidth: 0, flex: "1 1 auto" }}>{renderWeekRow(firstRowWeeks, 0)}</div>
          </div>
        </div>

        {/* Second calendar row (only in half mode) */}
        {shouldSplit && secondRowWeeks.length > 0 && (
          <div className="flex flex-col" style={{ gap: "0.5rem" }}>
            {/* Month labels row for second row */}
            {renderMonthLabels(secondRowMonthLabels)}

            {/* Calendar grid - Second row */}
            <div className="flex" style={{ gap: gapSize, minWidth: 0 }}>
              {/* Weekday labels column - GitHub style */}
              {!hideWeeks && (
                <div className="flex flex-col flex-shrink-0" style={{ width: "1.75rem", gap: gapSize }}>
                  {WEEKDAY_LABELS.map((label, weekdayIndex) => (
                    <div
                      key={weekdayIndex}
                      className="text-xs text-default-muted font-medium"
                      style={{
                        height: squareSize,
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        paddingRight: "0.25rem",
                      }}
                    >
                      {label && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-3px",
                          }}
                        >
                          {label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ minWidth: 0, flex: "1 1 auto" }}>{renderWeekRow(secondRowWeeks, 1)}</div>
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
    const sixMonthsAgo = firstDayOfLastSixMonths(allWeeks)

    allWeeks = allWeeks
      .map((week: any) => {
        // Filter days within the week to only include last 6 months
        const filteredDays = week.contributionDays.filter((day: any) => {
          return day.date >= sixMonthsAgo
        })

        // Only include weeks that have at least one day in the last 6 months
        if (filteredDays.length === 0) return null

        return {
          ...week,
          contributionDays: filteredDays,
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
                      width: "0.7rem",
                      height: "0.7rem",
                      backgroundColor: level.color,
                    }}
                  />
                  {index < CONTRIBUTION_LEVELS.length - 1 && <span className="text-default-muted/60">•</span>}
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

// The half terminal card fits 26 week columns.
const TERMINAL_HALF_WEEKS = 26

/**
 * The week columns a half terminal card draws: the newest 26 that are not all in the future.
 * GitHub returns the current year up to December 31, so the plain last 26 would be only
 * empty future weeks until July. A year with fewer than 26 weeks up to today keeps its first 26.
 */
function halfWindow(weeks: ContributionWeek[], today: string): ContributionWeek[] {
  let end = weeks.length
  while (end > TERMINAL_HALF_WEEKS && (weeks[end - 1]?.contributionDays[0]?.date ?? "") > today) end--
  return weeks.slice(Math.max(0, end - TERMINAL_HALF_WEEKS), end)
}

/** A week's days in rows Sunday to Saturday, `null` where the week has no day (the edges of a year). */
function daysByWeekday(week: ContributionWeek): Array<ContributionDay | null> {
  const days: Array<ContributionDay | null> = [null, null, null, null, null, null, null]
  for (const day of week.contributionDays) {
    const weekday = day.weekday ?? new Date(day.date).getUTCDay()
    if (weekday >= 0 && weekday < 7) days[weekday] = day
  }
  return days
}

const getContributionSymbol = (count: number): string => {
  if (count === 0) return "⬚"
  if (count <= 3) return "▢"
  if (count <= 6) return "▣"
  if (count <= 9) return "▥"
  return "▩"
}

/**
 * The 7 weekday rows of a week column, each a fixed 14px. The symbols fall back to another
 * font, and with rows sized by their content Firefox and WebKit drew each line 1px taller
 * than Chrome (7px per grid). A fixed track keeps the grid 98px in all three, the height
 * `calculateHeight` counts.
 */
const TERMINAL_WEEK_ROWS = "repeat(7, 14px)"

/**
 * The "N contributions" and "Total" line. With the font's own line height it was 19px in
 * Chrome and Firefox and 18px in WebKit; `calculateHeight` counts 19.
 */
const TERMINAL_TOTAL_LINE: React.CSSProperties = { lineHeight: "19px" }

/** One column per week, oldest on the left as on GitHub, each day on its weekday's row. */
const TerminalWeeks = ({ weeks }: { weeks: ContributionWeek[] }) => (
  <div className="inline-grid grid-flow-col gap-1 text-[0.75rem]">
    {weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="grid w-[0.60rem]" style={{ gridTemplateRows: TERMINAL_WEEK_ROWS }}>
        {daysByWeekday(week).map((day, weekday) =>
          day ? (
            <span
              key={weekday}
              title={`${day.contributionCount} contributions on ${formatDay(day.date)}`}
              className="flex items-center justify-center text-baseline w-full h-full"
              style={{
                color: getCalendarColor(day.color || ""),
              }}
            >
              {getContributionSymbol(day.contributionCount)}
            </span>
          ) : (
            <span key={weekday} />
          )
        )}
      </div>
    ))}
  </div>
)

const TerminalCalendar = ({
  data,
  size,
  config,
}: {
  data: GithubData["calendar"]
  size: "half" | "full"
  config: GithubConfig
}) => {
  const isHalfMode = size === "half"
  const yearMode = config.calendar_year_mode || "current_year"
  const today = new Date().toISOString().slice(0, 10)

  // Weeks in GitHub's order (oldest first). Full draws all of them, up to the 53 of a year
  // that starts late in the week; half draws `halfWindow`.
  const visibleWeeks = (weeks: ContributionWeek[]): ContributionWeek[] => {
    let shown = weeks
    if (yearMode === "last_6_months") {
      const sixMonthsAgo = firstDayOfLastSixMonths(weeks)

      // Days before the last 6 months leave the calendar, and weeks with none left go too
      shown = weeks
        .map((week) => ({
          ...week,
          contributionDays: week.contributionDays.filter((day) => day.date >= sixMonthsAgo),
        }))
        .filter((week) => week.contributionDays.length > 0)
    }
    return isHalfMode ? halfWindow(shown, today) : shown
  }

  // Se há múltiplos anos, exibir cada ano separadamente
  if (data.years && data.years.length > 1) {
    return (
      <div className="flex flex-col gap-3">
        {data.years.map((yearData) => (
          <div key={yearData.year} className="flex flex-col gap-2">
            <div className="text-terminal-warning text-sm font-semibold">
              {yearData.year} ({yearData.totalContributions} contributions)
            </div>
            <TerminalWeeks weeks={visibleWeeks(yearData.weeks)} />
          </div>
        ))}
        <div className="text-terminal-muted text-right" style={TERMINAL_TOTAL_LINE}>
          Total: {data.totalContributions} contributions
        </div>
      </div>
    )
  }

  // Exibição padrão (um ano ou todos os anos combinados)
  return (
    <div className="flex flex-col gap-2">
      <TerminalWeeks weeks={visibleWeeks(data.weeks)} />
      <div className="text-terminal-muted text-right" style={TERMINAL_TOTAL_LINE}>
        {data.totalContributions} contributions in the last{" "}
        {yearMode === "last_6_months"
          ? "6 months"
          : yearMode === "last_year"
            ? "year"
            : yearMode === "current_year"
              ? "year"
              : yearMode === "full"
                ? "period"
                : isHalfMode
                  ? "6 months"
                  : "year"}
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
                plugin: "github",
                section: "calendar",
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
