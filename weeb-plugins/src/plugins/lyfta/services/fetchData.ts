/**
 * Fetches data from Lyfta API
 */

import type { LyftaConfig, LyftaData, LyftaExerciseData, LyftaWorkout } from "../types"
import { displayedImageUrls } from "../selection"
import { getMockLyftaData } from "./mock-data"
import { embedImageOrNull as embedImage } from "../../../utils/image-to-base64"

// Each upstream call is bounded: they had none, so a hung API held the whole generation.
const LYFTA_TIMEOUT_MS = 10_000

const LYFTA_IMAGE_MAX_BYTES = 250_000

async function embedImageOrNull(image: string): Promise<string | null> {
  if (!image.startsWith("https://")) return null
  return embedImage(image, { maxBytes: LYFTA_IMAGE_MAX_BYTES, context: "lyfta" })
}

const BASE_URL = "https://my.lyfta.app"

export async function fetchLyftaData(
  config: LyftaConfig,
  dev: boolean,
  apiKey?: string,
  previewMode = false
): Promise<LyftaData> {
  // Em modo dev ou preview, retornar dados mock
  if (dev || previewMode) {
    console.log("[Lyfta] Using mock data (dev mode or preview mode)")
    const mockData = await getMockLyftaData()

    // Em modo preview, manter URLs originais (não converter para base64)
    if (previewMode) {
      return mockData
    }

    return await embedDisplayedImages(mockData, config)
  }

  // Validar que tem apiKey configurado quando não estiver em modo dev/preview
  if (!apiKey) {
    throw new Error("Lyfta API Key is required. Please configure it in your profile settings.")
  }

  // No try/catch on purpose. This used to fall back to the mock workouts on any
  // error, which reached the generator as a success and was published over the
  // user's last good card. A throw becomes a pluginErrors entry, and the dashboard
  // then keeps the previous SVG and records the reason in last_error.

  // Fetch workouts
  const workoutsResponse = await fetch(`${BASE_URL}/api/v1/workouts?limit=100&page=1`, {
    signal: AbortSignal.timeout(LYFTA_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!workoutsResponse.ok) {
    throw new Error(`Lyfta API failed to fetch workouts: HTTP ${workoutsResponse.status}`)
  }

  const workoutsData = await workoutsResponse.json()
  const workouts = workoutsData.status && workoutsData.workouts ? workoutsData.workouts : []

  // The catalog only feeds the `exercises` section, which draws nothing without it.
  const sections = new Set(config.sections || [])
  let exercises: LyftaExerciseData[] = []
  if (sections.has("exercises")) {
    const exercisesResponse = await fetch(`${BASE_URL}/api/v1/exercises`, {
      signal: AbortSignal.timeout(LYFTA_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    const exercisesData = exercisesResponse.ok ? await exercisesResponse.json() : { exercises: [] }
    exercises = exercisesData.exercises || []
  }

  const workoutSummaries = workouts.map((workout: any) => ({
    id: workout.id,
    title: workout.title,
    description: workout.description || null,
    workout_duration: workout.workout_duration || "00:00:00",
    total_volume: workout.total_volume || workout.totalLiftedWeight || 0,
    workout_perform_date: workout.workout_perform_date,
  }))

  return await embedDisplayedImages(
    { workouts, workoutSummaries, exercises, statistics: calculateStatistics(workouts) },
    config
  )
}

/**
 * Embeds the images the enabled sections draw, once per URL, and drops every other
 * image URL: one that is not drawn is no use in the SVG, and a remote one would not
 * load inside a Gist anyway. See selection.ts for why this is not "embed them all".
 */
async function embedDisplayedImages(data: LyftaData, config: LyftaConfig): Promise<LyftaData> {
  const embedded = new Map(
    await Promise.all(displayedImageUrls(data, config).map(async (url) => [url, await embedImageOrNull(url)] as const))
  )
  const image = (url: string | null | undefined): string | null => {
    if (!url) return null
    if (url.startsWith("data:")) return url
    return embedded.get(url) ?? null
  }
  const withImages = (workout: LyftaWorkout): LyftaWorkout => ({
    ...workout,
    exercises: workout.exercises.map((exercise) => ({ ...exercise, exercise_image: image(exercise.exercise_image) })),
  })

  return {
    ...data,
    workouts: data.workouts.map(withImages),
    exercises: data.exercises.map((exercise) => ({ ...exercise, image_name: image(exercise.image_name) })),
    statistics: data.statistics.lastWorkout
      ? { ...data.statistics, lastWorkout: withImages(data.statistics.lastWorkout) }
      : data.statistics,
  }
}

function calculateStatistics(workouts: any[]): any {
  const totalWorkouts = workouts.length
  const totalDuration = workouts.reduce((acc, workout) => {
    const workoutDuration = workout.exercises.reduce((exerciseAcc: number, exercise: any) => {
      const setsDuration = exercise.sets.reduce((setAcc: number, set: any) => {
        return setAcc + (set.duration || 0)
      }, 0)
      return exerciseAcc + setsDuration + (exercise.exercise_rest_time || 0)
    }, 0)
    return acc + workoutDuration
  }, 0)

  const totalLiftedWeight = workouts.reduce((acc, workout) => {
    return acc + (workout.totalLiftedWeight || workout.total_volume || 0)
  }, 0)

  // Calculate favorite exercise
  const exerciseCounts = new Map<string, number>()
  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise: any) => {
      const exerciseName = exercise.excercise_name
      if (exerciseName) {
        const count = exerciseCounts.get(exerciseName) || 0
        exerciseCounts.set(exerciseName, count + 1)
      }
    })
  })

  const favoriteExercise = Array.from(exerciseCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  // Calculate top muscle groups
  const muscleGroupCounts = new Map<string, number>()
  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise: any) => {
      const muscleGroup = exercise.exercise_type?.split("_")[0]?.toUpperCase() || "GENERAL"
      if (muscleGroup) {
        const count = muscleGroupCounts.get(muscleGroup) || 0
        muscleGroupCounts.set(muscleGroup, count + 1)
      }
    })
  })

  const topMuscleGroups = Array.from(muscleGroupCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Calculate weekly activity
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return {
      day: dayNames[i] || "Sun",
      count: 0,
    }
  })

  // Calculate workout streak
  const workoutStreak = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split("T")[0] || ""
    return {
      date: dateStr,
      count: 0,
    }
  })

  // Calculate current and longest streak
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  workoutStreak.forEach((day) => {
    const hasWorkout = workouts.some((workout) => {
      const workoutDate = new Date(workout.workout_perform_date).toISOString().split("T")[0]
      return workoutDate === day.date
    })

    if (hasWorkout) {
      day.count = 1
      tempStreak++
      currentStreak = Math.max(currentStreak, tempStreak)
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 0
    }
  })

  longestStreak = Math.max(longestStreak, tempStreak)

  // Calculate exercise stats
  const allExercises = workouts.flatMap((w) => w.exercises)
  const uniqueExercises = new Set(allExercises.map((e: any) => e.excercise_name))

  const allWeights = allExercises
    .flatMap((e: any) => e.sets.map((s: any) => (s.weight !== null ? Number(s.weight) : null)))
    .filter((w): w is number => typeof w === "number" && !Number.isNaN(w))

  const allReps = allExercises
    .flatMap((e: any) => e.sets.map((s: any) => s.reps))
    .filter((r) => r !== null)
    .map((r) => Number.parseInt(String(r), 10))
    .filter((n) => !Number.isNaN(n))

  const exerciseStats = {
    totalExercises: allExercises.length,
    uniqueExercises: uniqueExercises.size,
    mostUsedWeight: allWeights.length > 0 ? Math.max(...allWeights) : 0,
    averageReps: allReps.length > 0 ? Math.round(allReps.reduce((a, b) => a + b, 0) / allReps.length) : null,
  }

  return {
    totalWorkouts,
    totalDuration,
    totalLiftedWeight,
    favoriteExercise,
    topMuscleGroups: topMuscleGroups.length > 0 ? topMuscleGroups : [{ name: "General", count: 0 }],
    weeklyActivity,
    currentStreak,
    longestStreak,
    lastWorkout: workouts[0] || null,
    workoutStreak,
    exerciseStats,
  }
}
