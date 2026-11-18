import { Header } from "@/components/layout/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateDetailClient } from "@/components/templates/TemplateDetailClient"
import { useParams } from "@/src/compat/next-navigation"

export default function TemplateDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id as string

  return (
    <div className="relative bg-background">
      <Header />
      <main className="pt-16">
        <TemplateDetailClient templateId={id} />
      </main>
      <LandingFooter />
    </div>
  )
}
