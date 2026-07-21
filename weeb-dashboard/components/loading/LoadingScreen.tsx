"use client"

import { motion, useReducedMotion } from "framer-motion"
import { LoadingAnimation } from "./LoadingAnimation"

// Loading text is hardcoded (not i18n) because this component can render as the router's
// Suspense fallback, before i18next's HTTP backend has finished fetching translations.
const LOADING_TEXT = "Carregando"

// Same deterministic star field language as AuthDecoration, trimmed to a lighter set since
// this screen mounts/unmounts on every route transition and shouldn't carry that much motion.
const stars = [
  { id: 1, top: "12%", left: "18%", size: 2, opacity: 0.2 },
  { id: 2, top: "22%", left: "82%", size: 1.5, opacity: 0.18 },
  { id: 3, top: "8%", left: "50%", size: 2.5, opacity: 0.22 },
  { id: 4, top: "68%", left: "10%", size: 2, opacity: 0.2 },
  { id: 5, top: "78%", left: "70%", size: 1.5, opacity: 0.16 },
  { id: 6, top: "40%", left: "6%", size: 2, opacity: 0.18 },
  { id: 7, top: "88%", left: "35%", size: 2.5, opacity: 0.2 },
  { id: 8, top: "15%", left: "90%", size: 1.5, opacity: 0.15 },
]

// This screen disappears the instant auth/data are ready - no artificial minimum display
// time. See login.tsx / signup.tsx / dashboard.tsx: they stop rendering this the moment
// their own loading flag flips; no setTimeout gates it.
export default function LoadingScreen() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[#0a0f1e] relative overflow-hidden px-4">
      {/* Same base gradient language as the login/signup background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,_rgba(6,182,212,0.15),_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,_rgba(168,85,247,0.12),_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.08),_transparent_70%)] pointer-events-none" />

      {!reduceMotion &&
        stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size, opacity: star.opacity }}
            animate={{ y: [0, -4, 0], opacity: [star.opacity, star.opacity * 1.5, star.opacity] }}
            transition={{ duration: 8 + star.id * 0.3, repeat: Infinity, ease: "easeInOut", delay: star.id * 0.2 }}
          />
        ))}

      {/* Kicker - same treatment as the login header, ties this screen to the rest of the flow */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 inline-flex items-center gap-1.5 mb-2"
      >
        <img src="/sora/sora-head.png" alt="" className="w-4 h-4 object-contain" />
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase font-heading bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          WeebProfile
        </span>
      </motion.div>

      {/* Sora sprite with a small composition around it instead of floating alone in empty space */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mb-2"
      >
        {!reduceMotion && (
          <motion.div
            className="absolute inset-0 -m-6 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(6,182,212,0.12) 45%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="relative" style={{ filter: "drop-shadow(0 0 20px rgba(6,182,212,0.25))" }}>
          <LoadingAnimation />
        </div>
      </motion.div>

      {/* Loading text + branded indicator (three dots, not a generic spinner) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative z-10 flex items-center gap-2.5"
      >
        <span className="font-heading text-sm font-medium tracking-wide text-slate-300">{LOADING_TEXT}</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.25, 1, 0.25] }}
              transition={
                reduceMotion ? undefined : { duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
              }
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
