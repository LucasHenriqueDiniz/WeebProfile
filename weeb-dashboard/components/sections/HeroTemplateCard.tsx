"use client"

import { getPluginIcon } from "@/lib/plugin-icons"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Monitor, Terminal } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import { memo } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface Template {
	id: string
	name: string
	description: string
	accent: string
	style: "default" | "terminal"
	theme: string
	plugins: string[]
	pluginConfigs: Record<string, { sections: string[]; sectionConfigs?: Record<string, any> }>
}

interface HeroTemplateCardProps {
	template: Template
	isActive: boolean
	onClick: () => void
}

export const HeroTemplateCard = memo(function HeroTemplateCard({
	template,
	isActive,
	onClick,
}: HeroTemplateCardProps) {
	const StyleIcon = template.style === "terminal" ? Terminal : Monitor
	const pluginsList = template.plugins.join(", ")

	return (
		<TooltipProvider>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<motion.button
						key={template.id}
						onClick={onClick}
						className={cn(
							"group relative text-left rounded-lg border-2 transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
							isActive
								? "border-primary bg-primary/10 shadow-lg shadow-primary/30"
								: "border-border/60 bg-card/50 hover:border-primary/60 hover:bg-card/70 backdrop-blur-sm"
						)}
						whileHover={{ y: -4, scale: 1.03 }}
						whileTap={{ scale: 0.98 }}
						style={
							!isActive
								? {
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
									}
								: undefined
						}
						aria-label={`Select ${template.name} template`}
						aria-pressed={isActive}
					>
						<div className="p-3.5">
							{/* Header - Enhanced */}
							<div className="flex items-center gap-2.5 mb-2.5">
								<div
									className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md flex-shrink-0 transition-transform group-hover:scale-110"
									style={{ 
										backgroundColor: template.accent,
										boxShadow: `0 4px 16px ${template.accent}40`,
									}}
									aria-hidden="true"
								>
									<StyleIcon className="w-4 h-4 text-white" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-bold text-foreground truncate">
										{template.name}
									</div>
								</div>
								<AnimatePresence mode="wait">
									{isActive && (
										<motion.div
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											exit={{ scale: 0, rotate: 180 }}
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 20,
											}}
											className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
											aria-label="Selected"
										>
											<Check className="w-2.5 h-2.5 text-white" />
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Plugin Icons - Smaller */}
							<div className="flex items-center gap-1" aria-label={`Plugins: ${template.plugins.join(", ")}`}>
								{template.plugins.slice(0, 3).map((pluginId) => {
									const Icon = getPluginIcon(pluginId) || FaGithub
									return Icon ? (
										<div
											key={pluginId}
											className="w-5 h-5 rounded bg-muted/50 border border-border/50 flex items-center justify-center"
											title={pluginId}
										>
											<Icon className="w-3 h-3 text-muted-foreground" />
										</div>
									) : null
								})}
								{template.plugins.length > 3 && (
									<div className="w-5 h-5 rounded bg-muted/50 border border-border/50 flex items-center justify-center">
										<span className="text-[9px] text-muted-foreground font-medium">
											+{template.plugins.length - 3}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Enhanced hover glow with neon effect */}
						<motion.div
							className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							style={{
								background: `radial-gradient(circle at 50% 0%, ${template.accent}20 0%, transparent 70%)`,
								boxShadow: `inset 0 0 40px ${template.accent}10`,
							}}
							aria-hidden="true"
						/>
						{/* Neon border glow on hover */}
						<motion.div
							className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
							style={{
								boxShadow: `0 0 20px ${template.accent}30, inset 0 0 20px ${template.accent}10`,
							}}
							aria-hidden="true"
						/>
					</motion.button>
				</TooltipTrigger>
				<TooltipContent side="top" className="max-w-xs">
					<div className="space-y-1">
						<p className="font-semibold text-sm">{template.name}</p>
						{template.description && <p className="text-xs text-muted-foreground">{template.description}</p>}
						<p className="text-xs text-muted-foreground pt-1">Plugins: {pluginsList}</p>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
})

