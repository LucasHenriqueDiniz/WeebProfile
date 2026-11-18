/**
 * A screenshot of a site's page, for sites whose thumbnail is set to "screenshot".
 *
 * The plugin cannot take one itself: that needs a browser, which the svg-generator
 * Worker has through Browser Run, with a cache in R2 (svg-generator/src/screenshots).
 * The Worker installs the function on globalThis, as it does the jikan-edge binding for
 * the MyAnimeList plugin. Anywhere else (tests, scripts, the dashboard) there is none,
 * and the site falls back to its preview image.
 */

/** Resolves to a data URI (image/jpeg), or null when there is no screenshot. */
export type SiteScreenshotFn = (url: string) => Promise<string | null>

type ScreenshotRuntime = typeof globalThis & { __weebSiteScreenshot?: SiteScreenshotFn }

export async function siteScreenshot(url: string): Promise<string | null> {
  const take = (globalThis as ScreenshotRuntime).__weebSiteScreenshot
  if (!take) return null
  try {
    return await take(url)
  } catch {
    return null
  }
}
