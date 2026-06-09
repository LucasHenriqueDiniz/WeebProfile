import { useLocale } from '@/i18n/use-translations'

/**
 * Hook para navegação locale-aware
 * Garante que todos os links internos mantenham o prefixo /[locale]
 */
export function useLocaleNavigation() {
  const locale = useLocale()

  /**
   * Converte um path absoluto para locale-aware
   * Ex: "/templates" -> "/pt/templates"
   */
  const toLocalePath = (path: string): string => {
    // Se já começa com locale, retorna como está
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return path
    }

    // Remove leading slash se existir e adiciona locale
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    // Para root path, apenas retorna o locale
    if (cleanPath === '' || cleanPath === '/') {
      return `/${locale}`
    }

    return `/${locale}/${cleanPath}`
  }

  /**
   * Navega para um path locale-aware
   */
  const navigateTo = (path: string) => {
    const localePath = toLocalePath(path)
    // Use window.location para navegação client-side
    window.location.href = localePath
  }

  return {
    locale,
    toLocalePath,
    navigateTo
  }
}

/**
 * Função utilitária para uso em server components
 * Precisa receber o locale como parâmetro
 */
export function toLocalePath(path: string, locale: string): string {
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
    return path
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  if (cleanPath === '' || cleanPath === '/') {
    return `/${locale}`
  }

  return `/${locale}/${cleanPath}`
}
