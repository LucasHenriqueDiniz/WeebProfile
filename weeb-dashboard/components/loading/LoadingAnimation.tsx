"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

export function LoadingAnimation() {
  const reduceMotion = useReducedMotion()
  const frames = useMemo(
    () => Array.from({ length: 24 }, (_, i) => `/sora/loading/loading${String(i).padStart(2, "0")}.webp`),
    []
  )

  const [idx, setIdx] = useState(0)
  const loaded = useRef(false)

  useEffect(() => {
    // Preload (roda uma vez)
    if (loaded.current) return
    loaded.current = true

    for (const src of frames) {
      const img = new Image()
      img.decoding = "async"
      img.src = src
    }
  }, [frames])

  useEffect(() => {
    // prefers-reduced-motion: hold on a single frame instead of cycling
    if (reduceMotion) return

    // 8 fps = 125ms. 10 fps = 100ms
    const fps = 8
    const interval = Math.round(1000 / fps)

    const t = window.setInterval(() => {
      setIdx((v) => (v + 1) % frames.length)
    }, interval)

    return () => window.clearInterval(t)
  }, [frames.length, reduceMotion])

  // Sprite only - no background layer, no fixed sizing. Every real usage (LoadingScreen,
  // TemplatesPageClient) already provides its own page background; wrapping this in a second
  // background+blur box (previously sized via w-full/h-full with no width-constrained parent)
  // rendered as a visible floating rectangle instead of blending in.
  return (
    <motion.div
      className="relative inline-flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glowing background for the animation */}
      <div
        className={`absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150 ${reduceMotion ? "" : "animate-pulse"}`}
      />

      <motion.img
        src={frames[idx]}
        alt="Loading"
        width={256}
        height={256}
        draggable={false}
        className="pixelated relative z-10"
        style={{
          imageRendering: "pixelated",
          display: "block",
        }}
        animate={
          reduceMotion
            ? { filter: "drop-shadow(0 0 14px rgba(var(--primary), 0.4))" }
            : {
                filter: [
                  "drop-shadow(0 0 10px rgba(var(--primary), 0.3))",
                  "drop-shadow(0 0 20px rgba(var(--primary), 0.5))",
                  "drop-shadow(0 0 10px rgba(var(--primary), 0.3))",
                ],
              }
        }
        transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}
