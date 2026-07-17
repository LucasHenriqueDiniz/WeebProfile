"use client"

import { motion } from "framer-motion"
import { HowItWorksCard } from "./HowItWorksCard"
import { MarkdownCopyModal } from "./MarkdownCopyModal"
import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

interface HowItWorksItem {
  step: number
  title: string
  description: string
  icon: string
  bullets: string[]
  badge: string
  cta: {
    text: string
    href?: string
    action?: "modal" | "scroll" | "navigate"
  }
  screenshot?: string
}

export function HowItWorksSection() {
  const t = useTranslations("homepage.howItWorks")
  const [markdownModalOpen, setMarkdownModalOpen] = useState(false)
  const router = useRouter()

  const items = [
    {
      step: 1,
      icon: "Shield",
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
      badge: "~1 min",
      bullets: ["OAuth seguro", "1 clique para autorizar", "Revogável a qualquer momento"],
      cta: {
        action: "navigate" as const,
        href: "/login",
        text: "Conectar",
      },
    },
    {
      step: 2,
      icon: "Plug",
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
      badge: "Sem código",
      bullets: ["Templates prontos", "Mix de plugins do seu jeito", "GitHub, MAL, Last.fm, Steam..."],
      cta: {
        action: "navigate" as const,
        href: "/dashboard/new",
        text: "Ver templates",
      },
    },
    {
      step: 3,
      icon: "Palette",
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
      badge: "Live preview",
      bullets: ["Temas prontos", "Preview instantâneo", "Mobile/desktop safe"],
      cta: {
        action: "navigate" as const,
        href: "/dashboard/new",
        text: "Personalizar",
      },
    },
    {
      step: 4,
      icon: "Code",
      title: t("steps.step4.title"),
      description: t("steps.step4.description"),
      badge: "Auto-update",
      bullets: ["Link único do SVG", "Auto-sync", "Markdown pronto para copiar"],
      cta: {
        action: "modal" as const,
        text: "Copiar Markdown",
      },
    },
  ]

  const handleCtaClick = (item: HowItWorksItem) => {
    if (item.cta.action === "modal") {
      setMarkdownModalOpen(true)
    } else if (item.cta.action === "scroll" && item.cta.href) {
      // Scroll to section if needed (e.g., #platforms)
      const element = document.querySelector(item.cta.href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else if (item.cta.action === "navigate" && item.cta.href) {
      router.push(item.cta.href)
    }
  }

  return (
    <>
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* fundo sutil */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto">
          {/* header */}
          <div className="mx-auto max-w-2xl text-center mb-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {t("badge")}
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
              {t.rich("title", {
                zero: (chunks) => <span className="text-primary">{chunks}</span>,
              })}
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* grid de passos - 4 colunas no desktop */}
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <HowItWorksCard item={item} onCtaClick={() => handleCtaClick(item)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarkdownCopyModal open={markdownModalOpen} onOpenChange={setMarkdownModalOpen} />
    </>
  )
}
