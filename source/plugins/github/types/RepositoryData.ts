export interface RepositoryData {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  forkCount: number
  watchers: {
    totalCount: number
  }
  releases: {
    totalCount: number
  }
  packages: {
    totalCount: number
  }
  licenseInfo: {
    name: string
  } | null
}

export interface RepositoriesData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repositories: any[]
  totalDiskUsage: number
  favoriteLicense: {
    name: string
    count: number
  }
  sponsoringCount: number
}
