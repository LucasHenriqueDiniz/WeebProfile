"use client"

import { memo } from "react"
import { motion } from "framer-motion"

interface TemplateCardSkeletonProps {
	index?: number
}

export const TemplateCardSkeleton = memo(function TemplateCardSkeleton({
	index = 0,
}: TemplateCardSkeletonProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			className="relative rounded-lg border-2 border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden"
		>
			<div className="p-3">
				{/* Header skeleton */}
				<div className="flex items-center gap-2 mb-2">
					<div className="w-8 h-8 rounded-md bg-muted/50 animate-pulse flex-shrink-0" />
					<div className="flex-1 min-w-0">
						<div className="h-3 w-20 bg-muted/50 rounded animate-pulse" />
					</div>
				</div>

				{/* Plugin icons skeleton */}
				<div className="flex items-center gap-1">
					<div className="w-5 h-5 rounded bg-muted/50 animate-pulse" />
					<div className="w-5 h-5 rounded bg-muted/50 animate-pulse" />
					<div className="w-5 h-5 rounded bg-muted/50 animate-pulse" />
				</div>
			</div>
		</motion.div>
	)
})




































