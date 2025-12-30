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

  const getRedirectUrl = () => {
    // Use NEXT_PUBLIC_SITE_URL if available (for production), otherwise use window.location.origin
    // In Next.js, NEXT_PUBLIC_* vars are available at build time and embedded in the client bundle
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const finalUrl = siteUrl || origin
    
    // Debug log (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Redirect URL:', { siteUrl, origin, finalUrl })
    }
    
    return finalUrl
  }

  const signInWithGitHub = async () => {
    const redirectUrl = getRedirectUrl()
    const callbackUrl = `${redirectUrl}/auth/callback`
    
    // Debug log
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] GitHub login redirectTo:', callbackUrl)
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: callbackUrl,
        scopes: "read:user public_repo read:org user:follow",
      },
    })
    
    if (error && process.env.NODE_ENV === 'development') {
      console.error('[Auth] GitHub login error:', error)
    }
    
    return { error }
  }

  const signInWithGoogle = async () => {
    const redirectUrl = getRedirectUrl()
    const callbackUrl = `${redirectUrl}/auth/callback`
    
    // Debug log
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Google login redirectTo:', callbackUrl)
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    })
    
    if (error && process.env.NODE_ENV === 'development') {
      console.error('[Auth] Google login error:', error)
    }
    
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
    const redirectUrl = getRedirectUrl()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectUrl}/auth/callback`,
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


