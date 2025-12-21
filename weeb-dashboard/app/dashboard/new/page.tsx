"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Wizard } from "@/components/wizard/Wizard"
import { useWizardStore } from "@/stores/wizard-store"

export default function NewSvgPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { reset } = useWizardStore()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Reset wizard store when accessing /new to ensure clean state
    if (user && !authLoading) {
      reset()
    }
  }, [user, authLoading, router, reset])

  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  // Wizard tem seu próprio layout completo, sem sidebar
  return <Wizard />
}
