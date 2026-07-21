"use client"

import { useUser, useClerk } from "@clerk/react"

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

  const mockFlag = getMockFlag()
  if (mockFlag) {
    return {
      user: MOCK_USER,
      loading: false,
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
    loading: !isLoaded,
    signOut: () => signOut(),
  }
}
