export interface RepositoryWithLanguages {
  languages: {
    edges: Array<{
      size: number
      node: {
        name: string
        color: string
      }
    }>
  }
}
