import { useTranslation } from "react-i18next"

/**
 * Compatibility shim: drop-in replacement for next-intl's useTranslations.
 * Components change only the import — t('key') usage stays identical.
 */
export function useTranslations(namespace: string) {
  const { t } = useTranslation()
  return (key: string, params?: Record<string, unknown>) =>
    t(`${namespace}.${key}`, params as any) as string
}
