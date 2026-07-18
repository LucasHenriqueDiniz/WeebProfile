"use client"

import { motion } from "framer-motion"
import { LoadingAnimation } from "./LoadingAnimation"

// Loading text is hardcoded (not i18n) because this component can render as the router's
// Suspense fallback, before i18next's HTTP backend has finished fetching translations.
const LOADING_TEXT = "Carregando..."

// Component that renders the actual loading UI
export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050814] relative overflow-hidden">
      {/* Single atmospheric glow - brand gradient, not a stacked grid/scanline effect */}
      <motion.div
        className="absolute w-[36rem] h-[36rem] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(6,182,212,0.1) 45%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sora sprite */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mb-6"
        style={{
          filter: "drop-shadow(0 0 24px rgba(139,92,246,0.35)) drop-shadow(0 0 14px rgba(6,182,212,0.3))",
        }}
      >
        <LoadingAnimation />
      </motion.div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex items-center gap-2.5"
      >
        <span className="font-heading text-sm font-medium tracking-wide text-slate-300">{LOADING_TEXT}</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Floating particles - a few, not a swarm */}
      {[
        { left: "18%", top: "22%", duration: 3.2, delay: 0 },
        { left: "82%", top: "28%", duration: 3.8, delay: 0.4 },
        { left: "25%", top: "72%", duration: 3.4, delay: 0.8 },
        { left: "78%", top: "68%", duration: 4, delay: 0.2 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/50 rounded-full pointer-events-none"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  )
}
