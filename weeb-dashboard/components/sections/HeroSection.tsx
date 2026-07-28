"use client"

import { Button } from "@/components/ui/button"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { motion } from "framer-motion"
import { Check, Zap } from "lucide-react"
import { HeroMarquee } from "./HeroMarquee"
import { useTranslations } from "@/i18n/use-translations"
import { Link, Link as LocaleLink } from "@/i18n/navigation"

export function HeroSection() {
  const t = useTranslations("homepage.hero")
  const pluginCount = Object.keys(PLUGINS_METADATA).length

  const trustItems = [t("trust1"), t("trust2"), t("trust3")]

  return (
    <section className="relative flex min-h-[640px] items-center overflow-hidden pt-16" aria-label="Hero section">
      {/* Glows de fundo */}
      <div
        className="pointer-events-none absolute -left-36 -top-56 h-[620px] w-[620px] rounded-full bg-violet-500/15 blur-[160px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-44 -top-40 h-[560px] w-[560px] rounded-full bg-cyan-500/10 blur-[160px]"
        aria-hidden="true"
      />

      {/* Marquee de cards à direita */}
      <HeroMarquee />

      <div className="container relative z-10 mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[600px]"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
            <span
              className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
              aria-hidden="true"
            />
            {t("badge", { count: pluginCount })}
          </div>

          {/* Título */}
          <h1 className="mt-6 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[60px] [text-wrap:balance]">
            {t.rich("titleLine", {
              highlight: (chunks) => (
                <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          {/* Subtítulo */}
          <p className="mt-5 max-w-[460px] text-[17px] leading-relaxed text-muted-foreground">{t("subtitle")}</p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-6 text-base font-semibold text-white shadow-[0_0_34px_rgba(139,92,246,0.45)] transition-shadow hover:shadow-[0_0_44px_rgba(139,92,246,0.6)]"
            >
              <LocaleLink href="/login">
                <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("ctaPrimary")}
              </LocaleLink>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border bg-card/80 px-6 py-6 text-base font-semibold backdrop-blur-sm hover:border-primary/50"
            >
              <Link href="/templates">{t("ctaSecondary")}</Link>
            </Button>
          </div>

          {/* Trust bullets */}
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-muted-foreground">
            {trustItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
