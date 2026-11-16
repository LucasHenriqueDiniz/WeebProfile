import { useEffect, useRef, useState, useMemo } from "react"
import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "@/src/compat/next-navigation"
import { useAuth } from "@/hooks/useAuth"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Wizard } from "@/components/wizard/Wizard"
import { useWizardStore } from "@/stores/wizard-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslations } from "@/i18n/use-translations"
import { PREVIEW_HANDOFF_SOURCE, parsePreviewRequest } from "@/lib/preview/public-preview"
import { forgetReturnTo, withReturnTo } from "@/lib/return-to"
import { useToast } from "@/hooks/use-toast"

export default function NewProfileSvgPage() {
  const t = useTranslations("wizard")
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { reset, plugins, pluginsOrder, loadFromTemplate, loadFromPreview } = useWizardStore()
  const { bootstrap, initialized } = useWizardBootstrapStore()
  const hasResetRef = useRef(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false)

  // Get template ID from URL
  const templateId = searchParams.get("template")

  // The card a visitor built on the landing page before signing up (?source=preview&plugin=…).
  // Read once: loadFromPreview is applied a single time, and the parse is a whitelist.
  const [previewHandoff] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("source") !== PREVIEW_HANDOFF_SOURCE) return null
    const parsed = parsePreviewRequest(params)
    return parsed.ok ? parsed.value : null
  })

  useEffect(() => {
    if (previewHandoff && user && !authLoading && !hasResetRef.current) {
      loadFromPreview(previewHandoff)
      hasResetRef.current = true
      forgetReturnTo()
    }
  }, [previewHandoff, user, authLoading, loadFromPreview])

  // Check if there are saved configurations
  const hasSavedData = useMemo(() => {
    if (!plugins || !pluginsOrder) return false
    const enabledPlugins = Object.values(plugins).filter((p) => p.enabled)
    return enabledPlugins.length > 0 || pluginsOrder.length > 0
  }, [plugins, pluginsOrder])

  // Load template data if template ID is provided, once per template id. This effect
  // used to list isLoadingTemplate in its deps and check it here: each finished load
  // set it back to false, which ran the effect again, so the page refetched the
  // template in a loop and never left the loading screen.
  const requestedTemplateRef = useRef<string | null>(null)
  useEffect(() => {
    if (templateId && user && !authLoading && initialized && requestedTemplateRef.current !== templateId) {
      requestedTemplateRef.current = templateId
      setIsLoadingTemplate(true)

      fetch(`/api/templates/${templateId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Template not found")
          }
          return response.json()
        })
        .then((data: any) => {
          if (!data?.template) throw new Error("Template not found")
          loadFromTemplate(data.template)
          hasResetRef.current = true
        })
        .catch((error) => {
          console.error("Error loading template:", error)
          // Say so and leave the wizard alone. This used to reset it, which silently
          // wiped a saved draft. Dropping the template from the URL lets the page go
          // on as if none was asked for: it offers to resume a draft, or starts fresh.
          toast({
            title: t("templateLoadError.title"),
            description: t("templateLoadError.description"),
            variant: "destructive",
          })
          const rest = new URLSearchParams(searchParams.toString())
          rest.delete("template")
          const query = rest.toString()
          router.replace(`/dashboard/new/profile${query ? `?${query}` : ""}`)
        })
        .finally(() => {
          setIsLoadingTemplate(false)
        })
    }
  }, [templateId, user, authLoading, initialized, loadFromTemplate, toast, t, searchParams, router])

  // Bootstrap wizard data once on mount
  useEffect(() => {
    if (user && !authLoading && !initialized) {
      bootstrap()
    }
  }, [user, authLoading, initialized, bootstrap])

  useEffect(() => {
    if (!authLoading && !user) {
      // Back here after signing in, with the same query: a template or a previewed card.
      router.push(withReturnTo("/login", `${window.location.pathname}${window.location.search}`))
      return
    }

    // Only check for saved data after auth is loaded and we have a user
    // Skip if we're loading a template
    if (user && !authLoading && !hasResetRef.current && !isLoadingTemplate) {
      if (previewHandoff) {
        // Applied by the effect above; the visitor chose this card, nothing to resume.
      } else if (hasSavedData && !templateId) {
        setShowResumeDialog(true)
      } else if (!templateId) {
        reset() // Normal reset for new creation
        hasResetRef.current = true
      }
    }
  }, [user, authLoading, router, reset, hasSavedData, templateId, isLoadingTemplate, previewHandoff])

  const handleStartFresh = () => {
    reset() // Normal reset for new creation
    hasResetRef.current = true
    setShowResumeDialog(false)
  }

  const handleContinue = () => {
    hasResetRef.current = true
    setShowResumeDialog(false)
  }

  if (authLoading || isLoadingTemplate) {
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
            <DialogTitle>{t("resumeDialog.title")}</DialogTitle>
            <DialogDescription>{t("resumeDialog.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleStartFresh}>
              {t("resumeDialog.startFresh")}
            </Button>
            <Button onClick={handleContinue}>{t("resumeDialog.continue")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Wizard />
    </>
  )
}
