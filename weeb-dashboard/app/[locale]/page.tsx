// Force dynamic rendering to avoid static generation issues with next-intl
export const dynamic = 'force-dynamic'

import { Header } from "@/components/layout/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { PlatformsSection } from "@/components/sections/PlatformsSection"
import { TemplatesGallery } from "@/components/sections/TemplatesGallery"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection } from "@/components/sections/CTASection"
import { SectionDivider } from "@/components/sections/SectionDivider"
import { getHomepageContent } from "@/lib/content/home"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { setRequestLocale } from 'next-intl/server'
import type { Locale } from "@/i18n/config"

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  // Enable static rendering
  setRequestLocale(locale)
  const content = await getHomepageContent(locale)

  // Get platforms count for badge
  const platformsCount = Object.keys(PLUGINS_METADATA).length
  const platformsBadge = content.platforms.badge.replace('{count}', platformsCount.toString())

  return (
    <div className="bg-background">
      <Header />
      <HeroSection {...content.hero} />
      <SectionDivider variant="gradient" />
      <PlatformsSection {...{ ...content.platforms, badge: platformsBadge }} />
      <SectionDivider />
      <HowItWorksSection {...content.howItWorks} />
      <SectionDivider />
      <TemplatesGallery 
        templates={content.templates} 
        {...content.templatesGallery}
      />
      <SectionDivider />
      <ComparisonSection {...content.comparison} />
      <SectionDivider variant="gradient" />
      <CTASection {...content.cta} />
    </div>
  )
}

