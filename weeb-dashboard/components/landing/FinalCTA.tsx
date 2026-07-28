"use client"

import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

const GITHUB_REPO_URL = "https://github.com/LucasHenriqueDiniz/WeebProfile"

export function FinalCTA() {
  const t = useTranslations("landing.cta")

  return (
    <section id="cta" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[620px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),transparent_70%)]"
          />
          <div className="relative mx-auto mb-3.5 h-[132px] w-[132px]">
            <img
              src="/sora/sora_main.png"
              alt="Sora, WeebProfile mascot"
              className="h-full w-full object-contain drop-shadow-[0_12px_30px_rgba(139,92,246,0.4)]"
            />
          </div>
          <h2 className="relative font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-[42px]">
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
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_34px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
            >
              {t("primary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block whitespace-nowrap rounded-lg border border-border bg-background px-5 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-accent"
            >
              {t("secondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
