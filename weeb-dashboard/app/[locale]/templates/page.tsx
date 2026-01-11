
import { Header } from "@/components/layout/Header"
import { TemplatesPageClient } from "@/components/templates/TemplatesPageClient"
import type { Locale } from "@/i18n/config"
import { setRequestLocale } from 'next-intl/server'

interface TemplatesPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function TemplatesPage({ params }: TemplatesPageProps) {
  const { locale } = await params
  // Enable static rendering
  setRequestLocale(locale)

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="pt-16">
        <TemplatesPageClient />
      </main>
    </div>
  )
}