import { useEffect, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/hooks/useAuth"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { RepositoryWizard } from "@/components/wizard/RepositoryWizard"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"

export default function NewRepositorySvgPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { reset } = useRepositoryWizardStore()
  const { bootstrap, initialized } = useWizardBootstrapStore()
  const hasResetRef = useRef(false)

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
    if (user && !authLoading && !hasResetRef.current) {
      reset()
      hasResetRef.current = true
    }
  }, [user, authLoading, router, reset])

  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return <RepositoryWizard />
}
