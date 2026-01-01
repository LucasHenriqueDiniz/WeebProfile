"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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

// Skeleton para os cards de SVG no dashboard
interface SvgCardSkeletonProps {
	index?: number
}

export const SvgCardSkeleton = memo(function SvgCardSkeleton({
	index = 0,
}: SvgCardSkeletonProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.03, duration: 0.2 }}
		>
			<Card className="hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 transition-all group h-full flex flex-col border-border/50">
				<CardContent className="p-5 flex flex-col flex-1">
					{/* Preview Image Skeleton */}
					<div className="mb-4 rounded-lg border border-border bg-muted/30 aspect-video flex items-center justify-center shadow-sm">
						<div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/70 animate-pulse rounded-lg" />
					</div>

					{/* Info Skeleton */}
					<div className="space-y-3 flex-1">
						<div>
							<div className="h-5 w-32 bg-muted/50 rounded animate-pulse mb-1.5" />
							<div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
						</div>

						{/* Status Badge Skeleton */}
						<div className="flex items-center gap-2">
							<div className="h-5 w-16 bg-muted/50 rounded-full animate-pulse" />
							<div className="h-5 w-12 bg-muted/50 rounded-full animate-pulse" />
						</div>

						{/* Plugins Skeleton */}
						<div className="space-y-1">
							<div className="h-3 w-12 bg-muted/50 rounded animate-pulse" />
							<div className="flex flex-wrap gap-1">
								<div className="h-5 w-16 bg-muted/50 rounded animate-pulse" />
								<div className="h-5 w-14 bg-muted/50 rounded animate-pulse" />
								<div className="h-5 w-18 bg-muted/50 rounded animate-pulse" />
							</div>
						</div>

						{/* Last Updated Skeleton */}
						<div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
					</div>

					{/* Actions Skeleton */}
					<div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
						<div className="flex-1 h-8 bg-muted/50 rounded animate-pulse" />
						<div className="h-8 w-16 bg-muted/50 rounded animate-pulse" />
						<div className="h-8 w-8 bg-muted/50 rounded animate-pulse" />
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
})

// Skeleton para a página de view de SVG (layout PREVIEW | DADOS)
interface SvgViewSkeletonProps {}

export const SvgViewSkeleton = memo(function SvgViewSkeleton({}: SvgViewSkeletonProps) {
	return (
		<div className="p-6 md:p-8 lg:p-10">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Status Badge Skeleton */}
				<div className="flex items-center justify-between gap-4">
					<div className="h-6 w-24 bg-muted/50 rounded-full animate-pulse" />
					<div className="h-8 w-32 bg-muted/50 rounded animate-pulse" />
				</div>

				{/* Layout Desktop: PREVIEW | DADOS */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					{/* PREVIEW Column Skeleton */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<div className="h-6 w-32 bg-muted/50 rounded animate-pulse mb-2" />
								<div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
							</CardHeader>
							<CardContent>
								<div className="border rounded-lg p-4 bg-muted/50 flex items-center justify-center min-h-[300px]">
									<div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/70 animate-pulse rounded-lg" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* DADOS Column Skeleton */}
					<div className="space-y-6">
						{/* Markdown Code Skeleton */}
						<Card>
							<CardHeader>
								<div className="h-6 w-32 bg-muted/50 rounded animate-pulse mb-2" />
								<div className="h-4 w-48 bg-muted/50 rounded animate-pulse" />
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
									<div className="h-8 w-20 bg-muted/50 rounded animate-pulse" />
								</div>
								<div className="h-16 w-full bg-muted rounded animate-pulse" />
							</CardContent>
						</Card>

						{/* URL Skeleton */}
						<Card>
							<CardHeader>
								<div className="h-6 w-28 bg-muted/50 rounded animate-pulse mb-2" />
								<div className="h-4 w-40 bg-muted/50 rounded animate-pulse" />
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex gap-2">
									<div className="flex-1 h-8 bg-muted/50 rounded animate-pulse" />
									<div className="flex-1 h-8 bg-muted/50 rounded animate-pulse" />
								</div>
								<div className="h-12 w-full bg-muted rounded animate-pulse" />
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Info Skeleton */}
				<Card>
					<CardHeader>
						<div className="h-6 w-24 bg-muted/50 rounded animate-pulse" />
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i}>
									<div className="h-4 w-16 bg-muted/50 rounded animate-pulse mb-1" />
									<div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
})





















































