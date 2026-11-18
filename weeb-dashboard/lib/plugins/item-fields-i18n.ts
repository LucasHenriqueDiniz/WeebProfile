import type { ObjectArrayItemField } from "@weeb/weeb-plugins/plugins/metadata"

type Translate = (key: string, fallback: string) => string

/**
 * The fields of a list item ("Label", "Address", "Thumbnail"...) in the viewer's
 * language. generate-metadata gives each one an i18nKey; without it the field keeps
 * the English text from plugin.metadata.ts.
 */
export function translateItemFields(fields: ObjectArrayItemField[], translate: Translate): ObjectArrayItemField[] {
  const tr = (key: string | undefined, fallback: string) =>
    key ? translate(key.replace(/^plugins\./, ""), fallback) : fallback

  return fields.map((field) => ({
    ...field,
    label: tr(field.i18nKey?.label, field.label),
    ...(field.placeholder && { placeholder: tr(field.i18nKey?.placeholder, field.placeholder) }),
    ...(field.description && { description: tr(field.i18nKey?.description, field.description) }),
    ...(field.options && {
      options: field.options.map((opt) => ({ ...opt, label: tr(field.i18nKey?.options?.[opt.value], opt.label) })),
    }),
  }))
}
