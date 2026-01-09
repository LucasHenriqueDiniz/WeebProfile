import { TemplatesPageClient } from "@/components/templates/TemplatesPageClient"

// Force dynamic rendering to prevent prerender errors during build
export const dynamic = 'force-dynamic'

export default function TemplatesPage() {
  return <TemplatesPageClient />
}

