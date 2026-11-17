import { useTranslations } from "@/i18n/use-translations"

/**
 * A template's description in the page's language. The descriptions live in D1 as one
 * Portuguese string per template (written by hand, missing their accents), so English
 * and Spanish pages read Portuguese. The official templates are translated in
 * templateDescriptions.<id> in public/locales; any other template falls back to the
 * text stored with it.
 */
export function useTemplateDescription() {
  const t = useTranslations("templateDescriptions")
  return (template: { id: string; description?: string | null }) =>
    t(template.id, { defaultValue: template.description ?? "" })
}
