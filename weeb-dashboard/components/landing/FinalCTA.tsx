"use client"

import { ArrowRight, Check } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"

const GITHUB_REPO_URL = "https://github.com/LucasHenriqueDiniz/WeebProfile"

/**
 * The page closes the way it opens: the hero's pale cyan band, ink type, Sora. Fixed
 * light colours, like the hero, so it reads the same in both themes.
 */
export function FinalCTA() {
  const t = useTranslations("landing.cta")
  const tHero = useTranslations("landing.hero")

  return (
    <section id="cta" className="relative bg-cyan-100 text-slate-900">
      {/* Torn edge from the page above. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-[-1px] h-8 w-full rotate-180 fill-background"
      >
        <path d="M0,40 L0,22 L60,30 L130,12 L210,26 L290,8 L380,24 L470,10 L560,28 L640,14 L730,30 L820,10 L900,24 L990,8 L1080,26 L1150,14 L1200,22 L1200,40 Z" />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.13)_1.4px,transparent_1.4px)] [background-size:18px_18px] [mask-image:linear-gradient(245deg,transparent_40%,black)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-x-12 gap-y-8 px-6 pb-20 pt-24 md:flex-row md:justify-center md:pb-24 md:pt-28">
        <img
          src="/sora/sora_main.png"
          alt={tHero("soraAlt")}
          width={751}
          height={748}
          loading="lazy"
          className="hero-bob w-[190px] flex-none drop-shadow-xl md:w-[230px]"
        />
        <div className="max-w-[560px] text-center md:text-left">
          <h2 className="font-heading text-4xl font-extrabold leading-[1.03] tracking-tight [text-wrap:balance] md:text-6xl">
            {t("title")}{" "}
            <span className="inline-block -rotate-2 rounded-lg border-[3px] border-slate-900 bg-cyan-300 px-2.5 pb-0.5 shadow-[4px_4px_0_0_#0f172a]">
              {t("titleHighlight")}
            </span>
            ?
          </h2>
          <p className="mt-5 text-lg font-medium leading-relaxed text-slate-700">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border-2 border-slate-900 bg-slate-900 px-6 py-3.5 text-[15px] font-semibold text-white shadow-[4px_4px_0_0_#fff] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_#fff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-cyan-100"
            >
              {t("primary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block whitespace-nowrap rounded-lg border-2 border-slate-900 bg-white px-5 py-3.5 text-[15px] font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-cyan-100"
            >
              {t("secondary")}
            </a>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] font-semibold text-slate-700 md:justify-start">
            {[tHero("check1", { max: MAX_SVGS_FREE_TIER }), tHero("check2"), tHero("check3")].map((text) => (
              <span key={text} className="flex items-center gap-1.5 whitespace-nowrap">
                <Check className="h-3.5 w-3.5 text-slate-900" strokeWidth={3} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
