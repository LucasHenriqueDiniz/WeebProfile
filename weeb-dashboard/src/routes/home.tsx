import { useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { FeaturesGrid } from "@/components/landing/FeaturesGrid"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { LandingHero } from "@/components/landing/LandingHero"
import { PlatformStrip } from "@/components/landing/PlatformStrip"
import { PluginsShowcase } from "@/components/landing/PluginsShowcase"
import { RepoShowcase } from "@/components/landing/RepoShowcase"
import { StylesShowcase } from "@/components/landing/StylesShowcase"
import { TemplatesShowcase } from "@/components/landing/TemplatesShowcase"
import { usePublicTemplatesStore } from "@/lib/stores/public-templates.store"

export default function HomePageClient() {
  const templates = usePublicTemplatesStore((s) => s.templates)
  const loading = usePublicTemplatesStore((s) => s.loading)
  const fetchPublic = usePublicTemplatesStore((s) => s.fetchPublic)

  useEffect(() => {
    void fetchPublic({ limit: 3, ttlMs: 60_000 })
  }, [fetchPublic])

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Ambient backdrop: dot grid + glow orbs fading out down the page */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px]">
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="animate-landing-pulse absolute -left-36 -top-56 h-[620px] w-[620px] rounded-full bg-primary opacity-[0.16] blur-[160px]" />
        <div className="animate-landing-pulse absolute -right-44 -top-40 h-[560px] w-[560px] rounded-full bg-cyan-500 opacity-[0.13] blur-[160px] [animation-delay:2s]" />
      </div>

      <Header />
      <main className="relative pt-16">
        <LandingHero />
        <PlatformStrip />
        <HowItWorks />
        <PluginsShowcase />
        <TemplatesShowcase templates={templates} loading={loading} />
        <RepoShowcase />
        <StylesShowcase />
        <FeaturesGrid />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
