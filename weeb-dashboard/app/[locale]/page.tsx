
"use client"

import { Header } from "@/components/layout/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { PlatformsSection } from "@/components/sections/PlatformsSection"
import { TemplatesGallery } from "@/components/sections/TemplatesGallery"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection } from "@/components/sections/CTASection"
import { SectionDivider } from "@/components/sections/SectionDivider"
import { useEffect, useState } from "react"
import type { Template } from "@/types/template"
import { ensureConsistentPlatforms } from "@/lib/templates-utils"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

function HomePageContent() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPublicTemplates() {
      try {
        setLoading(true)
        // Fetch public templates from API, limit to 5 for homepage performance
        const response = await fetch('/api/templates?public=true&limit=5')
        if (!response.ok) {
          throw new Error('Failed to fetch templates')
        }
        const data = await response.json()

        // Transform API data to Template format
        const transformedTemplates: Template[] = (data.templates || []).map((t: any) => {
          const platforms = ensureConsistentPlatforms(t)
          return {
            id: t.id,
            name: t.name,
            description: t.description || "",
            preview: t.svgId ? `/svgs/${t.svgId}` : undefined,
            platforms,
            style: t.style || "default",
            theme: t.theme || "default",
            size: t.size || "half",
            likes: t.likesCount || t.likes || 0,
            liked: t.userLiked || t.liked || false,
            pluginsConfig: t.pluginsConfig,
            pluginsOrder: t.pluginsOrder,
          }
        })

        setTemplates(transformedTemplates)
      } catch (error) {
        console.error('Error fetching public templates:', error)
        // Fallback to empty array - TemplatesGallery handles empty state gracefully
        setTemplates([])
      } finally {
        setLoading(false)
      }
    }

    fetchPublicTemplates()
  }, [])

  return (
    <div className="bg-background">
      <Header />
      <HeroSection />
      <SectionDivider variant="gradient" />
      <PlatformsSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <TemplatesGallery templates={templates} loading={loading} />
      <SectionDivider />
      <ComparisonSection />
      <SectionDivider variant="gradient" />
      <CTASection />
    </div>
  )
}

export default function HomePage() {
  return <HomePageContent />
}

