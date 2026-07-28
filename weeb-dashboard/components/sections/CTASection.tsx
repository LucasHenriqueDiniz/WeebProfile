"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

export function CTASection() {
  const t = useTranslations("homepage.cta")
  return (
    <section className="border-t border-border/60">
      <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[20px] border border-border bg-card px-6 py-14 text-center sm:px-10"
        >
          {/* Glow radial no topo do card */}
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[620px] -translate-x-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.35), transparent 70%)" }}
            aria-hidden="true"
          />

          <h2 className="relative mx-auto max-w-2xl font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-[42px] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-[460px] text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("description")}
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-pink-500 px-7 py-6 text-base font-semibold text-white shadow-[0_0_34px_rgba(139,92,246,0.45)] transition-shadow hover:shadow-[0_0_44px_rgba(139,92,246,0.6)]"
            >
              <Link href="/login">{t("buttonText")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border bg-background px-6 py-6 text-base font-semibold"
            >
              <Link href="https://github.com/LucasHenriqueDiniz/WeebProfile" target="_blank" rel="noopener noreferrer">
                {t("githubButton")}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
