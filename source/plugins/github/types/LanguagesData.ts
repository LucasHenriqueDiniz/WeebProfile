export interface LanguageNode {
  name: string
  color: string
}

export interface LanguageEdge {
  size: number
  node: LanguageNode
}

export interface Repository {
  languages: {
    edges: LanguageEdge[]
  }
}

export interface LanguagesResponse {
  data: {
    user: {
      repositories: {
        nodes: Repository[]
      }
    }
  }
}

export interface ProcessedLanguage {
  name: string
  color: string
  percentage: number
  size: number
}
