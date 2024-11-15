export interface GitHubEvent {
  type: "PullRequestEvent" | "CreateEvent" | "IssueEvent" | "PushEvent"
  action?: string
  pullRequest?: {
    title: string
    repository: {
      name: string
    }
    changedFiles: number
    additions: number
    deletions: number
  }
  ref?: string
  refType?: string
  repository: {
    name: string
  }
  issue?: {
    title: string
  }
  pushSize?: number
  createdAt: string
}

export interface EventsData {
  events: {
    nodes: GitHubEvent[]
  }
}
