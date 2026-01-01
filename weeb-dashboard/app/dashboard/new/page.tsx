"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Wizard } from "@/components/wizard/Wizard"
import { useWizardStore } from "@/stores/wizard-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function NewSvgPage() { // Updated
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { reset, plugins, pluginsOrder } = useWizardStore()
  const hasResetRef = useRef(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)

  // Check if there are saved configurations
  const hasSavedData = useMemo(() => {
    if (!plugins || !pluginsOrder) return false
    const enabledPlugins = Object.values(plugins).filter(p => p.enabled)
    return enabledPlugins.length > 0 || pluginsOrder.length > 0
  }, [plugins, pluginsOrder])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Only check for saved data after auth is loaded and we have a user
    if (user && !authLoading && !hasResetRef.current) {
      if (hasSavedData) {
        setShowResumeDialog(true)
      } else {
        reset() // Normal reset for new creation
        hasResetRef.current = true
      }
    }
  }, [user, authLoading, router, reset, hasSavedData])

  const handleStartFresh = () => {
    reset() // Normal reset for new creation
    hasResetRef.current = true
    setShowResumeDialog(false)
  }

  const handleContinue = () => {
    hasResetRef.current = true
    setShowResumeDialog(false)
  }

  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Dialog open={showResumeDialog} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continuar configuração anterior?</DialogTitle>
            <DialogDescription>
              Detectamos que você tem uma configuração em andamento salva. Deseja continuar de onde parou ou começar do zero?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleStartFresh}>
              Começar do zero
            </Button>
            <Button onClick={handleContinue}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Wizard />
    </>
  )
}
