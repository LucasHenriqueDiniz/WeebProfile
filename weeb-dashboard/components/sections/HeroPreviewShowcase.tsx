"use client"

import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Sparkles } from "lucide-react"
import { memo } from "react"

interface HeroPreviewShowcaseProps {
	isBuilding: boolean
	selectedSources: string[]
	pluginsConfig: { plugins: Record<string, any>; pluginsOrder: string[] }
	selectedStyle: "default" | "terminal"
	validTheme: string
	activeTemplateId: string
}

export const HeroPreviewShowcase = memo(function HeroPreviewShowcase({
	isBuilding,
	selectedSources,
	pluginsConfig,
	selectedStyle,
	validTheme,
	activeTemplateId,
}: HeroPreviewShowcaseProps) {
	const hasContent = selectedSources.length > 0 && pluginsConfig.pluginsOrder.length > 0

	return (
		<motion.div
			initial={{ opacity: 0, x: 60 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, delay: 0.12 }}
			className="relative hidden lg:flex justify-center lg:justify-end items-start"
		>
			{/* Subtle background glows (kept light for perf) */}
			<div className="absolute -inset-16 blur-3xl opacity-60 pointer-events-none -z-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-pink-500/15 to-purple-500/20" />
			<div className="absolute -inset-22 blur-[80px] opacity-40 pointer-events-none -z-20 rounded-2xl bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-cyan-500/15" />

			{/* Fixed-size showcase wrapper (430px width) */}
			<div
				className="relative"
				style={{
					width: 430,
					height: 900,
					maxHeight: "98vh",
				}}
			>
				<AnimatePresence mode="wait">
					{isBuilding ? (
						<motion.div
							key="building-fixed"
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={{ duration: 0.28 }}
							className="w-full h-full flex items-start justify-center pt-8 rounded-xl bg-card/70 border border-white/8 shadow-lg"
							aria-label="Building preview"
						>
							<div className="flex flex-col items-center gap-3">
								<Loader2 className="w-10 h-10 animate-spin text-primary" />
								<span className="text-sm text-muted-foreground">Building...</span>
							</div>
						</motion.div>
					) : hasContent ? (
						<motion.div
							key={`${activeTemplateId}-${selectedStyle}-${validTheme}-fixed`}
							initial={{ opacity: 0, y: 18, scale: 0.76, rotate: -8, x: -250 }}
							animate={{ opacity: 1, y: 0, scale: 1, rotate: -4, x: 0 }}
							exit={{ opacity: 0, y: 58, scale: 1.26, rotate: -8, x: 150 }}
							whileHover={{ rotate: -2, scale: 0.98 }}
							transition={{ type: "spring", stiffness: 260, damping: 28 }}
							className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden"
							style={{ willChange: "transform" }}
						>
							{/* Decorative frame */}
							<div className="absolute inset-0 rounded-xl p-[6px] bg-gradient-to-br from-purple-500/15 via-pink-400/12 to-cyan-400/10 pointer-events-none" />

							{/* Inner surface (actual preview area) */}
							<div className="relative inset-0 w-full h-full rounded-lg bg-slate-900/80 border border-white/6 overflow-hidden flex items-start justify-center">
								{/* Top-aligned fixed preview box to preserve SVG size */}
								<div
									className="relative flex items-start justify-center rounded-md"
									style={{
										width: 430,
										height: 860,
										transform: "translateZ(0)",
									}}
								>
									{/* PreviewRenderer with fixed dimensions */}
									<PreviewRenderer
										plugins={pluginsConfig.plugins}
										pluginsOrder={pluginsConfig.pluginsOrder}
										style={selectedStyle}
										size="half"
										width={430}
										height={860}
										theme={validTheme}
									/>

									{/* small scanline (light, GPU-accelerated) */}
									<motion.div
										key={`scan-${activeTemplateId}`}
										className="pointer-events-none absolute inset-0 mix-blend-screen"
										initial={{ x: "-130%" }}
										animate={{ x: "130%" }}
										transition={{
											duration: 2,
											ease: [0.16, 1, 0.3, 1],
											repeat: Infinity,
											repeatDelay: 3,
										}}
										style={{ opacity: 0.08 }}
										aria-hidden="true"
									>
										<div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
									</motion.div>
								</div>
							</div>

							{/* Decorative outer glow (subtle) */}
							<div
								className="absolute -inset-1 rounded-xl blur-xl -z-10"
								style={{
									background: "linear-gradient(135deg, rgba(137,87,229,0.08), rgba(229,87,154,0.06))",
								}}
							/>
						</motion.div>
					) : (
						<motion.div
							key="empty-fixed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="w-full h-full flex items-start justify-center pt-8 rounded-xl bg-card/60 border border-white/6"
							aria-label="Empty preview"
						>
							<div className="text-center">
								<div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
									<Sparkles className="w-10 h-10 text-primary" />
								</div>
								<div className="text-sm font-semibold text-foreground">Select a template</div>
								<div className="text-xs text-muted-foreground">See your card come to life</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	)
})

