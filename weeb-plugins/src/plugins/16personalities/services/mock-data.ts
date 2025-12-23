/**
 * Mock data for development
 */

import type { Personality16Data } from '../types.js'
import { getPersonalityData } from './personality-data.js'

/**
 * Generates mock data for the plugin
 */
export function getMockPersonality16Data(): Personality16Data {
  // Returns ENFJ as default for mock
  return getPersonalityData('ENFJ')
}
