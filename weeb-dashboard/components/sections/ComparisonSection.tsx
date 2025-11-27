"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface ComparisonPoint {
  feature: string
  traditional: string
  weebprofile: string
}

interface ComparisonData {
  title: string
  subtitle: string
  points: ComparisonPoint[]
}

interface ComparisonSectionProps {
  comparison: ComparisonData
}

export function ComparisonSection({ comparison }: ComparisonSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {comparison.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {comparison.subtitle}
        </p>
      </motion.div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {comparison.points.map((point, index) => (
          <motion.div
            key={point.feature}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: (i: number) => ({
                opacity: 1,
                x: 0,
                transition: { delay: i * 0.1 },
              }),
            }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div className="font-semibold text-lg">{point.feature}</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>{point.traditional}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>{point.weebprofile}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}















