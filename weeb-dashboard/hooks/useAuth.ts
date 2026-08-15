"use client"

import { useEffect, useState } from "react"
import { useUser, useClerk } from "@clerk/react"

/**
 * Quanto esperar o Clerk carregar antes de desistir.
 *
 * `isLoaded` nunca vira true se o clerk.browser.js não baixar, e o ClerkProvider
 * envolve o RouterProvider inteiro (src/main.tsx) -- então a landing pública, que
 * não precisa de sessão nenhuma, ficava num spinner eterno. Aconteceu em produção
 * em 15/08/2026: bastou o navegador não alcançar o domínio do Clerk (bloqueador,
 * extensão de privacidade, rede corporativa -- domínio de auth de terceiro é alvo
 * comum de lista de bloqueio) para o site inteiro sumir para um visitante novo.
 *
 * 8s é folgado para uma conexão ruim e curto o bastante para não parecer travado.
 */
const AUTH_LOAD_TIMEOUT_MS = 8000

function useLoadTimeout(isLoaded: boolean): boolean {
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (isLoaded) return
    const id = setTimeout(() => setTimedOut(true), AUTH_LOAD_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [isLoaded])

  return timedOut && !isLoaded
}

// DEV-ONLY preview bypass: ?mock=empty or ?mock=full lets us inspect authenticated
// screens without a real session. import.meta.env.DEV is statically replaced by Vite,
// so this whole branch (and the mock data below) is dead-code-eliminated from the
// production bundle - it cannot run outside `pnpm dev`.
// TEMP: remove once the redesign is approved.
function getMockFlag(): string | null {
  if (!import.meta.env.DEV) return null
  if (typeof window === "undefined") return null
  return new URLSearchParams(window.location.search).get("mock")
}

interface AuthUser {
  id: string
  email: string
  user_metadata: {
    user_name: string | null
    preferred_username: string | null
    login: string | null
    full_name: string | null
    avatar_url: string | null
    picture: string | null
    name: string | null
  }
}

const MOCK_USER: AuthUser = {
  id: "dev-mock-user",
  email: "sora@weebprofile.dev",
  user_metadata: {
    user_name: "sora-dev",
    preferred_username: "sora-dev",
    login: "sora-dev",
    full_name: "Sora Dev",
    avatar_url: null,
    picture: null,
    name: "Sora Dev",
  },
}

export function useAuth() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  // Antes de qualquer early return: hook não pode ficar atrás de condicional.
  const authUnavailable = useLoadTimeout(isLoaded)

  const mockFlag = getMockFlag()
  if (mockFlag) {
    return {
      user: MOCK_USER,
      loading: false,
      authUnavailable: false,
      signOut: () => signOut(),
    }
  }

  const mappedUser: AuthUser | null = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        user_metadata: {
          user_name:
            user.username ??
            user.externalAccounts.find((a: { provider: string }) => a.provider.includes("github"))?.username ??
            null,
          preferred_username: user.username ?? null,
          login: user.username ?? null,
          full_name: user.fullName ?? null,
          avatar_url: user.imageUrl ?? null,
          picture: user.imageUrl ?? null,
          name: user.fullName ?? null,
        },
      }
    : null

  return {
    user: mappedUser,
    // Deixa de carregar ao estourar o timeout, mesmo sem o Clerk ter respondido.
    // Rota pública renderiza; rota protegida vê user null e manda para o login,
    // que usa authUnavailable para dizer o que houve em vez de girar de novo.
    loading: !isLoaded && !authUnavailable,
    authUnavailable,
    signOut: () => signOut(),
  }
}
