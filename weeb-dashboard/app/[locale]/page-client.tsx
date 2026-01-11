"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection } from "@/components/sections/CTASection"
import { HeroSection } from "@/components/sections/HeroSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { PlatformsSection } from "@/components/sections/PlatformsSection"
import { SectionDivider } from "@/components/sections/SectionDivider"
import { TemplatesGallery } from "@/components/sections/TemplatesGallery"
import { usePublicTemplatesStore } from "@/lib/stores/public-templates.store"

export default function HomePageClient() {
  const templates = usePublicTemplatesStore((s) => s.templates)
  const loading = usePublicTemplatesStore((s) => s.loading)
  const fetchPublic = usePublicTemplatesStore((s) => s.fetchPublic)

  useEffect(() => {
    void fetchPublic({ limit: 5, ttlMs: 60_000 })
  }, [fetchPublic])

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
