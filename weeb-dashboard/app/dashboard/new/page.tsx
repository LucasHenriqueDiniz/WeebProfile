"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { Wizard } from "@/components/wizard/Wizard"

export default function NewSvgPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-4xl text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Wizard tem seu próprio layout completo, sem sidebar
  return <Wizard />
}
