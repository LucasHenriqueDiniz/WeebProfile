export interface CommitData {
  date: string
  contributionCount: number
  commitCount: number
}

export interface CommitStats {
  averageChangesPerCommit: number
  totalFilesChanged: number
  largestCommit: number
}

export interface TimeRange {
  start: string
  end: string
}

export interface CodeHabitsData {
  commitsByHour: {
    [key: number]: number
  }
  commitsByDay: {
    [key: string]: number
  }
  totalCommits: number
  languages: {
    [key: string]: number // extension -> count
  }
  fileTypes: {
    [key: string]: number // filename -> count
  }
  commitStats: CommitStats
  analyzedCommits: number
  timeRange: TimeRange
}
