/**
 * Language name → flag, drawn as inline SVG vectors from country-flag-icons.
 *
 * Flags used to be Unicode emoji (🇯🇵). Those depend on the viewer's emoji font: Chrome
 * and Edge on Windows have no flag glyphs and print the two regional-indicator letters
 * instead, so the card showed "JP" where the flag should be. Inline SVG is plain paths
 * inside the card, so it draws the same everywhere, and an SVG shown through <img>
 * needs nothing external to draw it. None of the 3x2 flags uses ids, so the same flag
 * twice in one card cannot collide.
 */

import React from "react"
import type { ReactElement } from "react"
import GB from "country-flag-icons/react/3x2/GB"
import GB_SCT from "country-flag-icons/react/3x2/GB-SCT"
import GB_WLS from "country-flag-icons/react/3x2/GB-WLS"
import ES from "country-flag-icons/react/3x2/ES"
import FR from "country-flag-icons/react/3x2/FR"
import DE from "country-flag-icons/react/3x2/DE"
import IT from "country-flag-icons/react/3x2/IT"
import PT from "country-flag-icons/react/3x2/PT"
import RU from "country-flag-icons/react/3x2/RU"
import JP from "country-flag-icons/react/3x2/JP"
import CN from "country-flag-icons/react/3x2/CN"
import KR from "country-flag-icons/react/3x2/KR"
import SA from "country-flag-icons/react/3x2/SA"
import IN from "country-flag-icons/react/3x2/IN"
import TR from "country-flag-icons/react/3x2/TR"
import PL from "country-flag-icons/react/3x2/PL"
import NL from "country-flag-icons/react/3x2/NL"
import SE from "country-flag-icons/react/3x2/SE"
import NO from "country-flag-icons/react/3x2/NO"
import DK from "country-flag-icons/react/3x2/DK"
import FI from "country-flag-icons/react/3x2/FI"
import GR from "country-flag-icons/react/3x2/GR"
import IL from "country-flag-icons/react/3x2/IL"
import VN from "country-flag-icons/react/3x2/VN"
import TH from "country-flag-icons/react/3x2/TH"
import ID from "country-flag-icons/react/3x2/ID"
import UA from "country-flag-icons/react/3x2/UA"
import CZ from "country-flag-icons/react/3x2/CZ"
import RO from "country-flag-icons/react/3x2/RO"
import HU from "country-flag-icons/react/3x2/HU"
import KE from "country-flag-icons/react/3x2/KE"
import IE from "country-flag-icons/react/3x2/IE"
import BR from "country-flag-icons/react/3x2/BR"
import MX from "country-flag-icons/react/3x2/MX"
import CA from "country-flag-icons/react/3x2/CA"
import TW from "country-flag-icons/react/3x2/TW"

// Language name (as Duolingo titles a course) → flag code (ISO 3166-1 alpha-2, or a
// GB subdivision that country-flag-icons draws).
const LANGUAGE_CODES: Record<string, string> = {
  english: "GB",
  spanish: "ES",
  french: "FR",
  german: "DE",
  italian: "IT",
  portuguese: "PT",
  russian: "RU",
  japanese: "JP",
  chinese: "CN",
  korean: "KR",
  arabic: "SA",
  hindi: "IN",
  turkish: "TR",
  polish: "PL",
  dutch: "NL",
  swedish: "SE",
  norwegian: "NO",
  danish: "DK",
  finnish: "FI",
  greek: "GR",
  hebrew: "IL",
  vietnamese: "VN",
  thai: "TH",
  indonesian: "ID",
  ukrainian: "UA",
  czech: "CZ",
  romanian: "RO",
  hungarian: "HU",
  swahili: "KE",
  welsh: "GB-WLS",
  irish: "IE",
  scottish: "GB-SCT",
  esperanto: "EO",
  "mandarin chinese": "CN",
  "simplified chinese": "CN",
  "traditional chinese": "TW",
  "brazilian portuguese": "BR",
  "european portuguese": "PT",
  "latin american spanish": "MX",
  "castilian spanish": "ES",
  "canadian french": "CA",
  "france french": "FR",
}

// Longest first, so "brazilian portuguese" wins over "portuguese".
const PARTIAL_KEYS = Object.keys(LANGUAGE_CODES).sort((a, b) => b.length - a.length)

/**
 * Flag code for a language name. An exact name wins; otherwise the longest known name
 * the input contains ("Scottish Gaelic" → GB-SCT). A name that only appears inside a
 * known one does not match: "Latin" is not "Latin American Spanish". Unknown names
 * fall back to their first two letters, which CountryFlag draws as a text badge.
 */
export function getLanguageCode(languageName: string): string {
  const normalized = languageName.toLowerCase().trim()

  const exact = LANGUAGE_CODES[normalized]
  if (exact) return exact

  const partial = PARTIAL_KEYS.find((key) => normalized.includes(key))
  if (partial) return LANGUAGE_CODES[partial]!

  return normalized.slice(0, 2).toUpperCase()
}

const FLAGS: Record<string, typeof GB> = {
  GB,
  "GB-SCT": GB_SCT,
  "GB-WLS": GB_WLS,
  ES,
  FR,
  DE,
  IT,
  PT,
  RU,
  JP,
  CN,
  KR,
  SA,
  IN,
  TR,
  PL,
  NL,
  SE,
  NO,
  DK,
  FI,
  GR,
  IL,
  VN,
  TH,
  ID,
  UA,
  CZ,
  RO,
  HU,
  KE,
  IE,
  BR,
  MX,
  CA,
  TW,
}

/** Whether CountryFlag draws a real flag for this code (otherwise a text badge). */
export function hasFlag(code: string): boolean {
  return code in FLAGS
}

interface CountryFlagProps {
  code: string
  className?: string
  /** Flag width in px; the height follows the 3:2 ratio. */
  width?: number
  /**
   * Hairline drawn around the flag (a CSS color, usually a theme variable). Without it a
   * flag with a white field, like Japan's, melts into a light background.
   */
  edgeColor?: string
  style?: React.CSSProperties
}

export function CountryFlag({ code, className = "", width = 24, edgeColor, style }: CountryFlagProps): ReactElement {
  const height = Math.round((width * 2) / 3)
  const size: React.CSSProperties = {
    width,
    height,
    flexShrink: 0,
    ...(edgeColor ? { boxShadow: `0 0 0 1px ${edgeColor}` } : {}),
    ...style,
  }
  const Flag = FLAGS[code]

  if (Flag) {
    return (
      <Flag
        className={`country-flag rounded-sm ${className}`}
        style={size}
        role="img"
        aria-label={`Flag of ${code}`}
        data-flag={code}
      />
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded text-[10px] font-bold text-white bg-gray-500 ${className}`}
      style={size}
      title={code}
      data-flag={code}
    >
      {code}
    </span>
  )
}
