"use client"

import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useMemo } from "react"
import { useTranslations } from "@/i18n/use-translations"

/**
 * Faixa fina logo abaixo do hero com o nome das plataformas suportadas —
 * social proof rápido, sem cards nem carrossel.
 */
export function PlatformStrip() {
  const t = useTranslations("homepage.platformStrip")

  const names = useMemo(
    () => Object.values(PLUGINS_METADATA as Record<string, { displayName: string }>).map((m) => m.displayName),
    []
  )

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-y border-border/60 py-5">
        <span className="whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
          {t("label")}
        </span>
        {names.map((name) => (
          <span key={name} className="whitespace-nowrap font-heading text-[15px] font-semibold text-muted-foreground">
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
