import React from "react"
import { StarBucket } from "../../types"

interface RenderStarHistoryProps {
  starHistory: StarBucket[]
  bucket?: "day" | "week" | "month" | "auto"
  size?: "half" | "full"
  styleMode?: "default" | "terminal"
}

export function RenderStarHistory({
  starHistory,
  bucket = "week",
  size = "full",
  styleMode = "default",
}: RenderStarHistoryProps) {
  if (starHistory.length === 0) {
    return (
      <div className="default-container p-5 rounded-xl shadow-lg border">
        <h4 className="text-default-text text-lg font-bold mb-4">Star History</h4>
        <div className="text-center p-10 rounded-lg border-2 border-dashed border-default-muted bg-default-surface">
          <span className="text-default-muted text-sm">Star history data not available</span>
        </div>
      </div>
    )
  }

  // Terminal mode with emojis - usando sistema de temas
  if (styleMode === "terminal") {
    return (
      <div className="terminal-container p-4 rounded-lg border">
        <div className="terminal-line">
          <span className="text-terminal-highlight">git star-history</span>
        </div>
        <div className="terminal-line">
          <span className="text-terminal-default">
            📈 Total stars: {starHistory[starHistory.length - 1]?.stars_total || 0}
          </span>
        </div>
        <div className="terminal-line">
          <span className="text-terminal-default">📊 Period: {bucket}ly</span>
        </div>
      </div>
    )
  }

  // Get recent data (last 30 buckets)
  const recentData = starHistory.slice(-30)
  const maxStars = Math.max(...recentData.map((d) => d.stars_new))
  const totalStars = recentData[recentData.length - 1]?.stars_total || 0
  const totalNewStars = recentData.reduce((sum, d) => sum + d.stars_new, 0)

  // Default mode - usando sistema de temas
  return (
    <div className="default-container p-6 rounded-xl shadow-lg border">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h4 className="text-default-text text-lg font-bold m-0">Star History</h4>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-default-text text-base font-bold">Total Stars:</span>
          <span className="text-default-success text-2xl font-bold">{totalStars.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-default-text text-base font-bold">New Stars:</span>
          <span className="text-default-highlight text-2xl font-bold">+{totalNewStars}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-default-text text-base font-bold">Average:</span>
          <span className="text-default-muted text-base">
            {Math.round(totalNewStars / recentData.length)} stars/{bucket}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-default-text text-base font-bold">Growth:</span>
          <span className="text-default-highlight text-base">
            +{((totalNewStars / (totalStars - totalNewStars)) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
