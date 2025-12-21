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

export default function Home() {
  return (
    <div className="bg-background">
      <Header />
      <HeroSection {...homepageData.hero} />
      <SectionDivider variant="gradient" />
      <PlatformsSection />
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
