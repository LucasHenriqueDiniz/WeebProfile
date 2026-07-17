"use client"

import { motion } from "framer-motion"
import { LoadingAnimation } from "./LoadingAnimation"

export default function SimpleLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050814] relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-[#050814]/80" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-4"
      >
        <div className="w-32 h-32">
          <LoadingAnimation />
        </div>

        {/* Animated text */}
        <motion.div
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-cyan-400 font-mono text-sm tracking-wider"
        >
          Carregando...
        </motion.div>
      </motion.div>

      {/* Card skeletons */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-8 opacity-20">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.2, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 h-48"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
