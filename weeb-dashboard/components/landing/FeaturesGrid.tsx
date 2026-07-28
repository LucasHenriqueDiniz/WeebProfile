"use client"

import { BookMarked, Eye, KeyRound, RefreshCw, Zap } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

interface FeatureItem {
  title: string
  body: string
}

const FEATURE_STYLE = [
  { icon: Zap, tile: "from-violet-500/20 to-violet-500/5 text-violet-500", hover: "hover:border-violet-500/40" },
  { icon: RefreshCw, tile: "from-cyan-500/20 to-cyan-500/5 text-cyan-500", hover: "hover:border-cyan-500/40" },
  { icon: Eye, tile: "from-pink-500/20 to-pink-500/5 text-pink-500", hover: "hover:border-pink-500/40" },
  { icon: KeyRound, tile: "from-amber-500/20 to-amber-500/5 text-amber-500", hover: "hover:border-amber-500/40" },
  {
    icon: BookMarked,
    tile: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
    hover: "hover:border-emerald-500/40",
  },
  {
    icon: FaGithub,
    tile: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-500",
    hover: "hover:border-fuchsia-500/40",
  },
]

export function FeaturesGrid() {
  const t = useTranslations("landing.features")
  const items = (t.raw("items") as FeatureItem[]) ?? []
  const [first, ...rest] = items

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading kicker={t("kicker")} title={t("title")} />
      <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Primeira feature em destaque: mostra literalmente "a uma linha" no README */}
        {first && (
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-[0_10px_36px_-14px_rgba(139,92,246,0.4)] sm:col-span-2">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 text-violet-500 transition-transform group-hover:scale-110">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <div className="font-heading text-base font-bold text-foreground">{first.title}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{first.body}</p>
              </div>
            </div>
            <pre className="mt-5 overflow-x-auto rounded-xl border border-border/60 bg-muted/50 px-4 py-3 font-mono text-xs leading-relaxed dark:bg-[#010409]">
              <code>
                <span className="text-muted-foreground/60"># README.md</span>
                {"\n"}
                <span className="text-pink-500">![</span>
                <span className="text-foreground">WeebProfile</span>
                <span className="text-pink-500">](</span>
                <span className="text-cyan-500">https://weebprofile.com/svg/you.svg</span>
                <span className="text-pink-500">)</span>
              </code>
            </pre>
          </div>
        )}
        {rest.map((item, i) => {
          const s = FEATURE_STYLE[(i + 1) % FEATURE_STYLE.length]
          const Icon = s.icon
          return (
            <div
              key={item.title}
              className={`group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 ${s.hover}`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110 ${s.tile}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="mt-3.5 font-heading text-base font-bold text-foreground">{item.title}</div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
