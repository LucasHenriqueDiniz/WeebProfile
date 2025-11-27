"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogOut, Github } from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { user, signInWithGitHub, signOut } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    const errorDescription = params.get("error_description")

    if (error) {
      setErrorMessage(errorDescription || `Erro: ${error}`)
      window.history.replaceState({}, "", "/login")
    }
  }, [])

  const handleGitHubLogin = async () => {
    try {
      setLoading(true)
      const { error } = await signInWithGitHub()
      if (error) {
        console.error("Error signing in:", error)
        setErrorMessage(`Erro ao fazer login: ${error.message}`)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrorMessage("Erro inesperado ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      const { error } = await signOut()
      if (error) {
        console.error("Error signing out:", error)
        setErrorMessage(`Erro ao fazer logout: ${error.message}`)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrorMessage("Erro inesperado ao fazer logout")
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">✅ Você está logado!</CardTitle>
              <CardDescription className="text-center">
                Bem-vindo ao WeebProfile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="font-medium break-all">{user.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">GitHub Username</p>
                  <p className="font-medium">
                    {user.user_metadata?.user_name ||
                      user.user_metadata?.preferred_username ||
                      user.user_metadata?.login ||
                      "N/A"}
                  </p>
                </div>
                {user.user_metadata?.avatar_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Avatar</p>
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full border-2 border-border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleLogout}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 mr-2" />
                  )}
                  Sair
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  Ir para Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">WeebProfile</CardTitle>
            <CardDescription>
              Faça login com GitHub para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            <Button
              onClick={handleGitHubLogin}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Github className="w-5 h-5 mr-2" />
                  Entrar com GitHub
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Ao continuar, você concorda com nossos termos de serviço
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
