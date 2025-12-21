"use client"

import { motion } from "framer-motion"
import { LoadingAnimation } from "./LoadingAnimation"

export default function SimpleLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050814]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-32 h-32">
          <LoadingAnimation />
        </div>
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
    </div>
  )
}

