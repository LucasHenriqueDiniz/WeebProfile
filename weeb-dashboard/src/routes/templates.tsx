import { Header } from "@/components/layout/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplatesPageClient } from "@/components/templates/TemplatesPageClient"

export default function TemplatesPage() {
  return (
    <div className="relative bg-background">
      <Header />
      <main className="pt-16">
        <TemplatesPageClient />
      </main>
      <LandingFooter />
    </div>
  )
}
