import { useState, useEffect } from "react"
import { useRouter } from "@/src/compat/next-navigation"
import { useAuth } from "@/hooks/useAuth"
import { SignIn } from "@clerk/react"
import { Link } from "@/i18n/navigation"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { AuthDecoration } from "@/components/auth/AuthDecoration"
import { clerkAppearance } from "@/components/auth/clerk-appearance"

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    // Se o usuário estiver logado, redirecionar para dashboard
    if (!authLoading && user) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    const errorDescription = params.get("error_description")

    if (error) {
      setErrorMessage(errorDescription || `Erro: ${error}`)
      window.history.replaceState({}, "", "/login")
    }
  }, [])

  // Sem a publishable key do Clerk o isLoaded nunca resolve e a página ficaria num
  // loading infinito — falha explícita em vez de spinner eterno.
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    return (
      <AuthDecoration title="Login indisponível">
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-300">
            Autenticação não configurada neste ambiente (VITE_CLERK_PUBLISHABLE_KEY ausente no build).
          </p>
        </div>
      </AuthDecoration>
    )
  }

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return <LoadingScreen />
  }

  return (
    <AuthDecoration
      title="Bem-vindo de volta"
      subtitle="Entre para gerenciar seus cards e manter seu perfil do GitHub sempre atualizado."
    >
      {errorMessage && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10">
          <p className="text-xs text-red-300">{errorMessage}</p>
        </div>
      )}

      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/signup"
        appearance={clerkAppearance}
        fallbackRedirectUrl="/dashboard"
      />

      {/* Switch to Signup */}
      <p className="text-[13px] text-center text-muted-foreground mt-6">
        Não tem conta?{" "}
        <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
          Criar conta
        </Link>
      </p>
    </AuthDecoration>
  )
}
