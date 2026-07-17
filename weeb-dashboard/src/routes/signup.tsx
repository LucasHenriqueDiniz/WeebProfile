import { useState, useEffect } from "react"
import { useRouter } from "@/src/compat/next-navigation"
import { useAuth } from "@/hooks/useAuth"
import { SignUp } from "@clerk/react"
import { Link } from "@/i18n/navigation"
import SimpleLoading from "@/components/loading/SimpleLoading"
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
  if (authLoading) {
    return <SimpleLoading />
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
      <p className="text-xs text-center text-slate-500 mt-4">
        Já tem conta?{" "}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          Entrar
        </Link>
      </p>
    </AuthDecoration>
  )
}
