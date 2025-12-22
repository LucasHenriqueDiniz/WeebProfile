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
 * Nota: Para reduzir bundle size, apenas as bandeiras mais comuns são importadas.
 * Para outros países, mostra um badge com o código do país.
 */
export function CountryFlag({ code, className = '' }: { code: string; className?: string }): ReactElement {
  // Importar apenas as bandeiras mais comuns estaticamente
  // Para outras, usar fallback
  const commonFlags: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
    GB: React.lazy(() => import('country-flag-icons/react/3x2/GB')),
    ES: React.lazy(() => import('country-flag-icons/react/3x2/ES')),
    FR: React.lazy(() => import('country-flag-icons/react/3x2/FR')),
    DE: React.lazy(() => import('country-flag-icons/react/3x2/DE')),
    IT: React.lazy(() => import('country-flag-icons/react/3x2/IT')),
    PT: React.lazy(() => import('country-flag-icons/react/3x2/PT')),
    RU: React.lazy(() => import('country-flag-icons/react/3x2/RU')),
    JP: React.lazy(() => import('country-flag-icons/react/3x2/JP')),
    CN: React.lazy(() => import('country-flag-icons/react/3x2/CN')),
    KR: React.lazy(() => import('country-flag-icons/react/3x2/KR')),
    SA: React.lazy(() => import('country-flag-icons/react/3x2/SA')),
    IN: React.lazy(() => import('country-flag-icons/react/3x2/IN')),
    TR: React.lazy(() => import('country-flag-icons/react/3x2/TR')),
    PL: React.lazy(() => import('country-flag-icons/react/3x2/PL')),
    NL: React.lazy(() => import('country-flag-icons/react/3x2/NL')),
    SE: React.lazy(() => import('country-flag-icons/react/3x2/SE')),
    NO: React.lazy(() => import('country-flag-icons/react/3x2/NO')),
    DK: React.lazy(() => import('country-flag-icons/react/3x2/DK')),
    FI: React.lazy(() => import('country-flag-icons/react/3x2/FI')),
    GR: React.lazy(() => import('country-flag-icons/react/3x2/GR')),
    IL: React.lazy(() => import('country-flag-icons/react/3x2/IL')),
    VN: React.lazy(() => import('country-flag-icons/react/3x2/VN')),
    TH: React.lazy(() => import('country-flag-icons/react/3x2/TH')),
    ID: React.lazy(() => import('country-flag-icons/react/3x2/ID')),
    UA: React.lazy(() => import('country-flag-icons/react/3x2/UA')),
    CZ: React.lazy(() => import('country-flag-icons/react/3x2/CZ')),
    RO: React.lazy(() => import('country-flag-icons/react/3x2/RO')),
    HU: React.lazy(() => import('country-flag-icons/react/3x2/HU')),
    KE: React.lazy(() => import('country-flag-icons/react/3x2/KE')),
    IE: React.lazy(() => import('country-flag-icons/react/3x2/IE')),
    BR: React.lazy(() => import('country-flag-icons/react/3x2/BR')),
    MX: React.lazy(() => import('country-flag-icons/react/3x2/MX')),
    CA: React.lazy(() => import('country-flag-icons/react/3x2/CA')),
    TW: React.lazy(() => import('country-flag-icons/react/3x2/TW')),
  }
  
  const FlagComponent = commonFlags[code]
  
  if (!FlagComponent) {
    // Fallback: badge com código do país
    return (
      <span 
        className={`inline-flex items-center justify-center w-6 h-4 rounded text-[10px] font-bold text-white bg-gray-500 ${className}`}
        title={code}
      >
        {code}
      </span>
    )
  }
  
  return (
    <React.Suspense
      fallback={
        <span 
          className={`inline-flex items-center justify-center w-6 h-4 rounded text-[10px] font-bold text-white bg-gray-400 ${className}`}
        >
          {code}
        </span>
      }
    >
      <FlagComponent 
        className={`w-6 h-4 object-cover rounded-sm flex-shrink-0 ${className}`}
        title={code}
      />
    </React.Suspense>
  )
}
