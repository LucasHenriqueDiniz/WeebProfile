"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import type { ReactNode } from "react"

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

// Props around Sora character - organized distribution with proper sizes
const soraProps = [
  { id: 1, src: "/sora/props/star.png", top: "-6%", left: "22%", width: 46, height: 46, delay: 0.5, duration: 6 },
  {
    id: 2,
    src: "/sora/props/sparkle-blue.png",
    top: "-3%",
    right: "18%",
    width: 46,
    height: 46,
    delay: 0.7,
    duration: 4.5,
  },
  {
    id: 3,
    src: "/sora/props/musical_note.png",
    top: "22%",
    left: "-8%",
    width: 46,
    height: 46,
    delay: 0.3,
    duration: 5.5,
  },
  {
    id: 4,
    src: "/sora/props/musica_note_2.png",
    top: "62%",
    left: "-6%",
    width: 62,
    height: 62,
    delay: 0.8,
    duration: 6.5,
  },
  { id: 5, src: "/sora/props/love.png", top: "10%", right: "-6%", width: 46, height: 46, delay: 0, duration: 5 },
  { id: 6, src: "/sora/props/ovni.png", top: "28%", right: "4%", width: 84, height: 62, delay: 0.4, duration: 7 },
  { id: 7, src: "/sora/props/lollipop.png", top: "48%", right: "0%", width: 46, height: 46, delay: 0.9, duration: 5.2 },
  { id: 8, src: "/sora/props/rocket.png", top: "66%", right: "4%", width: 72, height: 88, delay: 0.6, duration: 5.8 },
  { id: 9, src: "/sora/props/bell.png", top: "82%", left: "14%", width: 46, height: 46, delay: 1.2, duration: 4.8 },
]

// Chips de features exibidos sob a Sora — dão contexto de produto na tela de auth.
const featureChips = [
  { id: 1, label: "GitHub Stats" },
  { id: 2, label: "Anime & Mangá" },
  { id: 3, label: "Música" },
  { id: 4, label: "Games" },
]

interface AuthDecorationProps {
  title: string
  subtitle?: string
  children: ReactNode
}

// Fundo decorativo compartilhado entre /login e /signup (estrelas, sparkles, mascote Sora).
export function AuthDecoration({ title, subtitle, children }: AuthDecorationProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 lg:py-8 bg-background relative overflow-hidden">
      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur-xl text-muted-foreground hover:text-cyan-300 hover:border-cyan-400/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium">Voltar</span>
        </Link>
      </motion.div>

      {/* Layer 1: Aurora blobs - profundidade animada atrás de tudo */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"
        animate={reducedMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full bg-purple-500/15 blur-3xl pointer-events-none"
        animate={reducedMotion ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-pink-500/10 blur-3xl pointer-events-none"
        animate={reducedMotion ? undefined : { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 pointer-events-none" />

      {/* Subtle stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-foreground pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={
            reducedMotion ? undefined : { y: [0, -4, 0], opacity: [star.opacity, star.opacity * 1.5, star.opacity] }
          }
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
          animate={
            reducedMotion ? { opacity: 0.4 } : { opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 180, 360] }
          }
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

      {/* Layer 3: Foreground - Sora + Auth Card. max-w keeps illustration and form close
          together as one composition instead of each claiming half the viewport. */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        {/* Sora Illustration Panel - Desktop Only */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col items-center justify-center w-[340px] flex-shrink-0 relative"
        >
          {/* Halo atrás da Sora — ancora a ilustração em vez de deixá-la flutuando no vazio */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.18),_rgba(168,85,247,0.12)_55%,_transparent_75%)] blur-xl pointer-events-none"
          />

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
              animate={reducedMotion ? undefined : { y: [-8, 8, -8], rotate: [0, 5, -5, 0] }}
              transition={{
                duration: prop.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: prop.delay,
              }}
            />
          ))}

          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <img
              src="/sora/login/sora_login.png"
              alt="Sora"
              className="w-[280px] h-auto max-h-[520px] object-contain drop-shadow-[0_0_40px_rgba(56,189,248,0.3)] drop-shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            />
          </motion.div>

          {/* Feature chips — contexto do produto direto na tela de auth */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2 max-w-[280px]"
          >
            {featureChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur-sm text-[11px] font-medium text-muted-foreground"
              >
                <Sparkles className="w-3 h-3 text-cyan-400/70" />
                {chip.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Auth panel - glass card com hairline gradiente. Dá superfície própria ao form
            sem parecer modal; OAuth buttons e inputs mantêm suas superfícies via
            clerk-appearance.ts. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full lg:w-[440px] flex-shrink-0"
        >
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-cyan-500/40 via-purple-500/25 to-transparent shadow-[0_0_60px_-15px_rgba(56,189,248,0.25)]">
            <div className="rounded-3xl bg-card/80 backdrop-blur-2xl px-6 py-8 sm:px-8">
              {/* Header */}
              <div className="text-center mb-7">
                <motion.img
                  src="/sora/sora-head.png"
                  alt=""
                  className="w-12 h-12 object-contain mx-auto mb-4 drop-shadow-[0_0_16px_rgba(56,189,248,0.45)]"
                  animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="block text-[11px] font-bold tracking-[0.3em] uppercase font-heading bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  WeebProfile
                </span>
                <h1 className="text-[26px] sm:text-[28px] leading-tight font-heading font-extrabold text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-[320px] mx-auto">{subtitle}</p>
                )}
              </div>

              {children}

              {/* Footer */}
              <p className="text-[11px] text-center text-muted-foreground mt-7 leading-relaxed">
                Ao continuar, você concorda com nossos{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 decoration-cyan-400/40 transition-colors"
                >
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
