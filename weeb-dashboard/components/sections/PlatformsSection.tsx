"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Github,
  Gamepad2,
  Music,
  Tv,
  BookOpen,
  Plus,
  LucideIcon,
} from "lucide-react"

interface Platform {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

interface PlatformsSectionProps {
  platforms: Platform[]
}

const iconMap: Record<string, LucideIcon> = {
  Github,
  Gamepad2,
  Music,
  Tv,
  BookOpen,
  Plus,
}

interface PlatformCardProps {
  name: string
  icon: LucideIcon
  description: string
  color: string
  index: number
}

function PlatformCard({
  name,
  icon: Icon,
  description,
  color,
  index,
}: PlatformCardProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1 },
        }),
      }}
    >
      <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
        <Card className="h-full cursor-pointer transition-all hover:shadow-2xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon
                className="w-8 h-8"
                style={{ color }}
              />
            </div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export function PlatformsSection({ platforms }: PlatformsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Connect the platforms that define you
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We use a plugin system: you pick which sources to show, which sections
          to include, and we generate the perfect SVG layout.
        </p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {platforms.map((platform, index) => {
          const Icon = iconMap[platform.icon]
          if (!Icon) return null

          return (
            <PlatformCard
              key={platform.id}
              name={platform.name}
              icon={Icon}
              description={platform.description}
              color={platform.color}
              index={index}
            />
          )
        })}
      </motion.div>
    </section>
  )
}















