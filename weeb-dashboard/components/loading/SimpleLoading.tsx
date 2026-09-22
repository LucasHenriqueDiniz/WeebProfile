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
      </motion.div>
    </div>
  )
}
