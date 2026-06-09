import { Header } from "@/components/layout/Header"
import { TemplateDetailClient } from "@/components/templates/TemplateDetailClient"
import { useParams } from "@/src/compat/next-navigation"

export default function TemplateDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id as string

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="pt-16">
        <TemplateDetailClient templateId={id} />
      </main>
    </div>
  )
}
