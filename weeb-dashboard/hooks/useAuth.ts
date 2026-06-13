"use client"

import { useUser, useClerk, useSignIn, useSignUp } from "@clerk/react"

export function useAuth() {
  const { user, isLoaded } = useUser()
  const { signOut, openSignIn } = useClerk()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()

  const signInWithGitHub = async (): Promise<{ error: { message: string } | null }> => {
    openSignIn()
    return { error: null }
  }

  const signInWithGoogle = async (): Promise<{ error: { message: string } | null }> => {
    openSignIn()
    return { error: null }
  }

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: { message: string } | null }> => {
    if (!signIn) return { error: { message: "Auth not ready" } }
    try {
      await signIn.create({ identifier: email, password })
      return { error: null }
    } catch (err: any) {
      return { error: { message: err?.errors?.[0]?.message ?? "Sign in failed" } }
    }
  }

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: { message: string } | null }> => {
    if (!signUp) return { error: { message: "Auth not ready" } }
    try {
      await signUp.create({ emailAddress: email, password })
      return { error: null }
    } catch (err: any) {
      return { error: { message: err?.errors?.[0]?.message ?? "Sign up failed" } }
    }
  }

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
    signInWithGitHub,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut: () => signOut(),
  }
}
