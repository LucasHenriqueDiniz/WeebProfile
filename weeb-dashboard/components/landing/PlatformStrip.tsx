"use client"

import { useTranslations } from "@/i18n/use-translations"
import { FaGithub, FaLastfmSquare, FaSteam } from "react-icons/fa"
import { SiMyanimelist, SiCodeforces, SiDuolingo, SiAnilist, SiDevdotto, SiCodewars } from "react-icons/si"
import { GiWeightLiftingUp } from "react-icons/gi"
import type { ComponentType } from "react"

interface PlatformChip {
  name: string
  icon: ComponentType<{ className?: string }>
  /** Brand color on hover — each platform lights up with its own identity. */
  hover: string
}

// Lista curada, não a de plugins inteira: são os chips que cabem numa faixa só.
// Mas ela envelheceu -- AniList, Dev.to e Codewars existiam e não apareciam aqui.
// Ao adicionar um plugin, conferir se ele merece um chip.
const PLATFORMS: PlatformChip[] = [
  { name: "GitHub", icon: FaGithub, hover: "hover:border-foreground/40 hover:text-foreground" },
  { name: "Last.fm", icon: FaLastfmSquare, hover: "hover:border-red-500/50 hover:text-red-500" },
  { name: "MyAnimeList", icon: SiMyanimelist, hover: "hover:border-blue-500/50 hover:text-blue-400" },
  { name: "AniList", icon: SiAnilist, hover: "hover:border-indigo-500/50 hover:text-indigo-400" },
  { name: "Steam", icon: FaSteam, hover: "hover:border-sky-500/50 hover:text-sky-400" },
  { name: "Dev.to", icon: SiDevdotto, hover: "hover:border-foreground/40 hover:text-foreground" },
  { name: "Codeforces", icon: SiCodeforces, hover: "hover:border-amber-500/50 hover:text-amber-500" },
  { name: "Codewars", icon: SiCodewars, hover: "hover:border-rose-500/50 hover:text-rose-400" },
  { name: "Duolingo", icon: SiDuolingo, hover: "hover:border-emerald-500/50 hover:text-emerald-500" },
  { name: "Lyfta", icon: GiWeightLiftingUp, hover: "hover:border-violet-500/50 hover:text-violet-400" },
]

export function PlatformStrip() {
  const t = useTranslations("landing.platforms")
  return (
    <section className="mx-auto max-w-6xl px-6 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2.5 border-y border-border/60 py-6">
        <span className="mr-3 whitespace-nowrap text-[11.5px] font-semibold tracking-[0.14em] text-muted-foreground/60">
          {t("label")}
        </span>
        {PLATFORMS.map((p) => {
          const Icon = p.icon
          return (
            <span
              key={p.name}
              className={`flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-3.5 py-2 font-heading text-[13.5px] font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:shadow-md ${p.hover}`}
            >
              <Icon className="h-4 w-4" />
              {p.name}
            </span>
          )
        })}
      </div>
    </section>
  )
}
