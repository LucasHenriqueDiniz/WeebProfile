/**
 * What the Lyfta sections show, in one place, so fetchData can embed exactly the
 * images a section draws and nothing else.
 *
 * fetchData used to embed every exercise image of all 100 workouts plus the whole
 * exercise catalog, whichever sections were on: 1102 subrequests for a card with only
 * `statistics`, and up to ~1100 images of 250 KB held at once in a 128 MB isolate.
 * Only `exercises` and `last_workout` draw images, a handful each.
 */

import type { LyftaConfig, LyftaData, LyftaExercise, LyftaNonEssentialConfig, LyftaWorkout } from "./types"
import { calculate1RM } from "./utils/1rm"
import { durationMinutes } from "./utils/format"

/**
 * The section options the components read. Kept here so the components, the height
 * and fetchData agree on them -- if they read different objects, fetchData would
 * embed the images for a different list than the one drawn.
 */
export function lyftaOptions(config: LyftaConfig): LyftaNonEssentialConfig {
  return config.nonEssential || {}
}

export interface TopExercise {
  name: string
  count: number
  /** kg, the heaviest set */
  bestWeight: number
  /** kg, Brzycki estimate from the best set */
  best1RM: number
  image: string | null
}

/** The `exercises` section's list: most performed first, with the image it draws. */
export function topExercises(
  data: Pick<LyftaData, "workouts" | "exercises">,
  options: LyftaNonEssentialConfig
): TopExercise[] {
  const maxExercises = options.exercises_max || 5

  const exerciseStats = new Map<string, { count: number; bestWeight: number; best1RM: number }>()

  data.workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const exerciseName = exercise.excercise_name?.trim()
      if (!exerciseName) return

      const stats = exerciseStats.get(exerciseName) || { count: 0, bestWeight: 0, best1RM: 0 }

      stats.count++

      // set.weight is in kg. All sets count, not only completed ones.
      exercise.sets.forEach((set) => {
        if (set.weight && set.reps) {
          const weightKg = parseFloat(set.weight)
          const reps = parseInt(set.reps, 10)
          if (!isNaN(weightKg) && !isNaN(reps) && weightKg > 0 && reps > 0) {
            if (weightKg > stats.bestWeight) {
              stats.bestWeight = weightKg
            }
            const oneRM = calculate1RM(weightKg, reps)
            if (oneRM > stats.best1RM) {
              stats.best1RM = oneRM
            }
          }
        }
      })

      exerciseStats.set(exerciseName, stats)
    })
  })

  // Images from the catalog first, then from the workouts, which win.
  const exerciseImageMap = new Map<string, string>()
  data.exercises.forEach((ex) => {
    if (ex.name && ex.image_name) {
      const normalizedName = ex.name.trim()
      exerciseImageMap.set(normalizedName, ex.image_name)
      exerciseImageMap.set(normalizedName.toLowerCase(), ex.image_name)
    }
  })
  data.workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const exerciseName = exercise.excercise_name?.trim()
      if (exerciseName && exercise.exercise_image) {
        exerciseImageMap.set(exerciseName, exercise.exercise_image)
        exerciseImageMap.set(exerciseName.toLowerCase(), exercise.exercise_image)
      }
    })
  })

  return Array.from(exerciseStats.entries())
    .map(([name, stats]) => {
      const normalizedName = name.trim()
      const image = exerciseImageMap.get(normalizedName) || exerciseImageMap.get(normalizedName.toLowerCase()) || null

      return {
        name: normalizedName,
        count: stats.count,
        bestWeight: stats.bestWeight,
        best1RM: stats.best1RM,
        image,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, maxExercises)
}

/** The most recent workout, without reordering the caller's array. */
export function latestWorkout(workouts: LyftaWorkout[]): LyftaWorkout | undefined {
  return [...workouts].sort(
    (a, b) => new Date(b.workout_perform_date).getTime() - new Date(a.workout_perform_date).getTime()
  )[0]
}

/** Completed sets with reps, as numbers (kg; 0 for a set without a load). */
export function completedSets(exercise: LyftaExercise): Array<{ weight: number; reps: number }> {
  return exercise.sets.flatMap((set) => {
    if (!set.is_completed || !set.reps) return []
    const weight = parseFloat(set.weight ?? "0") || 0
    const reps = parseInt(set.reps, 10)
    return Number.isFinite(reps) && reps > 0 && weight >= 0 ? [{ weight, reps }] : []
  })
}

/**
 * An exercise's volume (kg) the way Lyfta counts it: weight × reps per completed set,
 * twice for `db_2_simultaneous` (a dumbbell in each hand, the weight logged per hand).
 * With the doubling the exercises add up to the workout's own `total_volume` in the 8
 * most recent workouts of the mock (which came from a real account); without it they
 * fell 1,100 to 1,700 kg short, and the section's header and its list disagreed.
 */
export function exerciseVolume(exercise: LyftaExercise): number {
  const perHand = completedSets(exercise).reduce((acc, { weight, reps }) => acc + weight * reps, 0)
  return exercise.exercise_type === "db_2_simultaneous" ? perHand * 2 : perHand
}

/** A workout's volume (kg): Lyfta's own `total_volume`, or the sum of its exercises. */
export function workoutVolume(workout: Pick<LyftaWorkout, "total_volume" | "exercises">): number {
  if (workout.total_volume > 0) return workout.total_volume
  return (workout.exercises ?? []).reduce((acc, exercise) => acc + exerciseVolume(exercise), 0)
}

/** The heaviest completed set (most reps on a tie), or null. */
export function bestSet(exercise: LyftaExercise): { weight: number; reps: number } | null {
  let best: { weight: number; reps: number } | null = null
  for (const set of completedSets(exercise)) {
    if (!best || set.weight > best.weight || (set.weight === best.weight && set.reps > best.reps)) best = set
  }
  return best
}

/** Each exercise of a workout with its volume (kg). */
export function exerciseVolumes(workout: LyftaWorkout): Array<{ exercise: LyftaExercise; volume: number }> {
  return workout.exercises.map((exercise) => ({ exercise, volume: exerciseVolume(exercise) }))
}

/** The `last_workout` section's list: that workout's exercises, largest volume first. */
export function lastWorkoutTopExercises(
  workout: LyftaWorkout,
  options: LyftaNonEssentialConfig
): Array<{ exercise: LyftaExercise; volume: number }> {
  const maxExercises = options.last_workout_max_exercises || 5
  return exerciseVolumes(workout)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, maxExercises)
}

