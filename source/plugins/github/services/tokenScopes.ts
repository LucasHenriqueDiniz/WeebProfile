import axios from "axios"

export interface TokenScopes {
  repo: boolean
  "repo:status": boolean
  repo_deployment: boolean
  public_repo: boolean
  "repo:invite": boolean
  security_events: boolean
  workflow: boolean
  "write:packages": boolean
  "read:packages": boolean
  "delete:packages": boolean
  "admin:org": boolean
  "write:org": boolean
  "read:org": boolean
  "manage_runners:org": boolean
  "admin:public_key": boolean
  "write:public_key": boolean
  "read:public_key": boolean
  "admin:repo_hook": boolean
  "write:repo_hook": boolean
  "read:repo_hook": boolean
  "admin:org_hook": boolean
  gist: boolean
  notifications: boolean
  user: boolean
  "read:user": boolean
  "user:email": boolean
  "user:follow": boolean
  delete_repo: boolean
  "write:discussion": boolean
  "read:discussion": boolean
  "admin:enterprise": boolean
  "manage_runners:enterprise": boolean
  "manage_billing:enterprise": boolean
  "read:enterprise": boolean
  "scim:enterprise": boolean
  audit_log: boolean
  "read:audit_log": boolean
  codespace: boolean
  "codespace:secrets": boolean
  copilot: boolean
  "manage:billing:copilot": boolean
  project: boolean
  "read:project": boolean
  "admin:gpg_key": boolean
  "write:gpg_key": boolean
  "read:gpg_key": boolean
  "admin:ssh_signing_key": boolean
  "write:ssh_signing_key": boolean
  "read:ssh_signing_key": boolean
}

const SECTION_SCOPES: { [key: string]: string[] } = {
  profile: ["read:user"],
  repositories: ["public_repo", "read:org"],
  activity: ["read:user", "read:org"],
  calendar: ["read:user"],
  code_habits: ["public_repo"],
  favorite_languages: ["public_repo"],
  favorite_license: ["public_repo"],
}

let cachedTokenScopes: TokenScopes | null = null

export async function getTokenScopes(token: string): Promise<TokenScopes> {
  if (cachedTokenScopes) return cachedTokenScopes

  const response = await axios.get("https://api.github.com", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status !== 200) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const scopesHeader = response.headers["x-oauth-scopes"]
  if (!scopesHeader) {
    throw new Error("No scopes found in GitHub response")
  }

  const scopes = scopesHeader.split(",").map((s: string) => s.trim())
  const scopesResponse = {
    repo: false,
  } as TokenScopes

  scopes.forEach((scope: string) => {
    if (scope === "repo") {
      scopesResponse.repo = true
      scopesResponse["repo:status"] = true
      scopesResponse.repo_deployment = true
      scopesResponse.public_repo = true
      scopesResponse["repo:invite"] = true
      scopesResponse.security_events = true
    } else if (scope === "user") {
      scopesResponse.user = true
      scopesResponse["user:follow"] = true
      scopesResponse["user:email"] = true
      scopesResponse["read:user"] = true
    } else if (scope === "admin:org") {
      scopesResponse["admin:org"] = true
      scopesResponse["write:org"] = true
      scopesResponse["read:org"] = true
      scopesResponse["manage_runners:org"] = true
    } else if (scope === "admin:public_key") {
      scopesResponse["admin:public_key"] = true
      scopesResponse["write:public_key"] = true
      scopesResponse["read:public_key"] = true
    } else if (scope === "admin:repo_hook") {
      scopesResponse["admin:repo_hook"] = true
      scopesResponse["write:repo_hook"] = true
      scopesResponse["read:repo_hook"] = true
    } else if (scope === "admin:enterprise") {
      scopesResponse["admin:enterprise"] = true
      scopesResponse["manage_runners:enterprise"] = true
      scopesResponse["manage_billing:enterprise"] = true
      scopesResponse["read:enterprise"] = true
    } else if (scope === "write:packages") {
      scopesResponse["write:packages"] = true
      scopesResponse["read:packages"] = true
    } else if (scope === "admin:gpg_key") {
      scopesResponse["admin:gpg_key"] = true
      scopesResponse["write:gpg_key"] = true
      scopesResponse["read:gpg_key"] = true
    } else if (scope === "admin:ssh_signing_key") {
      scopesResponse["admin:ssh_signing_key"] = true
      scopesResponse["write:ssh_signing_key"] = true
      scopesResponse["read:ssh_signing_key"] = true
    } else {
      scopesResponse[scope as keyof TokenScopes] = true
    }
  })

  cachedTokenScopes = scopesResponse
  return scopesResponse
}

export function checkSectionScopes(scopes: TokenScopes, section: string): boolean {
  const sectionScopes = SECTION_SCOPES[section]
  if (!sectionScopes) return true

  return sectionScopes.every((scope) => {
    if (scope === "public_repo" && (scopes.repo || scopes.public_repo)) return true
    if (scope === "read:user" && (scopes.user || scopes["read:user"])) return true
    if (scope === "read:org" && (scopes["admin:org"] || scopes["write:org"] || scopes["read:org"])) return true

    return scopes[scope as keyof TokenScopes]
  })
}
