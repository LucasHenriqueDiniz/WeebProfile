"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CTASectionProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  note: string
}

export function CTASection({
  title,
  description,
  buttonText,
  buttonHref,
  note,
}: CTASectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center space-y-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
        <p className="text-xl text-muted-foreground">{description}</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>
        </motion.div>
        <p className="text-sm text-muted-foreground">{note}</p>
      </motion.div>
    </section>
  )
}















