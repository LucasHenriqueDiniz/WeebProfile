"use client"

import { motion } from "framer-motion"
import { memo } from "react"

interface HeroBackgroundPatternProps {
	accentColor?: string
}

export const HeroBackgroundPattern = memo(function HeroBackgroundPattern({
	accentColor = "#8957E5",
}: HeroBackgroundPatternProps) {
	return (
		<div 
			className="absolute inset-0 overflow-hidden pointer-events-none" 
			aria-hidden="true" 
			style={{ 
				zIndex: 0,
				background: "#020617",
			}}
		>
			{/* Radial gradients para profundidade e glow suave */}
			<div
				className="absolute inset-0"
				style={{
					background: `
						radial-gradient(ellipse 80% 50% at 50% 20%, rgba(139,92,246,0.15) 0%, transparent 50%),
						radial-gradient(ellipse 60% 40% at 80% 80%, rgba(236,72,153,0.12) 0%, transparent 50%),
						radial-gradient(ellipse 50% 30% at 20% 70%, rgba(6,182,212,0.10) 0%, transparent 50%)
					`,
					opacity: 1,
					zIndex: 1,
				}}
			/>

			{/* Grid único - Animado vertical E horizontal simultaneamente */}
			<div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
				<motion.div
					className="absolute"
					style={{
						backgroundImage: `
							linear-gradient(rgba(100,80,255,0.05) 1px, transparent 1px),
							linear-gradient(90deg, rgba(100,80,255,0.025) 1px, transparent 1px)
						`,
						backgroundSize: "40px 40px",
						width: "calc(100% + 80px)",
						height: "calc(100% + 80px)",
						top: "-40px",
						left: "-40px",
						opacity: 1,
					}}
					initial={{ x: 0, y: 0 }}
					animate={{
						x: [200, -200],
						y: [70, -70],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "linear",
						repeatType: "loop",
					}}
				/>
			</div>

			{/* Fade radial sobre o grid - escurece ao redor do texto central (mais sutil) */}
			<div
				className="absolute inset-0"
				style={{
					background: `
						radial-gradient(ellipse 100% 80% at 50% 40%, transparent 0%, rgba(2,6,23,0.3) 50%, rgba(2,6,23,0.5) 80%, rgba(2,6,23,0.7) 100%)
					`,
					opacity: 0.8,
					zIndex: 4,
					pointerEvents: "none",
				}}
			/>

			{/* Glow suave atrás do texto principal (10-15%) */}
			<div
				className="absolute inset-0"
				style={{
					background: `
						radial-gradient(ellipse 60% 40% at 30% 35%, rgba(139,92,246,0.12) 0%, transparent 50%)
					`,
					opacity: 1,
					filter: "blur(60px)",
				}}
			/>

			{/* Glow points MUITO sutis nas intersecções (apenas alguns pontos) */}
			<div className="absolute inset-0" style={{ backgroundSize: "40px 40px" }}>
				{[...Array(12)].map((_, i) => {
					const cols = 4
					const x = (i % cols) * 40 + 20
					const y = Math.floor(i / cols) * 40 + 20
					// Apenas pontos nas bordas/cantos, não no centro
					if (x > 200 && x < 400 && y > 200 && y < 500) return null
					return (
						<motion.div
							key={`glow-${i}`}
							className="absolute w-0.5 h-0.5 rounded-full"
							style={{
								left: `${x}px`,
								top: `${y}px`,
								background: `radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)`,
								boxShadow: `0 0 4px rgba(139,92,246,0.2)`,
							}}
							animate={{
								opacity: [0.1, 0.3, 0.1],
								scale: [1, 1.2, 1],
							}}
							transition={{
								duration: 4 + Math.random() * 3,
								repeat: Infinity,
								delay: Math.random() * 3,
								ease: "easeInOut",
							}}
							aria-hidden="true"
						/>
					)
				})}
			</div>
		</div>
	)
})
