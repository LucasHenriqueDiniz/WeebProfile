"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
	variant?: "default" | "gradient" | "dots"
}

export function SectionDivider({ variant = "default" }: SectionDividerProps) {
	if (variant === "gradient") {
		return (
			<div className="relative h-px w-full overflow-hidden">
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
					initial={{ x: "-100%" }}
					whileInView={{ x: "100%" }}
					viewport={{ once: true }}
					transition={{ duration: 1.5, ease: "easeInOut" }}
				/>
			</div>
		)
	}

	if (variant === "dots") {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="flex gap-2">
					{[...Array(3)].map((_, i) => (
						<motion.div
							key={i}
							className="w-2 h-2 rounded-full bg-muted-foreground/30"
							initial={{ scale: 0, opacity: 0 }}
							whileInView={{ scale: 1, opacity: 1 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.3 }}
						/>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="relative h-px w-full">
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
		</div>
	)
}


































