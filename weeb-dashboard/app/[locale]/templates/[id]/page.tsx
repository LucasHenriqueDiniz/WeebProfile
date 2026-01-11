// Force dynamic rendering to avoid static generation issues with next-intl
export const dynamic = 'force-dynamic'

import { Header } from "@/components/layout/Header"
import { TemplateDetailClient } from "@/components/templates/TemplateDetailClient"
import type { Locale } from "@/i18n/config"
import { setRequestLocale } from 'next-intl/server'

interface TemplateDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { locale, id } = await params
  // Enable static rendering
  setRequestLocale(locale)

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="pt-16">
        <TemplateDetailClient templateId={id} />
      </main>
    </div>
  )
}