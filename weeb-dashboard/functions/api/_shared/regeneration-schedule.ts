/**
 * When the nightly cron should next try an SVG.
 *
 * The cron (svg-generator's scheduled handler, once a day) keeps asking for batches
 * of 50 while they come back full, up to 20. An SVG it has tried must therefore leave
 * the due set until a later night, or the next batch selects it again: failures used
 * to stay due forever, so the same 50 broken cards filled all 20 batches -- 1000
 * generator calls a night, each burning the user's API keys -- and whatever sorted
 * after them waited.
 */

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Scheduled this much before the target, so the run that starts at the same minute
 * on that night finds it due. At exactly +24h, a run that starts a few seconds
 * earlier than this one did skips the SVG for a whole day.
 */
const EARLY_MS = 60 * 60 * 1000

/** Nights to wait after the n-th consecutive failure: 1, 2, 4, then a week. */
export function retryDelayNights(failCount: number): number {
  return Math.min(2 ** Math.max(failCount - 1, 0), 7)
}

/** The ISO time `nights` cron runs from now. */
export function nightsFrom(now: Date, nights: number): string {
  return new Date(now.getTime() + nights * DAY_MS - EARLY_MS).toISOString()
}
