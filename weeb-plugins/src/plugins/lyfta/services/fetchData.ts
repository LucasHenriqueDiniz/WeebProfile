/**
 * Fetches data from Lyfta API
 */

import type { LyftaConfig, LyftaData } from '../types'
import { getMockLyftaData } from './mock-data'
import { urlToBase64, IMAGE_OPTIMIZATION } from '../../../utils/image-to-base64'

const BASE_URL = 'https://my.lyfta.app'

export async function fetchLyftaData(
  config: LyftaConfig,
  dev: boolean,
  apiKey?: string
): Promise<LyftaData> {
  if (dev || !apiKey) {
    const mockData = await getMockLyftaData()
    // Converter URLs de imagens para base64 para funcionar nos previews (Playwright bloqueia requisições externas)
    return await convertImageUrlsToBase64(mockData)
  }

  try {
    // Fetch workouts
    const workoutsResponse = await fetch(`${BASE_URL}/api/v1/workouts?limit=100&page=1`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!workoutsResponse.ok) {
      throw new Error(`Failed to fetch workouts: ${workoutsResponse.statusText}`)
    }

    const workoutsData = await workoutsResponse.json()
    const workouts = workoutsData.status && workoutsData.workouts ? workoutsData.workouts : []

    // Fetch exercise data
    const exercisesResponse = await fetch(`${BASE_URL}/api/v1/exercises`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    const exercisesData = exercisesResponse.ok ? await exercisesResponse.json() : { exercises: [] }
    const exercises = exercisesData.exercises || []

    // Process workouts and convert images to base64
    const processedWorkouts = await Promise.all(
      workouts.map(async (workout: any) => {
        const processedExercises = await Promise.all(
          workout.exercises.map(async (exercise: any) => {
            let exerciseImage = exercise.exercise_image || ''

            // If exercise_image is a URL, convert to base64
            if (exerciseImage && !exerciseImage.startsWith('data:') && exerciseImage.startsWith('http')) {
              try {
                exerciseImage = await urlToBase64(exerciseImage, 15000, IMAGE_OPTIMIZATION)
              } catch (error) {
                console.error('Failed to convert exercise image to base64:', error)
              }
            }

            return {
              ...exercise,
              exercise_image: exerciseImage,
            }
          })
        )

        return {
          ...workout,
          exercises: processedExercises,
        }
      })
    )

    // Calculate statistics
    const statistics = calculateStatistics(processedWorkouts)

    // Create workout summaries
    const workoutSummaries = processedWorkouts.map((workout) => ({
      id: workout.id,
      title: workout.title,
      description: workout.description || null,
      workout_duration: workout.workout_duration || '00:00:00',
      total_volume: workout.total_volume || workout.totalLiftedWeight || 0,
      workout_perform_date: workout.workout_perform_date,
    }))

    // Process exercise data images
    const processedExercises = await Promise.all(
      exercises.map(async (exercise: any) => {
        let imageName = exercise.image_name || ''

        if (imageName && !imageName.startsWith('data:') && imageName.startsWith('http')) {
          try {
            imageName = await urlToBase64(imageName, 15000, IMAGE_OPTIMIZATION)
          } catch (error) {
            console.error('Failed to convert exercise data image to base64:', error)
          }
        }

        return {
          ...exercise,
          image_name: imageName,
        }
      })
    )

    return {
      workouts: processedWorkouts,
      workoutSummaries,
      exercises: processedExercises,
      statistics,
    }
  } catch (error) {
    console.error('Error fetching Lyfta data:', error)
    // Fallback to mock data on error
    return await getMockLyftaData()
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

  const favoriteExercise = Array.from(exerciseCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null

  // Calculate top muscle groups
  const muscleGroupCounts = new Map<string, number>()
  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise: any) => {
      const muscleGroup = exercise.exercise_type?.split('_')[0]?.toUpperCase() || 'GENERAL'
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
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return {
      day: dayNames[i] || 'Sun',
      count: 0,
    }
  })

  // Calculate workout streak
  const workoutStreak = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split('T')[0] || ''
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
      const workoutDate = new Date(workout.workout_perform_date).toISOString().split('T')[0]
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
    .filter((w): w is number => typeof w === 'number' && !Number.isNaN(w))

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
    topMuscleGroups: topMuscleGroups.length > 0 ? topMuscleGroups : [{ name: 'General', count: 0 }],
    weeklyActivity,
    currentStreak,
    longestStreak,
    lastWorkout: workouts[0] || null,
    workoutStreak,
    exerciseStats,
  }
}

/**
 * Converte URLs de imagens para base64 recursivamente
 */
async function convertImageUrlsToBase64(data: any): Promise<any> {
  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => convertImageUrlsToBase64(item)))
  }

  if (data && typeof data === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (
        (key === 'image' || key === 'exercise_image' || key === 'image_name') &&
        typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))
      ) {
        // Converter URL para base64 com otimização (imagens pequenas)
        result[key] = await urlToBase64(value, 15000, IMAGE_OPTIMIZATION)
      } else {
        result[key] = await convertImageUrlsToBase64(value)
      }
    }
    return result
  }

  return data
}

