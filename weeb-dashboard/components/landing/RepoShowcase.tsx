"use client"

import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

export function RepoShowcase() {
  const t = useTranslations("landing.repos")
  const chips = [t("banner"), t("stats"), t("starGrowth"), t("languages"), t("topics")]

  return (
    <section id="repos" className="border-t border-border/60 bg-muted/50 dark:bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading
              align="left"
              kicker={t("kicker")}
              kickerClassName="text-cyan-500"
              title={t("title")}
              subtitle={t.rich("subtitle", { mode: (c) => <b className="text-foreground">{c}</b> })}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-cyan-500/50 hover:text-cyan-500"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Colagem de previews reais — sem molduras rotuladas; os SVGs falam por si,
              com glow atrás e leve rotação que endireita no hover. Duas colunas
              defasadas para mostrar mais visuais sem virar uma grade rígida. */}
          <div aria-hidden className="relative">
            <div className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-[0.14] blur-[110px] dark:opacity-20" />
            {/* Tres variantes do banner (a section tem 13 estilos), curva de estrelas
                e as badges de tecnologias — o leque real do modo Repository. */}
            <div className="relative grid grid-cols-2 items-start gap-5">
              <div className="flex flex-col gap-5">
                <img
                  src="/previews/github_repo/default/banner.svg"
                  alt=""
                  loading="lazy"
                  className="-rotate-1 rounded transition-transform duration-300 [filter:drop-shadow(0_10px_30px_rgba(0,0,0,0.25))] hover:rotate-0 hover:scale-[1.03]"
                />
                <img
                  src="/previews/github_repo/default/banner_split.svg"
                  alt=""
                  loading="lazy"
                  className="rotate-1 rounded transition-transform duration-300 [filter:drop-shadow(0_10px_30px_rgba(0,0,0,0.25))] hover:rotate-0 hover:scale-[1.03]"
                />
              </div>
              <div className="mt-8 flex flex-col gap-5">
                <img
                  src="/previews/github_repo/default/banner_aurora.svg"
                  alt=""
                  loading="lazy"
                  className="rotate-1 rounded transition-transform duration-300 [filter:drop-shadow(0_10px_30px_rgba(0,0,0,0.3))] hover:rotate-0 hover:scale-[1.03]"
                />
                <img
                  src="/previews/github_repo/default/languages.svg"
                  alt=""
                  loading="lazy"
                  className="-rotate-1 rounded transition-transform duration-300 [filter:drop-shadow(0_10px_30px_rgba(0,0,0,0.25))] hover:rotate-0 hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
