"use client"

import { motion } from "framer-motion"
import { HowItWorksCard } from "./HowItWorksCard"
import { MarkdownCopyModal } from "./MarkdownCopyModal"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
    action?: 'modal' | 'scroll' | 'navigate'
  }
  screenshot?: string
}

interface HowItWorksSectionProps {
  badge: string
  title: string
  subtitle: string
  items: HowItWorksItem[]
}

export function HowItWorksSection({ badge, title, subtitle, items }: HowItWorksSectionProps) {
  const [markdownModalOpen, setMarkdownModalOpen] = useState(false)
  const router = useRouter()

  const handleCtaClick = (item: HowItWorksItem) => {
    if (item.cta.action === 'modal') {
      setMarkdownModalOpen(true)
    } else if (item.cta.action === 'scroll' && item.cta.href) {
      // Scroll to section if needed (e.g., #platforms)
      const element = document.querySelector(item.cta.href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (item.cta.action === 'navigate' && item.cta.href) {
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

        <div className="container relative">
          {/* header */}
          <div className="mx-auto max-w-2xl text-center mb-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {badge}
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
              {title.split('zero').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="text-primary">zero</span>}
                </span>
              ))}
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              {subtitle}
            </p>
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
                <HowItWorksCard 
                  item={item} 
                  onCtaClick={() => handleCtaClick(item)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarkdownCopyModal 
        open={markdownModalOpen} 
        onOpenChange={setMarkdownModalOpen}
      />
    </>
  )
}
