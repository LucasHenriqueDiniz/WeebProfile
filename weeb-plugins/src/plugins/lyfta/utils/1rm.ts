/**
 * Calculate 1RM (One Rep Max) using Brzycki formula
 * 1RM = weight / (1.0278 - 0.0278 * reps)
 */

export function calculate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  // Brzycki formula
  return weight / (1.0278 - 0.0278 * reps)
}

export function format1RM(weightKg: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (unit === 'lbs') {
    const pounds = weightKg * 2.20462
    return `${Math.round(pounds)}lbs`
  }
  return `${Math.round(weightKg)}kg`
}

