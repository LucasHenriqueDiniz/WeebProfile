
import { Header } from "@/components/layout/Header"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection } from "@/components/sections/CTASection"
import { HeroSection } from "@/components/sections/HeroSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { PlatformsSection } from "@/components/sections/PlatformsSection"
import { SectionDivider } from "@/components/sections/SectionDivider"
import { TemplatesGalleryServer } from "@/components/sections/TemplatesGalleryServer"
import { mapApiToTemplates } from "@/lib/template-mapper"
import type { Template } from "@/types/template"

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL?.startsWith("http")
      ? process.env.VERCEL_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}` 
        : "http://localhost:3000"
  )
}

async function fetchPublicTemplates(limit = 5): Promise<Template[]> {
  try {
    const url = new URL("/api/templates", getBaseUrl())
    url.searchParams.set("public", "true")
    url.searchParams.set("limit", String(limit))

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    })

    if (!res.ok) return []

    const data = await res.json()
    return mapApiToTemplates(data.templates || [])
  } catch {
    return []
  }
}

export default async function HomePage() {
  const templates = await fetchPublicTemplates(5)

  return (
    <div className="bg-background">
      <Header />
      <HeroSection />
      <SectionDivider variant="gradient" />
      <PlatformsSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <TemplatesGalleryServer templates={templates} />
      <SectionDivider />
      <ComparisonSection />
      <SectionDivider variant="gradient" />
      <CTASection />
    </div>
  )
}

