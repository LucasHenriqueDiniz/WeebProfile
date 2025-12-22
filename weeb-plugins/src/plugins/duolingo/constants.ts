/**
 * Duolingo Brand Colors
 * Official color palette from Duolingo Design System
 */

export const DuolingoColors = {
  // Primary Colors
  featherGreen: '#58CC02',      // RGB: 88, 204, 2
  maskGreen: '#89E219',         // RGB: 137, 226, 25
  
  // Neutral Colors
  eel: '#4B4B4B',               // RGB: 75, 75, 75
  snow: '#FFFFFF',               // RGB: 255, 255, 255
  
  // Accent Colors
  macaw: '#1CB0F6',              // RGB: 28, 176, 246
  cardinal: '#FF4B4B',           // RGB: 255, 75, 75
  bee: '#FFC800',                // RGB: 255, 200, 0
  fox: '#FF9600',                // RGB: 255, 150, 0
  beetle: '#CE82FF',             // RGB: 206, 130, 255
  humpback: '#2B70C9',           // RGB: 43, 112, 201
} as const

/**
 * Get streak color based on intensity
 */
export function getStreakColor(intensity: 'low' | 'medium' | 'high' | 'legendary' | 'godlike'): string {
  switch (intensity) {
    case 'low':
      return DuolingoColors.maskGreen
    case 'medium':
      return DuolingoColors.featherGreen
    case 'high':
      return DuolingoColors.bee
    case 'legendary':
      return DuolingoColors.cardinal
    case 'godlike':
      return DuolingoColors.beetle
    default:
      return DuolingoColors.featherGreen
  }
}

/**
 * Get streak gradient colors
 */
export function getStreakGradient(intensity: 'low' | 'medium' | 'high' | 'legendary' | 'godlike'): {
  from: string
  to: string
  border: string
} {
  switch (intensity) {
    case 'low':
      return {
        from: '#89E219',
        to: '#A8F03A',
        border: '#58CC02',
      }
    case 'medium':
      return {
        from: '#58CC02',
        to: '#89E219',
        border: '#4BB800',
      }
    case 'high':
      return {
        from: '#FFC800',
        to: '#FFD633',
        border: '#FFB300',
      }
    case 'legendary':
      return {
        from: '#FF4B4B',
        to: '#FF6B6B',
        border: '#FF2B2B',
      }
    case 'godlike':
      return {
        from: '#CE82FF',
        to: '#E5B3FF',
        border: '#B866FF',
      }
    default:
      return {
        from: DuolingoColors.featherGreen,
        to: DuolingoColors.maskGreen,
        border: '#4BB800',
      }
  }
}

