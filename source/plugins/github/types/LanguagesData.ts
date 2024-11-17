export interface LanguagesResponse {
  data?: {
    user?: {
      repositories: {
        nodes: Array<{
          languages?: {
            edges: Array<{
              node: {
                name: string
                color: string
              }
              size: number
            }>
          }
        }>
      }
    }
  }
  errors?: Array<{ message: string }>
}

export interface ProcessedLanguage {
  name: string
  color: string
  size: number
}
