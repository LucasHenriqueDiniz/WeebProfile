"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface ErrorScreenProps {
  title?: string
  message?: string
  showHomeButton?: boolean
}

export default function ErrorScreen({ 
  title = "ERRO",
  message = "Algo deu errado",
  showHomeButton = true 
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050814] relative overflow-hidden">
      {/* Pixel grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
      
      {/* Scanlines effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
        }}
      />

      {/* Animated error image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-8"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.5)) drop-shadow(0 0 40px rgba(239,68,68,0.3))',
        }}
      >
        <Image
          src="/sora/error/error.webp"
          alt="Error"
          width={256}
          height={256}
          className="pixelated"
          style={{
            imageRendering: "pixelated",
            display: "block",
          }}
          draggable={false}
        />
      </motion.div>

      {/* Error text with pixel style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center px-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-red-400 font-mono text-sm tracking-wider"
          >
            {title}
          </motion.div>
        </div>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          {message}
        </p>
        
        {/* Pixel border decoration */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-0.5 bg-red-400" />
          <div className="w-2 h-2 bg-red-400" />
          <div className="w-8 h-0.5 bg-red-400" />
        </div>

        {showHomeButton && (
          <motion.a
            href="/"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-mono text-sm tracking-wider transition-colors"
          >
            VOLTAR AO INÍCIO
          </motion.a>
        )}
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-400/60 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}














