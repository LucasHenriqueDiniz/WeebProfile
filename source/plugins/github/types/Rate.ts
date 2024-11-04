export interface RateLimit {
  resources: Resources
  rate: Response
}

export interface Resources {
  core: Response
  graphql: Response
  integration_manifest: Response
  search: Response
}

export interface Response {
  limit: number
  remaining: number
  reset: number
  used: number
  resource: string
}

export default RateLimit
