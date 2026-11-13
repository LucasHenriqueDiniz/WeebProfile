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
  /** grams */
  averageWeight: number
  /** grams */
  bestWeight: number
  /** kg */
  best1RM: number
  image: string | null
}

/** The `exercises` section's list: most performed first, with the image it draws. */
export function topExercises(
  data: Pick<LyftaData, "workouts" | "exercises">,
  options: LyftaNonEssentialConfig
): TopExercise[] {
  const maxExercises = options.exercises_max || 5

  const exerciseStats = new Map<
    string,
    { count: number; weights: number[]; bestWeight: number; best1RM: number; averageWeight: number }
  >()

  data.workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const exerciseName = exercise.excercise_name?.trim()
      if (!exerciseName) return

      const stats = exerciseStats.get(exerciseName) || {
        count: 0,
        weights: [],
        bestWeight: 0,
        best1RM: 0,
        averageWeight: 0,
      }

      stats.count++

      // set.weight is in kg; formatWeight takes grams. All sets count, not only
      // completed ones, for better stats.
      exercise.sets.forEach((set) => {
        if (set.weight && set.reps) {
          const weightKg = parseFloat(set.weight)
          const reps = parseInt(set.reps, 10)
          if (!isNaN(weightKg) && !isNaN(reps) && weightKg > 0 && reps > 0) {
            const weightGrams = weightKg * 1000
            stats.weights.push(weightGrams)
            if (weightGrams > stats.bestWeight) {
              stats.bestWeight = weightGrams
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
        averageWeight: stats.weights.length > 0 ? stats.weights.reduce((a, b) => a + b, 0) / stats.weights.length : 0,
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

/** Each exercise of a workout with its completed volume (kg: weight × reps per set). */
export function exerciseVolumes(workout: LyftaWorkout): Array<{ exercise: LyftaExercise; volume: number }> {
  return workout.exercises.map((exercise) => {
    const volume = exercise.sets.reduce((acc, set) => {
      if (set.weight && set.reps && set.is_completed) {
        const weight = parseFloat(set.weight)
        const reps = parseInt(set.reps, 10)
        if (!isNaN(weight) && !isNaN(reps)) {
          return acc + weight * reps
        }
      }
      return acc
    }, 0)
    return { exercise, volume }
  })
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
