"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useRouter } from "@/i18n/routing"
import { useAuth } from "@/hooks/useAuth"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Wizard } from "@/components/wizard/Wizard"
import { useWizardStore } from "@/stores/wizard-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"

export default function NewSvgPage() { // Updated
  const t = useTranslations('wizard')
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { reset, plugins, pluginsOrder } = useWizardStore()
  const { bootstrap, initialized } = useWizardBootstrapStore()
  const hasResetRef = useRef(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)

  // Check if there are saved configurations
  const hasSavedData = useMemo(() => {
    if (!plugins || !pluginsOrder) return false
    const enabledPlugins = Object.values(plugins).filter(p => p.enabled)
    return enabledPlugins.length > 0 || pluginsOrder.length > 0
  }, [plugins, pluginsOrder])

  // Bootstrap wizard data once on mount
  useEffect(() => {
    if (user && !authLoading && !initialized) {
      bootstrap()
    }
  }, [user, authLoading, initialized, bootstrap])

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
            <DialogTitle>{t('resumeDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('resumeDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleStartFresh}>
              {t('resumeDialog.startFresh')}
            </Button>
            <Button onClick={handleContinue}>
              {t('resumeDialog.continue')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Wizard />
    </>
  )
}
