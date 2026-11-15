/**
 * What the user typed while copying a snippet: an SVG's alt text and their GitHub login.
 * Only matters at copy time, since the README keeps what was pasted, so it lives in
 * this browser. Storage can be missing or throw (private mode, blocked site data); then
 * nothing is remembered and the defaults apply.
 */

const altKey = (svgId: string) => `weeb:embed-alt:${svgId}`
const GITHUB_LOGIN_KEY = "weeb:github-login"

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value) window.localStorage.setItem(key, value)
    else window.localStorage.removeItem(key)
  } catch {
    // Not remembered; the snippet still uses the value typed.
  }
}

/** The alt text to put in an SVG's snippet: what the user typed for it, else its name. */
export function embedAltFor(svg: { id: string; name: string }): string {
  return read(altKey(svg.id))?.trim() || svg.name
}

export const readEmbedAlt = (svgId: string) => read(altKey(svgId))
export const writeEmbedAlt = (svgId: string, alt: string) => write(altKey(svgId), alt.trim() ? alt : null)

export const readGithubLogin = () => read(GITHUB_LOGIN_KEY)
export const writeGithubLogin = (login: string) => write(GITHUB_LOGIN_KEY, login.trim() || null)
