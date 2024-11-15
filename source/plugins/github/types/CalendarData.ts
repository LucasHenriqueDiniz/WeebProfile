export interface CalendarDay {
  color: string
  contributionCount: number
  date: string
  weekday: number
}

export interface CalendarWeek {
  contributionDays: CalendarDay[]
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: CalendarWeek[]
}

export interface CalendarData {
  totalContributions: number
  weeks: CalendarWeek[]
}
