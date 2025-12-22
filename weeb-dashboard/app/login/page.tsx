"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import SimpleLoading from "@/components/loading/SimpleLoading"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [activeTab, setActiveTab] = useState<"login" | "cadastro">("login")
  const router = useRouter()
  const { user, loading: authLoading, signInWithGitHub, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()

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

  const handleGitHubLogin = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)
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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)
      const { error } = await signInWithGoogle()
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos")
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const { error } = await signInWithEmail(email, password)
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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos")
      return
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres")
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const { error } = await signUpWithEmail(email, password)
      if (error) {
        console.error("Error signing up:", error)
        setErrorMessage(`Erro ao criar conta: ${error.message}`)
      } else {
        // Após signup bem-sucedido, o usuário já está autenticado
        // O perfil será criado automaticamente quando necessário
        // Redirecionamento será feito pelo useEffect que monitora user
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrorMessage("Erro inesperado ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: "login" | "cadastro") => {
    setActiveTab(tab)
    setEmail("")
    setPassword("")
    setName("")
    setErrorMessage(null)
  }

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return <SimpleLoading />
  }

  // Deterministic stars configuration
  const stars = [
    { id: 1, top: "10%", left: "15%", size: 2, opacity: 0.2 },
    { id: 2, top: "25%", left: "8%", size: 1.5, opacity: 0.15 },
    { id: 3, top: "5%", left: "35%", size: 2.5, opacity: 0.25 },
    { id: 4, top: "18%", left: "45%", size: 1.5, opacity: 0.2 },
    { id: 5, top: "12%", left: "65%", size: 2, opacity: 0.18 },
    { id: 6, top: "30%", left: "75%", size: 1.5, opacity: 0.2 },
    { id: 7, top: "8%", left: "85%", size: 2, opacity: 0.15 },
    { id: 8, top: "40%", left: "12%", size: 2.5, opacity: 0.22 },
    { id: 9, top: "50%", left: "25%", size: 1.5, opacity: 0.18 },
    { id: 10, top: "45%", left: "55%", size: 2, opacity: 0.2 },
    { id: 11, top: "60%", left: "70%", size: 1.5, opacity: 0.15 },
    { id: 12, top: "55%", left: "90%", size: 2, opacity: 0.2 },
    { id: 13, top: "70%", left: "20%", size: 2.5, opacity: 0.22 },
    { id: 14, top: "75%", left: "40%", size: 1.5, opacity: 0.18 },
    { id: 15, top: "80%", left: "60%", size: 2, opacity: 0.2 },
    { id: 16, top: "65%", left: "5%", size: 1.5, opacity: 0.15 },
    { id: 17, top: "85%", left: "30%", size: 2, opacity: 0.2 },
    { id: 18, top: "90%", left: "50%", size: 1.5, opacity: 0.18 },
    { id: 19, top: "88%", left: "80%", size: 2.5, opacity: 0.22 },
    { id: 20, top: "35%", left: "92%", size: 2, opacity: 0.15 },
  ]

  // Sparkles configuration (CSS-based)
  const sparkles = [
    { id: 1, top: "12%", left: "18%", size: 4, delay: 0 },
    { id: 2, top: "25%", left: "35%", size: 3, delay: 0.5 },
    { id: 3, top: "8%", left: "55%", size: 5, delay: 1 },
    { id: 4, top: "40%", left: "12%", size: 3, delay: 1.5 },
    { id: 5, top: "60%", left: "28%", size: 4, delay: 2 },
    { id: 6, top: "75%", left: "45%", size: 3, delay: 0.8 },
    { id: 7, top: "20%", left: "72%", size: 4, delay: 1.2 },
    { id: 8, top: "50%", left: "65%", size: 5, delay: 0.3 },
    { id: 9, top: "85%", left: "22%", size: 3, delay: 1.8 },
    { id: 10, top: "35%", left: "85%", size: 4, delay: 0.6 },
    { id: 11, top: "65%", left: "78%", size: 3, delay: 1.4 },
    { id: 12, top: "15%", left: "92%", size: 4, delay: 0.9 },
  ]

  // Dots configuration (CSS-based)
  const dots = [
    { id: 1, top: "10%", left: "25%", size: 2 },
    { id: 2, top: "30%", left: "15%", size: 1.5 },
    { id: 3, top: "5%", left: "60%", size: 2.5 },
    { id: 4, top: "45%", left: "8%", size: 2 },
    { id: 5, top: "70%", left: "20%", size: 1.5 },
    { id: 6, top: "55%", left: "50%", size: 2 },
    { id: 7, top: "25%", left: "80%", size: 1.5 },
    { id: 8, top: "80%", left: "65%", size: 2 },
    { id: 9, top: "40%", left: "90%", size: 2.5 },
    { id: 10, top: "90%", left: "35%", size: 1.5 },
  ]

  // Props around Sora character - organized distribution with proper sizes
  const soraProps = [
    // Top area
    { id: 1, src: "/sora/props/star.png", top: "-8%", left: "25%", width: 50, height: 50, delay: 0.5, duration: 6 },
    { id: 2, src: "/sora/props/sparkle-blue.png", top: "-5%", right: "20%", width: 50, height: 50, delay: 0.7, duration: 4.5 },
    
    // Left side
    { id: 3, src: "/sora/props/musical_note.png", top: "20%", left: "-10%", width: 50, height: 50, delay: 0.3, duration: 5.5 },
    { id: 4, src: "/sora/props/musica_note_2.png", top: "65%", left: "-8%", width: 70, height: 70, delay: 0.8, duration: 6.5 },
    
    // Right side
    { id: 5, src: "/sora/props/love.png", top: "10%", right: "-8%", width: 50, height: 50, delay: 0, duration: 5 },
    { id: 6, src: "/sora/props/ovni.png", top: "28%", right: "6%", width: 92, height: 68, delay: 0.4, duration: 7 }, // Largo
    { id: 7, src: "/sora/props/lollipop.png", top: "50%", right: "1%", width: 50, height: 50, delay: 0.9, duration: 5.2 },
    { id: 8, src: "/sora/props/rocket.png", top: "70%", right: "6%", width: 80, height: 97, delay: 0.6, duration: 5.8 }, // Alto
    
    // Bottom area
    { id: 9, src: "/sora/props/bell.png", top: "85%", left: "15%", width: 50, height: 50, delay: 1.2, duration: 4.8 },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050814] relative overflow-hidden">
      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-all hover:bg-slate-800/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar</span>
        </Link>
      </motion.div>
      {/* Layer 1: Base gradients - Galaxy vibe */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,_rgba(6,182,212,0.15),_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,_rgba(168,85,247,0.12),_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.08),_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050814]/40 pointer-events-none" />
      
      {/* Subtle stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            y: [0, -4, 0],
            opacity: [star.opacity, star.opacity * 1.5, star.opacity],
          }}
          transition={{
            duration: 8 + star.id * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.id * 0.2,
          }}
        />
      ))}

      {/* Sparkles (CSS-based) */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: `${sparkle.size * 8}px`,
            height: `${sparkle.size * 8}px`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full text-cyan-400/60">
            <path
              fill="currentColor"
              d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z"
              style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Dots (CSS-based) */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-cyan-300/40 pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            boxShadow: "0 0 6px rgba(56,189,248,0.6)",
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4 + dot.id * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.id * 0.3,
          }}
        />
      ))}

      {/* Layer 3: Foreground - Sora + Auth Card */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Sora Illustration Panel - Desktop Only */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col items-center justify-center w-full lg:w-1/2 relative"
        >
          {/* Props around Sora */}
          {soraProps.map((prop) => (
            <motion.img
              key={prop.id}
              src={prop.src}
              alt=""
              className="absolute pointer-events-none"
              style={{
                top: prop.top,
                left: prop.left,
                right: prop.right,
                width: `${prop.width}px`,
                height: `${prop.height}px`,
                filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35)) drop-shadow(0 0 6px rgba(255,255,255,0.2))",
              }}
              animate={{
                y: [-8, 8, -8],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: prop.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: prop.delay,
              }}
            />
          ))}
          
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <img
              src="/sora/login/sora_login.png"
              alt="Sora"
              className="w-[400px] h-auto max-h-[650px] object-contain drop-shadow-[0_0_40px_rgba(56,189,248,0.3)] drop-shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            />
          </motion.div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full lg:w-1/2 flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-cyan-500/10 px-5 py-5 relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 mb-1">
                  {activeTab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
                </h1>
              </div>

            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Login Screen */}
                  {errorMessage && (
                    <div className="mb-3 px-2.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10">
                      <p className="text-xs text-red-300">{errorMessage}</p>
                    </div>
                  )}

                  {/* Social Auth */}
                  <div className="space-y-2 mb-2.5">
                    <button
                      type="button"
                      onClick={handleGitHubLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-100 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed py-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span>Continuar com GitHub</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-100 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed py-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Continuar com Google</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-2.5">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span className="px-3 py-0.5 text-[11px] text-slate-500 bg-slate-950 rounded-full border border-slate-800">
                      ou
                    </span>
                    <div className="flex-1 h-px bg-slate-800" />
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleEmailLogin} className="space-y-3">
                    <div className="space-y-1.5">
                      <label htmlFor="login-email" className="block text-xs font-medium text-slate-300">
                        Email
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        disabled={loading}
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="login-password" className="block text-xs font-medium text-slate-300">
                        Senha
                      </label>
                      <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition disabled:opacity-50"
                      />
                    </div>

                    <div className="flex items-center justify-end text-xs">
    
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Esqueceu sua senha?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Entrando...
                        </span>
                      ) : (
                        "Entrar"
                      )}
                    </button>
                  </form>

                  {/* Switch to Signup */}
                  <p className="text-xs text-center text-slate-500 mt-4">
                    Não tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("cadastro")}
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      Criar conta
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="cadastro"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Signup Screen */}
                  {errorMessage && (
                    <div className="mb-3 px-2.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10">
                      <p className="text-xs text-red-300">{errorMessage}</p>
                    </div>
                  )}

                  {/* Social Auth */}
                  <div className="space-y-2.5 mb-4">
                    <p className="text-xs text-slate-400 text-center">Entre mais rápido com login social</p>
                    
                    <button
                      type="button"
                      onClick={handleGitHubLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-100 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed py-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span>Criar conta com GitHub</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-100 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed py-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Criar conta com Google</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-2.5">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span className="px-3 py-0.5 text-[11px] text-slate-500 bg-slate-950 rounded-full border border-slate-800">
                      ou
                    </span>
                    <div className="flex-1 h-px bg-slate-800" />
                  </div>

                  {/* Signup Form */}
                  <form onSubmit={handleEmailSignup} className="space-y-3">
                    <div className="space-y-1.5">
                      <label htmlFor="signup-name" className="block text-xs font-medium text-slate-300">
                        Nome
                      </label>
                      <input
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="signup-email" className="block text-xs font-medium text-slate-300">
                        Email
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        disabled={loading}
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="signup-password" className="block text-xs font-medium text-slate-300">
                        Senha
                      </label>
                      <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Criando conta...
                        </span>
                      ) : (
                        "Criar conta"
                      )}
                    </button>
                  </form>

                  {/* Switch to Login */}
                  <p className="text-xs text-center text-slate-500 mt-4">
                    Já tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("login")}
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      Entrar
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <p className="text-[10px] text-center text-slate-400 mt-3">
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                termos de serviço
              </a>
              .
            </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
