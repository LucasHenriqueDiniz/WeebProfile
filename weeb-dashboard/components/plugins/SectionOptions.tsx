"use client"

import { Hash, Heading, ImageIcon, ListChecks, ListOrdered, ToggleRight, Type, type LucideIcon } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import type { OptionView, SectionView } from "@/lib/plugins/catalog"
import { cn } from "@/lib/utils"

const KIND_ICON: Record<OptionView["kind"], LucideIcon> = {
  toggle: ToggleRight,
  number: Hash,
  choice: ListChecks,
  text: Type,
  list: ListOrdered,
  image: ImageIcon,
}

/** The right-hand side of a row: what the option takes and where it starts. */
function OptionHint({ option }: { option: OptionView }) {
  const t = useTranslations("landing.pluginsPage.options")
  switch (option.kind) {
    case "toggle":
      return <>{t(option.defaultOn ? "on" : "off")}</>
    case "number": {
      const parts = [
        option.min !== undefined && option.max !== undefined ? t("range", { min: option.min, max: option.max }) : null,
        option.defaultValue !== undefined ? t("default", { value: option.defaultValue }) : null,
      ].filter(Boolean)
      return <>{parts.join(" · ")}</>
    }
    case "text":
      return <>{option.defaultValue ? `“${option.defaultValue}”` : t("text")}</>
    case "list":
      return <>{option.maxItems ? t("upTo", { count: option.maxItems }) : t("list")}</>
    case "image":
      return <>{t("image")}</>
    case "choice":
      return null
  }
}

function OptionRow({ option }: { option: OptionView }) {
  const Icon = KIND_ICON[option.kind]
  return (
    <li title={option.description} className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 px-3 py-2">
      <Icon aria-hidden className="h-3.5 w-3.5 flex-none translate-y-0.5 text-muted-foreground" />
      <span className="font-medium text-foreground">{option.label}</span>
      {option.kind === "choice" ? (
        // The values themselves: they say more than "a choice" would.
        <span className="flex w-full flex-wrap gap-1.5 pl-[22px]">
          {option.choices.map((choice) => {
            const isDefault = choice.value === option.defaultValue
            return (
              <span
                key={choice.value}
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-[11.5px] leading-tight",
                  isDefault
                    ? "border-foreground bg-cyan-300 font-semibold text-slate-950"
                    : "border-foreground/25 text-muted-foreground"
                )}
              >
                {choice.label}
              </span>
            )
          })}
        </span>
      ) : (
        <span className="ml-auto text-right text-[12px] text-muted-foreground">
          <OptionHint option={option} />
        </span>
      )}
    </li>
  )
}

/**
 * What one section lets the user change, as the catalog shows it: a row per option with
 * its kind, its translated label and its range, choices or default. The title pair every
 * section has is one line at the end instead of two rows each.
 */
export function SectionOptions({ section, className }: { section: SectionView; className?: string }) {
  const t = useTranslations("landing.pluginsPage.options")
  const titleActions = [section.title.rename && t("rename"), section.title.hide && t("hide")].filter(Boolean)

  if (section.options.length === 0 && titleActions.length === 0) {
    return <p className={cn("px-0.5 text-[12.5px] text-muted-foreground", className)}>{t("none")}</p>
  }

  return (
    <ul
      aria-label={t("heading")}
      className={cn(
        "divide-y divide-foreground/10 rounded-xl border-2 border-foreground/15 bg-card text-[13px]",
        className
      )}
    >
      {section.options.map((option) => (
        <OptionRow key={option.key} option={option} />
      ))}
      {titleActions.length > 0 && (
        <li className="flex items-baseline gap-2 px-3 py-2">
          <Heading aria-hidden className="h-3.5 w-3.5 flex-none translate-y-0.5 text-muted-foreground" />
          <span className="font-medium text-foreground">{t("title")}</span>
          <span className="ml-auto text-[12px] text-muted-foreground">{titleActions.join(" · ")}</span>
        </li>
      )}
    </ul>
  )
}
