import { describe, it, expect, vi, afterEach } from "vitest"
import { fetchLyftaData } from "./fetchData"
import { lastWorkoutTopExercises, latestWorkout, lyftaOptions, topExercises } from "../selection"
import type { LyftaConfig } from "../types"

/**
 * Subrequests per Lyfta card. Every fetch here is one subrequest of the generator's
 * invocation, and each embedded image is also held in memory until the SVG is built.
 *
 * The account the audit sized this on: 100 workouts of 8 exercises, every exercise
 * with its own image, and a 300-entry catalog. Embedding all of it cost 1102
 * subrequests (100 × 8 + 300 + the 2 API calls) whatever sections were on.
 */

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])

function lyftaAccount() {
  const workouts = Array.from({ length: 100 }, (_, w) => ({
    id: w,
    title: `Workout ${w}`,
    workout_duration: "01:00:00",
    total_volume: 1000,
    workout_perform_date: new Date(Date.UTC(2026, 0, 1) + w * 86_400_000).toISOString(),
    exercises: Array.from({ length: 8 }, (_, e) => ({
      // 40 distinct exercises, so the "most performed" ranking has a real order.
      excercise_name: `Exercise ${(w * 8 + e) % 40}`,
      exercise_image: `https://img.lyfta.test/workout-${w}-exercise-${e}.png`,
      exercise_type: "chest_press",
      exercise_rest_time: 60,
      sets: [{ weight: String(20 + e), reps: "10", is_completed: true, duration: 30 }],
    })),
  }))
  const catalog = Array.from({ length: 300 }, (_, i) => ({
    name: `Exercise ${i}`,
    image_name: `https://img.lyfta.test/catalog-${i}.png`,
  }))
  return { workouts, catalog }
}

function serveLyfta() {
  const { workouts, catalog } = lyftaAccount()
  const fetched: string[] = []
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input instanceof Request ? input.url : input)
    fetched.push(url)
    if (url.includes("/api/v1/workouts")) return Response.json({ status: true, workouts })
    if (url.includes("/api/v1/exercises")) return Response.json({ exercises: catalog })
    if (url.startsWith("https://img.lyfta.test/"))
      return new Response(PNG, { headers: { "content-type": "image/png" } })
    throw new Error(`unexpected fetch: ${url}`)
  })
  return fetched
}

const card = (sections: string[], nonEssential: LyftaConfig["nonEssential"] = {}) =>
  ({ enabled: true, sections, nonEssential }) as unknown as LyftaConfig

afterEach(() => vi.restoreAllMocks())

describe("fetchLyftaData: subrequests per card", () => {
  it.each([
    [["statistics"], 1],
    [["overview", "recent_workouts"], 1],
    [["exercises"], 2 + 5],
    [["last_workout"], 1 + 5],
    [["statistics", "overview", "recent_workouts", "exercises", "last_workout"], 2 + 5 + 5],
  ])("%j costs %i, not 1102", async (sections, expected) => {
    const fetched = serveLyfta()
    vi.spyOn(console, "log").mockImplementation(() => {})

    await fetchLyftaData(card(sections), false, "key")

    expect(fetched).toHaveLength(expected)
  })

  it("stays bounded at the largest list the options allow", async () => {
    const fetched = serveLyfta()

    await fetchLyftaData(
      card(["exercises", "last_workout"], { exercises_max: 20, last_workout_max_exercises: 10 }),
      false,
      "key"
    )

    expect(fetched.length).toBeLessThanOrEqual(2 + 20 + 8) // the last workout has 8 exercises
  })

  it("skips the images when the exercises section hides them", async () => {
    const fetched = serveLyfta()

    await fetchLyftaData(card(["exercises"], { exercises_hide_images: true }), false, "key")

    expect(fetched).toHaveLength(2)
  })
})

describe("fetchLyftaData: the images that are drawn are the ones embedded", () => {
  it("embeds every image the exercises and last_workout sections show", async () => {
    serveLyfta()
    const config = card(["exercises", "last_workout"], { exercises_max: 7, last_workout_max_exercises: 4 })

    const data = await fetchLyftaData(config, false, "key")
    const options = lyftaOptions(config)

    const drawnInExercises = topExercises(data, options).map((exercise) => exercise.image)
    const drawnInLastWorkout = lastWorkoutTopExercises(latestWorkout(data.workouts)!, options).map(
      ({ exercise }) => exercise.exercise_image
    )
    expect(drawnInExercises).toHaveLength(7)
    expect(drawnInLastWorkout).toHaveLength(4)
    for (const image of [...drawnInExercises, ...drawnInLastWorkout]) {
      expect(image).toMatch(/^data:image\/png;base64,/)
    }
  })

  it("leaves no remote image URL in the data", async () => {
    serveLyfta()

    const data = await fetchLyftaData(card(["exercises", "last_workout", "statistics"]), false, "key")

    expect(JSON.stringify(data)).not.toContain("https://img.lyfta.test/")
  })
})
