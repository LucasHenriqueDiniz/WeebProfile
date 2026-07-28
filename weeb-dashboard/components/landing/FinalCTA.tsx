"use client"

import { ArrowRight, Check } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

const GITHUB_REPO_URL = "https://github.com/LucasHenriqueDiniz/WeebProfile"

export function FinalCTA() {
  const t = useTranslations("landing.cta")
  const tHero = useTranslations("landing.hero")

  return (
    <section id="cta" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        {/* Moldura em gradiente (p-px) segurando o card — a borda e parte do brilho */}
        <div className="rounded-[26px] bg-gradient-to-br from-primary/50 via-border to-cyan-500/40 p-px shadow-[0_20px_80px_-30px_rgba(139,92,246,0.5)]">
          <div className="relative overflow-hidden rounded-[25px] bg-card px-8 py-16 text-center">
            {/* Fundo: dot grid + glows nos cantos */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.05)_1px,transparent_1px)] [background-size:20px_20px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[560px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-24 h-72 w-72 rounded-full bg-cyan-500 opacity-10 blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -left-24 h-72 w-72 rounded-full bg-pink-500 opacity-10 blur-[100px]"
            />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto mb-4 h-[132px] w-[132px]"
            >
              <span
                aria-hidden
                className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/30 blur-2xl"
              />
              <img
                src="/sora/sora_main.png"
                alt="Sora, WeebProfile mascot"
                className="relative h-full w-full object-contain drop-shadow-[0_12px_30px_rgba(139,92,246,0.4)]"
              />
            </motion.div>

            <h2 className="relative font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-[44px]">
              {t("title")}{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-cyan-500 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
              ?
            </h2>
            <p className="relative mx-auto mt-4 max-w-[460px] text-base leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-base font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.03]"
              >
                {t("primary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block whitespace-nowrap rounded-xl border border-border bg-background/80 px-6 py-4 text-base font-semibold text-foreground transition-colors hover:bg-accent"
              >
                {t("secondary")}
              </a>
            </div>

            <div className="relative mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-muted-foreground/80">
              {[tHero("check1"), tHero("check2"), tHero("check3")].map((c) => (
                <span key={c} className="flex items-center gap-1.5 whitespace-nowrap">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
