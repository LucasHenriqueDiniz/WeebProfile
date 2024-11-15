export interface ContributionDay {
  color: string
  contributionCount: number
  date: string
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export interface UserResponse {
  name: string
  login: string
  avatarUrl: string
  createdAt: string
  followers: number
  following: number
  contributionCalendar: {
    totalContributions: number
    weeks: ContributionWeek[]
  }
  repositoriesContributedTo: number
}