/** Every remote image URL the enabled sections will draw, once each. */
export function displayedImageUrls(data: Pick<LyftaData, "workouts" | "exercises">, config: LyftaConfig): string[] {
  const sections = new Set(config.sections || [])
  const options = lyftaOptions(config)
  const urls = new Set<string>()

  if (sections.has("exercises") && options.exercises_hide_images !== true) {
    for (const exercise of topExercises(data, options)) {
      if (exercise.image) urls.add(exercise.image)
    }
  }

  if (sections.has("last_workout")) {
    const workout = latestWorkout(data.workouts)
    if (workout) {
      for (const { exercise } of lastWorkoutTopExercises(workout, options)) {
        if (exercise.exercise_image) urls.add(exercise.exercise_image)
      }
    }
  }

  return [...urls].filter((url) => url.startsWith("https://"))
}

/** The API page the plugin reads: a count that reaches it means "at least". */
export const LYFTA_WORKOUTS_PAGE = 100

/** What the `statistics` section draws, from the fetched workouts. */
export function statisticsSummary(data: Pick<LyftaData, "workouts" | "statistics">): {
  workoutsLabel: string
  volume: number
  uniqueExercises: number
  currentStreak: number
  longestStreak: number
  firstWorkout: string | null
} {
  const workouts = data.workouts ?? []
  const names = new Set(
    workouts.flatMap((w) => w.exercises.map((e) => e.excercise_name?.trim().toLowerCase()).filter(Boolean))
  )
  const dates = workouts.map((w) => w.workout_perform_date).filter((d) => !Number.isNaN(new Date(d).getTime()))
  const firstWorkout = dates.length
    ? dates.reduce((a, b) => (new Date(a).getTime() <= new Date(b).getTime() ? a : b))
    : null
  return {
    workoutsLabel: workouts.length >= LYFTA_WORKOUTS_PAGE ? `${LYFTA_WORKOUTS_PAGE}+` : String(workouts.length),
    volume: workouts.reduce((acc, w) => acc + workoutVolume(w), 0),
    uniqueExercises: names.size,
    currentStreak: data.statistics?.currentStreak ?? 0,
    longestStreak: data.statistics?.longestStreak ?? 0,
    firstWorkout,
  }
}

/** The exercise in the most workouts, with that count. */
export function favoriteExercise(workouts: LyftaWorkout[]): { name: string; count: number } | null {
  const counts = new Map<string, number>()
  for (const workout of workouts ?? []) {
    for (const name of new Set(workout.exercises.map((e) => e.excercise_name?.trim()).filter(Boolean))) {
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  let best: { name: string; count: number } | null = null
  for (const [name, count] of counts) if (!best || count > best.count) best = { name, count }
  return best
}

/** The `overview` section's numbers over the last `periodDays`. */
export function overviewSummary(
  data: Pick<LyftaData, "workouts" | "workoutSummaries">,
  periodDays: number,
  now: Date = new Date()
): { workouts: number; volume: number; minutes: number; perWeek: number } {
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - periodDays)
  const inPeriod = (data.workoutSummaries ?? []).filter((w) => new Date(w.workout_perform_date) >= cutoff)
  const byId = new Map((data.workouts ?? []).map((w) => [w.id, w]))
  const volume = inPeriod.reduce((acc, summary) => {
    const workout = byId.get(summary.id)
    return acc + (summary.total_volume > 0 ? summary.total_volume : workout ? workoutVolume(workout) : 0)
  }, 0)
  const minutes = inPeriod.reduce((acc, w) => acc + durationMinutes(w.workout_duration), 0)
  return {
    workouts: inPeriod.length,
    volume,
    minutes,
    perWeek: periodDays > 0 ? inPeriod.length / (periodDays / 7) : 0,
  }
}

/** The tiles the options turn on; the section draws one metric per tile (or terminal line). */
export function overviewTileCount(config: LyftaNonEssentialConfig): number {
  return (
    1 +
    Number(config.overview_show_volume !== false) +
    Number(config.overview_show_duration !== false) +
    Number(config.overview_show_weekly_avg !== false)
  )
}

/**
 * The `recent_workouts` section's list, newest first. The default matches the
 * dashboard's (`workouts_max` defaults to 5 in plugin.metadata.ts); the section used
 * 4, so a card saved without the option drew one fewer than the form showed.
 */
export function recentWorkouts(
  data: Pick<LyftaData, "workoutSummaries">,
  options: LyftaNonEssentialConfig
): LyftaData["workoutSummaries"] {
  const max = options.workouts_max || 5
  return [...(data?.workoutSummaries ?? [])]
    .sort((a, b) => new Date(b.workout_perform_date).getTime() - new Date(a.workout_perform_date).getTime())
    .slice(0, max)
}
