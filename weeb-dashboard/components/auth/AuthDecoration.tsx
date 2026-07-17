"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import type { ReactNode } from "react"

// Textura de ruído sutil para dar profundidade ao cartão sem depender de imagem externa.
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

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
  {
    id: 2,
    src: "/sora/props/sparkle-blue.png",
    top: "-5%",
    right: "20%",
    width: 50,
    height: 50,
    delay: 0.7,
    duration: 4.5,
  },

  // Left side
  {
    id: 3,
    src: "/sora/props/musical_note.png",
    top: "20%",
    left: "-10%",
    width: 50,
    height: 50,
    delay: 0.3,
    duration: 5.5,
  },
  {
    id: 4,
    src: "/sora/props/musica_note_2.png",
    top: "65%",
    left: "-8%",
    width: 70,
    height: 70,
    delay: 0.8,
    duration: 6.5,
  },

  // Right side
  { id: 5, src: "/sora/props/love.png", top: "10%", right: "-8%", width: 50, height: 50, delay: 0, duration: 5 },
  { id: 6, src: "/sora/props/ovni.png", top: "28%", right: "6%", width: 92, height: 68, delay: 0.4, duration: 7 }, // Largo
  {
    id: 7,
    src: "/sora/props/lollipop.png",
    top: "50%",
    right: "1%",
    width: 50,
    height: 50,
    delay: 0.9,
    duration: 5.2,
  },
  { id: 8, src: "/sora/props/rocket.png", top: "70%", right: "6%", width: 80, height: 97, delay: 0.6, duration: 5.8 }, // Alto

  // Bottom area
  { id: 9, src: "/sora/props/bell.png", top: "85%", left: "15%", width: 50, height: 50, delay: 1.2, duration: 4.8 },
]

interface AuthDecorationProps {
  title: string
  children: ReactNode
}

// Fundo decorativo compartilhado entre /login e /signup (estrelas, sparkles, mascote Sora).
export function AuthDecoration({ title, children }: AuthDecorationProps) {
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
          <div className="w-full max-w-md rounded-[28px] bg-gradient-to-br from-purple-500/60 via-pink-500/40 to-cyan-400/60 p-px shadow-[0_25px_70px_-20px_rgba(0,0,0,0.85)]">
            <div className="rounded-[27px] bg-[#0a0f1e]/95 backdrop-blur-xl px-6 py-8 sm:px-8 sm:py-9 relative overflow-hidden">
              {/* Noise texture for depth */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: NOISE_BG }}
              />
              {/* Corner glow */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-7">
                  <div className="inline-flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase font-heading bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                      WeebProfile
                    </span>
                  </div>
                  <h1 className="text-[26px] sm:text-[28px] leading-tight font-heading font-extrabold text-white">
                    {title}
                  </h1>
                </div>

                {children}

                {/* Footer */}
                <p className="text-[11px] text-center text-slate-500 mt-6 leading-relaxed">
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
          </div>
        </motion.div>
      </div>
    </div>
  )
}
