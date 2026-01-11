"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"

export function LoadingAnimation() {
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
    // 8 fps = 125ms. 10 fps = 100ms
    const fps = 8
    const interval = Math.round(1000 / fps)

    const t = window.setInterval(() => {
      setIdx((v) => (v + 1) % frames.length)
    }, interval)

    return () => window.clearInterval(t)
  }, [frames.length])

  return (
    <div className="relative w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/60 backdrop-blur-xl" />

      {/* Central loading animation */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glowing background for the animation */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150 animate-pulse" />

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
          animate={{
            filter: [
              "drop-shadow(0 0 10px rgba(var(--primary), 0.3))",
              "drop-shadow(0 0 20px rgba(var(--primary), 0.5))",
              "drop-shadow(0 0 10px rgba(var(--primary), 0.3))"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Loading text with animation */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h3
            className="text-lg font-medium text-muted-foreground"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Carregando magia...
          </motion.h3>
          <motion.div
            className="flex justify-center gap-1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}




































