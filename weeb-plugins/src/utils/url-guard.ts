/**
 * Guard for user-supplied URLs that the generator fetches server-side.
 *
 * Every other plugin talks to a fixed, known host. The websites plugin is the
 * first one to fetch URLs the user typed, so the Worker needs an explicit check
 * against pointing those requests back at private infrastructure (SSRF).
 *
 * DNS is not resolved here (there is no resolver in the Workers runtime), so a
 * public hostname resolving to a private address still gets through. This blocks
 * the direct cases: non-https schemes, embedded credentials, odd ports, internal
 * hostnames and private/reserved IP literals.
 */

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UnsafeUrlError"
  }
}

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "ip6-localhost",
  "ip6-loopback",
  "metadata",
  "metadata.google.internal",
])

const BLOCKED_HOSTNAME_SUFFIXES = [".localhost", ".local", ".internal", ".localdomain", ".home.arpa"]

function isBlockedIpv4(hostname: string): boolean {
  const parts = hostname.split(".")
  if (parts.length !== 4) return false

  const octets: number[] = []
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return false
    const value = Number(part)
    if (value > 255) return false
    octets.push(value)
  }

  const [a, b] = octets as [number, number, number, number]
  if (a === 0) return true // 0.0.0.0/8 ("this network")
  if (a === 10) return true // private
  if (a === 127) return true // loopback
  if (a === 100 && b >= 64 && b <= 127) return true // carrier-grade NAT
  if (a === 169 && b === 254) return true // link-local (cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true // private
  if (a === 192 && b === 168) return true // private
  if (a === 192 && b === 0) return true // IETF protocol assignments
  if (a === 198 && (b === 18 || b === 19)) return true // benchmarking
  if (a >= 224) return true // multicast + reserved + broadcast
  return false
}

function isBlockedIpv6(hostname: string): boolean {
  // URL.hostname keeps IPv6 literals wrapped in brackets.
  if (!hostname.startsWith("[") || !hostname.endsWith("]")) return false
  const address = hostname.slice(1, -1).toLowerCase()

  if (address === "::" || address === "::1") return true

  // IPv4-mapped addresses. `new URL()` normalizes ::ffff:127.0.0.1 into the hex
  // form ::ffff:7f00:1, so both spellings have to be handled.
  const mappedDotted = address.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/)
  if (mappedDotted) return isBlockedIpv4(mappedDotted[1]!)
  const mappedHex = address.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (mappedHex) {
    const high = parseInt(mappedHex[1]!, 16)
    const low = parseInt(mappedHex[2]!, 16)
    return isBlockedIpv4(`${high >> 8}.${high & 0xff}.${low >> 8}.${low & 0xff}`)
  }

  const firstGroup = address.split(":", 1)[0] ?? ""
  if (/^f[cd]/.test(firstGroup)) return true // unique local fc00::/7
  if (/^fe[89ab]/.test(firstGroup)) return true // link-local fe80::/10
  if (/^ff/.test(firstGroup)) return true // multicast
  return false
}

/**
 * Validates a user-supplied URL and returns it parsed.
 *
 * @throws {UnsafeUrlError} when the URL is malformed or points somewhere the
 *   generator must not reach.
 */
export function assertSafePublicUrl(raw: string): URL {
  if (typeof raw !== "string" || raw.trim() === "") throw new UnsafeUrlError("Empty URL")

  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    throw new UnsafeUrlError(`Malformed URL: ${raw}`)
  }

  if (url.protocol !== "https:") throw new UnsafeUrlError("Only https:// URLs are allowed")
  if (url.username !== "" || url.password !== "")
    throw new UnsafeUrlError("URLs with embedded credentials are not allowed")
  if (url.port !== "" && url.port !== "443") throw new UnsafeUrlError(`Port ${url.port} is not allowed`)

  const hostname = url.hostname.toLowerCase()
  if (hostname === "") throw new UnsafeUrlError("URL has no hostname")
  if (BLOCKED_HOSTNAMES.has(hostname)) throw new UnsafeUrlError(`Hostname ${hostname} is not allowed`)
  if (BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    throw new UnsafeUrlError(`Hostname ${hostname} is not allowed`)
  }
  if (isBlockedIpv4(hostname) || isBlockedIpv6(hostname)) {
    throw new UnsafeUrlError(`Address ${hostname} is not publicly routable`)
  }

  return url
}

/** Non-throwing variant, for filtering lists of URLs. */
export function isSafePublicUrl(raw: string): boolean {
  try {
    assertSafePublicUrl(raw)
    return true
  } catch {
    return false
  }
}
