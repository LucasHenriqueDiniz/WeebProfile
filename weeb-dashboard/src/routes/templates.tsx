import { Header } from "@/components/layout/Header"
import { TemplatesPageClient } from "@/components/templates/TemplatesPageClient"

export default function TemplatesPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="pt-16">
        <TemplatesPageClient />
      </main>
    </div>
  )
}
