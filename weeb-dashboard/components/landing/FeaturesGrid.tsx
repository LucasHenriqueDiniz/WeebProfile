"use client"

import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

interface FeatureItem {
  title: string
  body: string
}

export function FeaturesGrid() {
  const t = useTranslations("landing.features")
  const items = (t.raw("items") as FeatureItem[]) ?? []

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading kicker={t("kicker")} title={t("title")} />
      <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="font-heading text-base font-bold text-foreground">{item.title}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
