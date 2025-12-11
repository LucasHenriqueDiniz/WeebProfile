/**
 * Tipos do Plugin Lyfta
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base'

export interface LyftaSet {
  id: string
  weight: string | null
  reps: string | null
  is_completed: boolean
  duration?: number
}

export interface LyftaExercise {
  exercise_id: number
  excercise_name: string
  exercise_type: string
  exercise_image: string
  exercise_rest_time: number
  sets: LyftaSet[]
}

export interface LyftaWorkout {
  id: number
  title: string
  workout_perform_date: string
  body_weight: number
  total_volume: number
  totalLiftedWeight: number
  exercises: LyftaExercise[]
}

export interface LyftaWorkoutSummary {
  id: number
  title: string
  description: string | null
  workout_duration: string
  total_volume: number
  workout_perform_date: string
}

export interface LyftaExerciseData {
  id: string
  name: string
  image_name: string
  equipment_id: string
  body_part_id: string
  Target_muscles_id: string
  Synergist_muscles_id: string
  exercise_type: string
}

export interface LyftaStatistics {
  totalWorkouts: number
  totalDuration: number
  totalLiftedWeight: number
  favoriteExercise: string | null
  topMuscleGroups: Array<{ name: string; count: number }>
  weeklyActivity: Array<{ day: string; count: number }>
  currentStreak: number
  longestStreak: number
  lastWorkout: LyftaWorkout | null
  workoutStreak: Array<{ date: string; count: number }>
  exerciseStats: {
    totalExercises: number
    uniqueExercises: number
    mostUsedWeight: number
    averageReps: number | null
  }
}

/**
 * Configurações não-essenciais do Lyfta (preferências do usuário)
 * Essas configs são armazenadas em pluginsConfig no banco
 */
export interface LyftaNonEssentialConfig extends NonEssentialPluginConfig {
  statistics_hide_title?: boolean
  statistics_title?: string
  recent_workouts_hide_title?: boolean
  recent_workouts_title?: string
  workouts_max?: number
  weight_unit?: 'kg' | 'lbs' // Unidade de peso: kg ou libras
}

/**
 * Configuração completa do plugin Lyfta
 */
export interface LyftaConfig extends BasePluginConfig {
  nonEssential?: LyftaNonEssentialConfig
  [key: string]: unknown // Index signature para compatibilidade com PluginConfig
}

export interface LyftaData {
  workouts: LyftaWorkout[]
  workoutSummaries: LyftaWorkoutSummary[]
  exercises: LyftaExerciseData[]
  statistics: LyftaStatistics
}

