"use client"

import { useUser, useClerk } from "@clerk/react"

export function useAuth() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  return {
    user: user
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
      : null,
    loading: !isLoaded,
    signOut: () => signOut(),
  }
}
