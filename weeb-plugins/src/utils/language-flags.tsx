/**
 * Helper para obter bandeiras de países/idiomas usando country-flag-icons
 */

import React from 'react'
import type { ReactElement } from 'react'

// Mapeamento de nomes de idiomas para códigos ISO 3166-1 alpha-2
const LANGUAGE_CODES: Record<string, string> = {
  // Idiomas principais
  english: 'GB',
  spanish: 'ES',
  french: 'FR',
  german: 'DE',
  italian: 'IT',
  portuguese: 'PT',
  russian: 'RU',
  japanese: 'JP',
  chinese: 'CN',
  korean: 'KR',
  arabic: 'SA',
  hindi: 'IN',
  turkish: 'TR',
  polish: 'PL',
  dutch: 'NL',
  swedish: 'SE',
  norwegian: 'NO',
  danish: 'DK',
  finnish: 'FI',
  greek: 'GR',
  hebrew: 'IL',
  vietnamese: 'VN',
  thai: 'TH',
  indonesian: 'ID',
  ukrainian: 'UA',
  czech: 'CZ',
  romanian: 'RO',
  hungarian: 'HU',
  swahili: 'KE',
  welsh: 'GB',
  irish: 'IE',
  scottish: 'GB',
  esperanto: 'EO',
  // Variações comuns
  'mandarin chinese': 'CN',
  'simplified chinese': 'CN',
  'traditional chinese': 'TW',
  'brazilian portuguese': 'BR',
  'european portuguese': 'PT',
  'latin american spanish': 'MX',
  'castilian spanish': 'ES',
  'canadian french': 'CA',
  'france french': 'FR',
}

/**
 * Obtém o código de país de um idioma
 */
export function getLanguageCode(languageName: string): string {
  const normalized = languageName.toLowerCase().trim()
  
  // Tentar match exato primeiro
  if (LANGUAGE_CODES[normalized]) {
    return LANGUAGE_CODES[normalized]
  }
  
  // Tentar match parcial
  for (const [key, code] of Object.entries(LANGUAGE_CODES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code
    }
  }
  
  // Fallback: primeiras duas letras em maiúsculo
  return normalized.slice(0, 2).toUpperCase()
}

/**
 * Componente de bandeira de país
 * Usa country-flag-icons para renderizar SVGs de bandeiras
 * 
 * IMPORTANTE: Importa estaticamente para funcionar no SSR/Playwright
 * React.lazy não funciona no servidor, então importamos diretamente
 */
// Importações estáticas para funcionar no SSR
import GB from 'country-flag-icons/react/3x2/GB'
import ES from 'country-flag-icons/react/3x2/ES'
import FR from 'country-flag-icons/react/3x2/FR'
import DE from 'country-flag-icons/react/3x2/DE'
import IT from 'country-flag-icons/react/3x2/IT'
import PT from 'country-flag-icons/react/3x2/PT'
import RU from 'country-flag-icons/react/3x2/RU'
import JP from 'country-flag-icons/react/3x2/JP'
import CN from 'country-flag-icons/react/3x2/CN'
import KR from 'country-flag-icons/react/3x2/KR'
import SA from 'country-flag-icons/react/3x2/SA'
import IN from 'country-flag-icons/react/3x2/IN'
import TR from 'country-flag-icons/react/3x2/TR'
import PL from 'country-flag-icons/react/3x2/PL'
import NL from 'country-flag-icons/react/3x2/NL'
import SE from 'country-flag-icons/react/3x2/SE'
import NO from 'country-flag-icons/react/3x2/NO'
import DK from 'country-flag-icons/react/3x2/DK'
import FI from 'country-flag-icons/react/3x2/FI'
import GR from 'country-flag-icons/react/3x2/GR'
import IL from 'country-flag-icons/react/3x2/IL'
import VN from 'country-flag-icons/react/3x2/VN'
import TH from 'country-flag-icons/react/3x2/TH'
import ID from 'country-flag-icons/react/3x2/ID'
import UA from 'country-flag-icons/react/3x2/UA'
import CZ from 'country-flag-icons/react/3x2/CZ'
import RO from 'country-flag-icons/react/3x2/RO'
import HU from 'country-flag-icons/react/3x2/HU'
import KE from 'country-flag-icons/react/3x2/KE'
import IE from 'country-flag-icons/react/3x2/IE'
import BR from 'country-flag-icons/react/3x2/BR'
import MX from 'country-flag-icons/react/3x2/MX'
import CA from 'country-flag-icons/react/3x2/CA'
import TW from 'country-flag-icons/react/3x2/TW'

const commonFlags: Record<string, React.ComponentType<any>> = {
  GB,
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

// Mapeamento de códigos de país para emojis de bandeira Unicode
const FLAG_EMOJIS: Record<string, string> = {
  GB: '🇬🇧',
  ES: '🇪🇸',
  FR: '🇫🇷',
  DE: '🇩🇪',
  IT: '🇮🇹',
  PT: '🇵🇹',
  RU: '🇷🇺',
  JP: '🇯🇵',
  CN: '🇨🇳',
  KR: '🇰🇷',
  SA: '🇸🇦',
  IN: '🇮🇳',
  TR: '🇹🇷',
  PL: '🇵🇱',
  NL: '🇳🇱',
  SE: '🇸🇪',
  NO: '🇳🇴',
  DK: '🇩🇰',
  FI: '🇫🇮',
  GR: '🇬🇷',
  IL: '🇮🇱',
  VN: '🇻🇳',
  TH: '🇹🇭',
  ID: '🇮🇩',
  UA: '🇺🇦',
  CZ: '🇨🇿',
  RO: '🇷🇴',
  HU: '🇭🇺',
  KE: '🇰🇪',
  IE: '🇮🇪',
  BR: '🇧🇷',
  MX: '🇲🇽',
  CA: '🇨🇦',
  TW: '🇹🇼',
  EO: '🏳️', // Esperanto - bandeira neutra
}

export function CountryFlag({ code, className = '' }: { code: string; className?: string }): ReactElement {
  // Usar emoji de bandeira Unicode para garantir renderização no Playwright
  const flagEmoji = FLAG_EMOJIS[code]
  
  if (flagEmoji) {
    return (
      <span 
        className={`inline-flex items-center justify-center w-6 h-4 text-lg leading-none ${className}`}
        title={code}
        role="img"
        aria-label={`Flag of ${code}`}
      >
        {flagEmoji}
      </span>
    )
  }
  
  // Fallback: tentar usar componente SVG se disponível
  const FlagComponent = commonFlags[code]
  
  if (FlagComponent) {
    return (
      <FlagComponent 
        className={`w-6 h-4 object-cover rounded-sm flex-shrink-0 ${className}`}
        title={code}
      />
    )
  }
  
  // Último fallback: badge com código do país
  return (
    <span 
      className={`inline-flex items-center justify-center w-6 h-4 rounded text-[10px] font-bold text-white bg-gray-500 ${className}`}
      title={code}
    >
      {code}
    </span>
  )
}
