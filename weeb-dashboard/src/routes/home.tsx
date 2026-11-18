import { useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { FeaturesGrid } from "@/components/landing/FeaturesGrid"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { LandingHero } from "@/components/landing/LandingHero"
import { PlatformStrip } from "@/components/landing/PlatformStrip"
import { PluginsShowcase } from "@/components/landing/PluginsShowcase"
import { PreviewYourCard } from "@/components/landing/PreviewYourCard"
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

  // Arriving from another page through the header or footer ("/#plugins"). The router
  // scrolls to the hash when it renders, but this route is lazy-loaded, so at that
  // point the section can still be missing; by the time this effect runs every
  // section is in the DOM. Called directly, not in requestAnimationFrame: a hidden
  // tab never runs that callback.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Ambient backdrop: dot grid fading out down the page. The hero draws its own glow, behind the README frame. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px]">
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      </div>

      <Header />
      <main className="relative pt-16">
        <LandingHero />
        <PreviewYourCard />
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
