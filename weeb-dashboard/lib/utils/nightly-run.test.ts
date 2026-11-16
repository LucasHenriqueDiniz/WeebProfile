import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, it, expect } from "vitest"
import { NIGHTLY_CRON, nextRefreshAt, nightlyRunAfter, nightlyRunAtOrAfter, type RefreshState } from "./nightly-run"

const iso = (d: Date | null) => d?.toISOString() ?? null
const now = new Date("2026-11-16T10:00:00.000Z")
const healthy: RefreshState = {
  isPaused: false,
  status: "completed",
  forceRegenerate: false,
  nextRegenerationAt: "2026-11-17T02:07:00.000Z",
  lastGeneratedAt: "2026-11-16T03:07:00.000Z",
}

describe("NIGHTLY_CRON", () => {
  it("is the schedule the generator's cron trigger actually runs on", () => {
    const toml = readFileSync(path.join(__dirname, "../../../svg-generator/wrangler.toml"), "utf-8")
    expect(toml).toMatch(/^crons = \[(.*)\]$/m)
    expect(toml.match(/^crons = \[(.*)\]$/m)![1]).toBe(`"${NIGHTLY_CRON}"`)
  })
})

describe("nightlyRunAtOrAfter / nightlyRunAfter", () => {
  it("is today's run before 03:07 UTC and tomorrow's after it", () => {
    expect(iso(nightlyRunAtOrAfter(new Date("2026-11-16T01:00:00Z")))).toBe("2026-11-16T03:07:00.000Z")
    expect(iso(nightlyRunAtOrAfter(new Date("2026-11-16T03:08:00Z")))).toBe("2026-11-17T03:07:00.000Z")
  })

  it("counts the run at exactly 03:07 as at-or-after but not after", () => {
    const run = new Date("2026-11-16T03:07:00.000Z")
    expect(iso(nightlyRunAtOrAfter(run))).toBe("2026-11-16T03:07:00.000Z")
    expect(iso(nightlyRunAfter(run))).toBe("2026-11-17T03:07:00.000Z")
  })

  it("rolls over month and year ends", () => {
    expect(iso(nightlyRunAfter(new Date("2026-12-31T20:00:00Z")))).toBe("2027-01-01T03:07:00.000Z")
  })
})

describe("nextRefreshAt", () => {
  it("is the next night for an SVG the cron just regenerated (next_regeneration_at = run + 23h)", () => {
    expect(iso(nextRefreshAt(healthy, now))).toBe("2026-11-17T03:07:00.000Z")
  })

  it("is null for a paused SVG, which the cron skips", () => {
    expect(nextRefreshAt({ ...healthy, isPaused: true }, now)).toBeNull()
  })

  it.each([
    ["forced", { forceRegenerate: true, nextRegenerationAt: "2026-11-20T00:00:00Z" }],
    ["pending", { status: "pending", nextRegenerationAt: "2026-11-20T00:00:00Z" }],
  ])("is the next run for a %s SVG, whatever next_regeneration_at says", (_case, overrides) => {
    expect(iso(nextRefreshAt({ ...healthy, ...overrides }, now))).toBe("2026-11-17T03:07:00.000Z")
  })

  it("waits for the first run at or after next_regeneration_at (a failure's backoff)", () => {
    const failed = { ...healthy, status: "failed", nextRegenerationAt: "2026-11-19T02:07:00.000Z" }
    expect(iso(nextRefreshAt(failed, now))).toBe("2026-11-19T03:07:00.000Z")
  })

  // What rows written by the old manual regenerate (+24h from the click) look like.
  it("skips a night when next_regeneration_at falls after that night's run", () => {
    const flat24h = { ...healthy, nextRegenerationAt: "2026-11-17T10:00:00.000Z" }
    expect(iso(nextRefreshAt(flat24h, now))).toBe("2026-11-18T03:07:00.000Z")
  })

  it("is the next run when next_regeneration_at is already past", () => {
    const overdue = { ...healthy, nextRegenerationAt: "2026-11-10T00:00:00.000Z" }
    expect(iso(nextRefreshAt(overdue, now))).toBe("2026-11-17T03:07:00.000Z")
  })

  it("falls back to 24h after the last generation when next_regeneration_at is unset", () => {
    const legacy = { ...healthy, nextRegenerationAt: null, lastGeneratedAt: "2026-11-16T09:00:00.000Z" }
    expect(iso(nextRefreshAt(legacy, now))).toBe("2026-11-18T03:07:00.000Z")
    expect(iso(nextRefreshAt({ ...legacy, lastGeneratedAt: null }, now))).toBe("2026-11-17T03:07:00.000Z")
  })
})
