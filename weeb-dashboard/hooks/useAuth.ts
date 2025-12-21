"use client"

import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState, useMemo, useRef } from "react"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (initializedRef.current) {
      return
    }

    let mounted = true
    let subscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null

    // Buscar usuário inicial apenas uma vez
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (mounted && !error) {
        setUser(user)
        setLoading(false)
        initializedRef.current = true
      } else if (mounted) {
        setLoading(false)
        initializedRef.current = true
      }
    })

    // Escutar mudanças de autenticação (mas não disparar loading desnecessário)
    const authStateChange = supabase.auth.onAuthStateChange((event, session) => {
      // Só atualizar se realmente mudou algo relevante e não resetar loading
      if (mounted && (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED")) {
        setUser(session?.user ?? null)
        // Não resetar loading aqui para evitar refresh visual
      }
    })

    subscription = authStateChange.data.subscription as any

    return () => {
      mounted = false
      if (subscription) {
        (subscription as any).unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]) // Executar apenas uma vez quando supabase é criado

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "read:user public_repo read:org user:follow",
      },
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signInWithGitHub,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }
}


