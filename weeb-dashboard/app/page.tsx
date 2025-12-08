"use client"

import { Header } from "@/components/layout/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { PlatformsSection } from "@/components/sections/PlatformsSection"
import { VisualWizardSection } from "@/components/sections/VisualWizardSection"
import { TemplatesGallery } from "@/components/sections/TemplatesGallery"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection } from "@/components/sections/CTASection"
import { SectionDivider } from "@/components/sections/SectionDivider"
import { homepageData } from "@/lib/data/homepage"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useMemo } from "react"

// Map category to color
const categoryColors: Record<string, string> = {
  coding: "#181717",
  music: "#d51007",
  anime: "#2e51a2",
  gaming: "#1b2838",
  reading: "#382110",
}

export default function Home() {
  // Convert PLUGINS_METADATA to platforms format
  const platforms = useMemo(() => {
    return Object.entries(PLUGINS_METADATA).map(([id, metadata]) => ({
      id,
      name: metadata.displayName,
      icon: metadata.icon,
      description: metadata.description,
      color: categoryColors[metadata.category] || "#8957E5",
    }))
  }, [])

  return (
    <div className="bg-background">
      <Header />
      <HeroSection {...homepageData.hero} />
      <SectionDivider variant="gradient" />
      <PlatformsSection platforms={platforms} />
      <SectionDivider />
      <HowItWorksSection items={homepageData.howItWorks} />
      <SectionDivider />
      <VisualWizardSection feature={homepageData.features[0]} />
      <SectionDivider />
      <TemplatesGallery 
        templates={homepageData.templates} 
        title={homepageData.templatesGallery.title}
        subtitle={homepageData.templatesGallery.subtitle}
        totalTemplatesCount={homepageData.templates.length}
      />
      <SectionDivider />
      <ComparisonSection features={homepageData.keyFeatures} />
      <SectionDivider variant="gradient" />
      <CTASection {...homepageData.cta} />
    </div>
  )
}
