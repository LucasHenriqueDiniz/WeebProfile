/**
 * The way from a copied snippet to the user's GitHub profile.
 *
 * GitHub shows the README.md of the public repository named after the account
 * (<login>/<login>) at the top of the profile page. These build the links into it,
 * resolved through GitHub's public API: unauthenticated, CORS-enabled, 60 requests an
 * hour per IP, and a page view costs one or two.
 */

/** GitHub logins: letters, digits and single hyphens, not at either end, up to 39 characters. */
const LOGIN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

export function isGithubLogin(value: string): boolean {
  return LOGIN.test(value)
}

/** `?name=` fills in the repository name; GitHub itself then explains the special repository. */
export function createProfileRepoUrl(login: string): string {
  return `https://github.com/new?name=${encodeURIComponent(login)}`
}

export function profileRepoUrl(login: string): string {
  return `https://github.com/${login}/${login}`
}

interface SvgWithPlugins {
  pluginsConfig: unknown
}

/**
 * The best guess at the user's GitHub login: the GitHub account they signed in with,
 * else the username of a github plugin in one of their SVGs (current one first).
 */
export function guessGithubLogin(signedInLogin: string | null | undefined, svgs: SvgWithPlugins[]): string | null {
  if (signedInLogin && isGithubLogin(signedInLogin)) return signedInLogin
  for (const svg of svgs) {
    const config = svg.pluginsConfig as { github?: { username?: unknown } } | null
    const username = config?.github?.username
    if (typeof username === "string" && isGithubLogin(username.trim())) return username.trim()
  }
  return null
}

/**
 * Where "open my README" should go.
 *
 * - edit: the README's editor. It needs the branch's name: `edit/HEAD/README.md` is a
 *   404 on GitHub (checked logged in, 15/11/2026), and `blob/HEAD` resolves to a bare
 *   commit, which has no edit button.
 * - add-readme: the repository exists without a README.
 * - no-repo: there is no <login>/<login> yet.
 * - unknown: the API did not answer (rate limit, network); the repository page is the
 *   best link left.
 */
export type ProfileReadmeTarget =
  | { kind: "edit"; url: string }
  | { kind: "add-readme"; url: string }
  | { kind: "no-repo"; url: string }
  | { kind: "unknown"; url: string }

export async function resolveProfileReadme(
  login: string,
  fetchJson: typeof fetch = (input, init) => fetch(input, init)
): Promise<ProfileReadmeTarget> {
  const api = `https://api.github.com/repos/${login}/${login}`
  const unknown: ProfileReadmeTarget = { kind: "unknown", url: profileRepoUrl(login) }
  const headers = { Accept: "application/vnd.github+json" }
  try {
    const readme = await fetchJson(`${api}/readme`, { headers })
    if (readme.ok) {
      const { html_url } = (await readme.json()) as { html_url?: string }
      const blob = `${profileRepoUrl(login)}/blob/`
      return html_url?.startsWith(blob) ? { kind: "edit", url: html_url.replace("/blob/", "/edit/") } : unknown
    }
    if (readme.status !== 404) return unknown

    const repo = await fetchJson(api, { headers })
    if (repo.status === 404) return { kind: "no-repo", url: createProfileRepoUrl(login) }
    if (!repo.ok) return unknown
    const { default_branch } = (await repo.json()) as { default_branch?: string }
    return default_branch
      ? { kind: "add-readme", url: `${profileRepoUrl(login)}/new/${default_branch}?filename=README.md` }
      : unknown
  } catch {
    return unknown
  }
}
