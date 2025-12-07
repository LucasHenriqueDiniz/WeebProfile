"use client"

import { motion } from "framer-motion"
import { memo } from "react"

export const HeroGlassPanels = memo(function HeroGlassPanels() {
	return (
		<div className="absolute inset-0 -z-[3] overflow-hidden pointer-events-none" aria-hidden="true">
			{/* Glass panel 1 - Top left */}
			<motion.div
				className="absolute rounded-2xl backdrop-blur-xl border border-white/5"
				style={{
					width: "280px",
					height: "180px",
					top: "10%",
					left: "5%",
					background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.05) 100%)",
					boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
				}}
				animate={{
					y: [0, -15, 0],
					opacity: [0.4, 0.6, 0.4],
					rotate: [0, 1, 0],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Glass panel 2 - Bottom right */}
			<motion.div
				className="absolute rounded-2xl backdrop-blur-xl border border-white/5"
				style={{
					width: "240px",
					height: "160px",
					bottom: "15%",
					right: "8%",
					background: "linear-gradient(225deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.05) 100%)",
					boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
				}}
				animate={{
					y: [0, 15, 0],
					opacity: [0.4, 0.6, 0.4],
					rotate: [0, -1, 0],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					delay: 1,
					ease: "easeInOut",
				}}
			/>

			{/* Glass panel 3 - Center (smaller) */}
			<motion.div
				className="absolute rounded-xl backdrop-blur-xl border border-white/5"
				style={{
					width: "160px",
					height: "120px",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					background: "linear-gradient(45deg, rgba(236,72,153,0.06) 0%, rgba(139,92,246,0.04) 100%)",
					boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
				}}
				animate={{
					scale: [1, 1.05, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					delay: 2,
					ease: "easeInOut",
				}}
			/>
		</div>
	)
})



