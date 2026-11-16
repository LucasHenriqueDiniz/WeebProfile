/**
 * When the nightly regeneration runs, and so when a given SVG will next be refreshed.
 *
 * Shared by the manual regenerate route, which schedules the next refresh, and the
 * SVG page, which shows it.
 */

/** svg-generator/wrangler.toml, `[triggers] crons`, in UTC. nightly-run.test.ts keeps the two equal. */
export const NIGHTLY_CRON = "7 3 * * *"

const [RUN_MINUTE_UTC, RUN_HOUR_UTC] = NIGHTLY_CRON.split(" ").map(Number)

const DAY_MS = 24 * 60 * 60 * 1000

/** The first nightly run at `time` or later. */
export function nightlyRunAtOrAfter(time: Date): Date {
  const run = new Date(
    Date.UTC(time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(), RUN_HOUR_UTC, RUN_MINUTE_UTC)
  )
  return run.getTime() >= time.getTime() ? run : new Date(run.getTime() + DAY_MS)
}

/** The first nightly run strictly after `time`. */
export function nightlyRunAfter(time: Date): Date {
  return nightlyRunAtOrAfter(new Date(time.getTime() + 1))
}

/** The columns of an SVG row the cron's "is it due" check reads. */
export interface RefreshState {
  isPaused: boolean
  status: string
  forceRegenerate: boolean
  nextRegenerationAt: string | null
  lastGeneratedAt: string | null
}

/**
 * The nightly run that will next regenerate this SVG, or null if none will.
 *
 * Mirrors the due condition in functions/api/cron/generate-svgs.ts: a run picks the SVG
 * when it is forced, pending, past its next_regeneration_at, or (with none set) never
 * generated or generated 24h or more before the run. It does not account for a night
 * with more due SVGs than the cron's batches cover.
 */
export function nextRefreshAt(svg: RefreshState, now: Date): Date | null {
  if (svg.isPaused) return null
  const nextRun = nightlyRunAfter(now)
  if (svg.forceRegenerate || svg.status === "pending") return nextRun

  const dueFrom = svg.nextRegenerationAt
    ? new Date(svg.nextRegenerationAt)
    : svg.lastGeneratedAt
      ? new Date(new Date(svg.lastGeneratedAt).getTime() + DAY_MS)
      : null
  if (!dueFrom || dueFrom.getTime() <= nextRun.getTime()) return nextRun
  return nightlyRunAtOrAfter(dueFrom)
}
