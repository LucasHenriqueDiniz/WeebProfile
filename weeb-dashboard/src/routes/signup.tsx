import { useEffect } from "react"
import { useRouter } from "@/src/compat/next-navigation"
import { useAuth } from "@/hooks/useAuth"
import { SignUp } from "@clerk/react"
import { Link } from "@/i18n/navigation"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { AuthDecoration } from "@/components/auth/AuthDecoration"
import { clerkAppearance } from "@/components/auth/clerk-appearance"

export default function SignupPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    // Se o usuário estiver logado, redirecionar para dashboard
    if (!authLoading && user) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  // Mostrar loading enquanto verifica autenticação
  // Mesmo guard do login: sem a key do Clerk, falha explicita em vez de loading eterno.
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    return (
      <AuthDecoration title="Cadastro indisponível">
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-300">
            Autenticação não configurada neste ambiente (VITE_CLERK_PUBLISHABLE_KEY ausente no build).
          </p>
        </div>
      </AuthDecoration>
    )
  }

  if (authLoading) {
    return <LoadingScreen />
  }

  return (
    <AuthDecoration title="Crie sua conta">
      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/login"
        appearance={clerkAppearance}
        fallbackRedirectUrl="/dashboard"
      />

      {/* Switch to Login */}
      <p className="text-[13px] text-center text-slate-400 mt-6">
        Já tem conta?{" "}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
          Entrar
        </Link>
      </p>
    </AuthDecoration>
  )
}
