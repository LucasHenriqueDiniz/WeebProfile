/**
 * Screenshots of the pages of the websites plugin, for sites whose thumbnail is set to
 * "screenshot" (weeb-plugins/src/plugins/websites/services/screenshot.ts calls this
 * through globalThis).
 *
 * Taken with a Browser Run Quick Action (the BROWSER binding) and kept in R2 under
 * screenshots/, one per URL. A copy younger than SCREENSHOT_FRESH_MS is used as is; an
 * older one is retaken, and still used if retaking fails. Browser time is billed (10 h a
 * month come with Workers Paid; one page took 3 to 18 s, measured 18/11/2026), and the
 * cron regenerates every card daily, so without the cache each site would cost a
 * screenshot a day.
 *
 * Cookie banners and ads cover the page in a screenshot. Ad requests are blocked, and a
 * stylesheet hides consent banners. It is CSS and not a script because a page's CSP
 * blocks an injected script (heartopia.guide does) far more often than an inline style.
 */

import type { BrowserRun, R2Bucket } from "@cloudflare/workers-types"
import { log } from "../utils/log.js"

export const SCREENSHOT_FRESH_MS = 7 * 24 * 60 * 60 * 1000
/** Past this, the generation stops waiting and the site uses its preview image. */
export const SCREENSHOT_WAIT_MS = 25_000
/** Same cap as the plugin's other thumbnails. */
export const SCREENSHOT_MAX_BYTES = 300_000
const VIEWPORT = { width: 1200, height: 630 }

/** Consent banners: by label, id or class, plus the usual consent managers. */
const HIDE_OVERLAYS = `
body [aria-label*="cookie" i], body [aria-label*="consent" i], body [id*="cookie" i], body [id*="consent" i],
body [class*="cookie-banner" i], body [class*="cookie-consent" i], body [class*="cookie-notice" i],
body [class*="cookiebanner" i], #onetrust-consent-sdk, #CybotCookiebotDialog, #didomi-host,
.qc-cmp2-container, #usercentrics-root, .fc-consent-root, .cky-consent-container, .osano-cm-window,
ins.adsbygoogle, iframe[src*="googlesyndication"], iframe[id^="google_ads"]
{ display: none !important; }`

/** Ad networks (regular expressions, as Browser Run takes them). */
const BLOCKED_REQUESTS = [
  "googlesyndication\\.com",
  "doubleclick\\.net",
  "adservice\\.google\\.",
  "googletagservices\\.com",
  "fundingchoicesmessages\\.google\\.com",
]

export interface ScreenshotEnv {
  BROWSER?: Pick<BrowserRun, "quickAction">
  SCREENSHOTS?: Pick<R2Bucket, "get" | "put">
}

async function cacheKey(url: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(url))
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
  return `screenshots/${hex}.jpg`
}

function toDataUri(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return `data:image/jpeg;base64,${btoa(binary)}`
}

const isJpeg = (bytes: Uint8Array) => bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff

async function capture(browser: Pick<BrowserRun, "quickAction">, url: string): Promise<Uint8Array | null> {
  const host = new URL(url).hostname
  const response = await browser.quickAction("screenshot", {
    url,
    viewport: VIEWPORT,
    screenshotOptions: { type: "jpeg", quality: 72 },
    gotoOptions: { waitUntil: "networkidle2", timeout: 15_000 },
    // A page that never goes quiet (DropCut) is taken as it is when the wait runs out.
    bestAttempt: true,
    waitForTimeout: 2_500,
    rejectRequestPattern: BLOCKED_REQUESTS,
    addStyleTag: [{ content: HIDE_OVERLAYS }],
  })
  const browserMs = Math.round(Number(response.headers.get("X-Browser-Ms-Used")) || 0)
  if (!response.ok || !(response.headers.get("Content-Type") ?? "").startsWith("image/jpeg")) {
    log.warn("screenshot.failed", { host, status: response.status, browserMs })
    return null
  }
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (!isJpeg(bytes) || bytes.length > SCREENSHOT_MAX_BYTES) {
    log.warn("screenshot.rejected", { host, bytes: bytes.length, browserMs })
    return null
  }
  log.info("screenshot.taken", { host, bytes: bytes.length, browserMs })
  return bytes
}

const timeout = (ms: number) => new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))

/**
 * The function the websites plugin calls: a data URI of the page, or null. Never throws.
 * `now` is injectable for tests.
 */
export function makeSiteScreenshot(env: ScreenshotEnv, now: () => number = Date.now) {
  return async (url: string): Promise<string | null> => {
    const { BROWSER, SCREENSHOTS } = env
    if (!BROWSER || !SCREENSHOTS) return null
    const host = new URL(url).hostname

    const key = await cacheKey(url)
    let cached: Uint8Array | null = null
    let takenAt = 0
    try {
      const object = await SCREENSHOTS.get(key)
      if (object) {
        cached = new Uint8Array(await object.arrayBuffer())
        takenAt = Number(object.customMetadata?.takenAt) || 0
      }
    } catch (error) {
      log.warn("screenshot.cache_unreadable", { host, reason: error instanceof Error ? error.message : String(error) })
    }
    if (cached && now() - takenAt < SCREENSHOT_FRESH_MS) return toDataUri(cached)

    let fresh: Uint8Array | null = null
    try {
      fresh = await Promise.race([capture(BROWSER, url), timeout(SCREENSHOT_WAIT_MS)])
    } catch (error) {
      log.warn("screenshot.failed", { host, reason: error instanceof Error ? error.message : String(error) })
    }
    if (!fresh) return cached ? toDataUri(cached) : null

    try {
      await SCREENSHOTS.put(key, fresh, {
        httpMetadata: { contentType: "image/jpeg" },
        customMetadata: { takenAt: String(now()), url },
      })
    } catch (error) {
      log.warn("screenshot.cache_unwritable", { host, reason: error instanceof Error ? error.message : String(error) })
    }
    return toDataUri(fresh)
  }
}
