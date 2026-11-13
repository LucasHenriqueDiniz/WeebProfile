/**
 * 16personalities plugin data fetch service
 *
 * Since there's no public API, it only processes the type chosen by the user
 * or extracts it from the provided URL
 */

import type { Personality16Config, Personality16Data, PersonalityType } from "../types"
import { getMockPersonality16Data } from "./mock-data"
import { getPersonalityData } from "./personality-data"

/**
 * Extracts personality type from 16Personalities URL
 * Supports formats like:
 * - https://www.16personalities.com/br/resultados/enfj-t/m/4lyvq4j0t
 * - https://www.16personalities.com/enfj-personality
 * - https://www.16personalities.com/br/personalidade-enfj
 */
function extractTypeFromUrl(url: string): PersonalityType | null {
  try {
    // Match patterns like: resultados/enfj-t, personalidade-enfj, enfj-personality
    const patterns = [
      /[/-]([a-z]{4})-t/i, // resultados/enfj-t
      /personalidade-([a-z]{4})/i, // personalidade-enfj
      /([a-z]{4})-personality/i, // enfj-personality
      /resultados\/([a-z]{4})/i, // resultados/enfj
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        const type = match[1].toUpperCase() as PersonalityType
        // Validate it's a valid type
        const validTypes: PersonalityType[] = [
          "ENFJ",
          "ENFP",
          "ENTJ",
          "ENTP",
          "ESFJ",
          "ESFP",
          "ESTJ",
          "ESTP",
          "INFJ",
          "INFP",
          "INTJ",
          "INTP",
          "ISFJ",
          "ISFP",
          "ISTJ",
          "ISTP",
        ]
        if (validTypes.includes(type)) {
          return type
        }
      }
    }
  } catch (error) {
    console.warn("Error extracting type from URL:", error)
  }

  return null
}

/**
 * Fetches plugin data
 *
 * @param config - Plugin configuration
 * @param dev - Development mode (uses mock data)
 */
export async function fetchPersonality16Data(config: Personality16Config, dev = false): Promise<Personality16Data> {
  // Development mode - return mock data
  if (dev) {
    return getMockPersonality16Data()
  }

  // A URL the type cannot be read from used to fall back to ENFJ here, while the
  // renderer ran a stricter regex of its own and drew an error box over a card the
  // generator reported as a success: the dashboard published it, with ~190px of blank
  // space under the box, and URLs this function reads fine were among the ones the
  // renderer refused. Throwing hands it to the generator's failure path instead
  // (hasErrors, last_error with this message, the previous card kept).
  const url = config.personality_url?.trim()
  if (!url) {
    throw new Error("16Personalities URL is required. Set it in the plugin settings.")
  }
  const personalityType = extractTypeFromUrl(url)
  if (!personalityType) {
    throw new Error(
      "Could not read a personality type from the 16Personalities URL. Use a link with the type in it, like https://www.16personalities.com/intj-personality."
    )
  }

  return getPersonalityData(personalityType)
}
