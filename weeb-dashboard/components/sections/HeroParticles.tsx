"use client"

import { motion } from "framer-motion"
import { memo, useState, useEffect } from "react"

interface Particle {
	id: number
	x: number
	y: number
	size: number
	duration: number
	delay: number
	xOffset: number
}

const generateParticles = (count: number): Particle[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 4 + 2,
		duration: Math.random() * 20 + 15,
		delay: Math.random() * 5,
		xOffset: Math.random() * 20 - 10,
	}))
}

export const HeroParticles = memo(function HeroParticles() {
	const [particles, setParticles] = useState<Particle[]>([])
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		setParticles(generateParticles(15))
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<div className="absolute inset-0 -z-[4] overflow-hidden pointer-events-none" aria-hidden="true">
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className="absolute rounded-full"
					style={{
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: `${particle.size}px`,
						height: `${particle.size}px`,
						background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.3) 50%, transparent 100%)",
						boxShadow: "0 0 12px rgba(139,92,246,0.2)",
					}}
					animate={{
						y: [0, -30, 0],
						x: [0, particle.xOffset, 0],
						opacity: [0.3, 0.6, 0.3],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: particle.duration,
						repeat: Infinity,
						delay: particle.delay,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	)
})



