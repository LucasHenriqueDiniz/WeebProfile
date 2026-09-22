import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { abbreviateNumber } from "../../../utils/number"
import { Star } from "lucide-react"
import { generateTerminalBorder } from "../../../utils/terminal"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { GitHubProjectData, GitHubProjectConfig } from "../types"

type Skin = "glass" | "solid" | "outline"
type Width = "half" | "full"

interface StarHistoryProps {
  data: GitHubProjectData
  config: GitHubProjectConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

const getSkinClasses = (skin: Skin): string => {
  switch (skin) {
    case "glass":
      return "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
    case "solid":
      return "bg-neutral-900 border border-neutral-800"
    case "outline":
      return "bg-transparent border border-neutral-700 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
  }
}

// Auto-detect optimal intervals based on repository age
function calculateOptimalIntervals(starHistory: any[], createdAt: string, width: Width) {
  const createdDate = new Date(createdAt)
  const now = new Date()
  const ageInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

  // Max points based on width
  const maxPoints = width === "half" ? 8 : 12

  // Determine grouping strategy based on age
  let groupByDays: number
  let dateFormat: "day" | "month" | "month-year" = "day"

  if (ageInDays <= 30) {
    // Recent: daily, show all
    groupByDays = 1
    dateFormat = "day"
  } else if (ageInDays <= 90) {
    // 1-3 months: every 3 days
    groupByDays = 3
    dateFormat = "day"
  } else if (ageInDays <= 365) {
    // 3-12 months: weekly
    groupByDays = 7
    dateFormat = "month"
  } else if (ageInDays <= 730) {
    // 1-2 years: every 2 weeks
    groupByDays = 14
    dateFormat = "month"
  } else {
    // Older: monthly
    groupByDays = 30
    dateFormat = "month-year"
  }

  // Group data points
  const groupedData: any[] = []
  const sortedHistory = [...starHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  for (let i = 0; i < sortedHistory.length; i += groupByDays) {
    const slice = sortedHistory.slice(i, i + groupByDays)
    if (slice.length > 0) {
      const avgStars = Math.round(slice.reduce((sum, item) => sum + item.stars_total, 0) / slice.length)
      const date = slice[Math.floor(slice.length / 2)].date

      groupedData.push({
        date,
        stars: avgStars,
        displayDate: formatDisplayDate(date, dateFormat),
      })
    }

    if (groupedData.length >= maxPoints) break
  }

  return groupedData
}

function formatDisplayDate(dateStr: string, format: "day" | "month" | "month-year"): string {
  const date = new Date(dateStr)

  switch (format) {
    case "day":
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    case "month":
      return date.toLocaleDateString("en-US", { month: "short" })
    case "month-year":
      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
  }
}

export function StarHistory({ data, config, style = "default", size = "half" }: StarHistoryProps) {
  const starHistory = (data.starHistory || []).filter(
    (item) => item && typeof item.stars_total === "number" && !isNaN(item.stars_total)
  )

  const skin = config.skin || "glass"
  const createdAt = data.repository?.created_at || new Date().toISOString()

  if (!starHistory.length) {
    return (
      <RenderBasedOnStyle
        style={style}
        defaultComponent={<StarHistoryEmpty skin={skin} width={size as Width} />}
        terminalComponent={<StarHistoryTerminalEmpty />}
      />
    )
  }

  // Calculate optimal intervals based on repository age
  const chartData = calculateOptimalIntervals(starHistory, createdAt, size as Width)

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={
        <StarHistoryDefault
          chartData={chartData}
          config={config}
          skin={skin}
          width={size as Width}
          totalStars={starHistory[starHistory.length - 1]?.stars_total || 0}
        />
      }
      terminalComponent={<StarHistoryTerminal starHistory={starHistory} size={size} />}
    />
  )
}

const StarHistoryDefault = ({
  chartData,
  config,
  skin,
  width,
  totalStars,
}: {
  chartData: any[]
  config: GitHubProjectConfig
  skin: Skin
  width: Width
  totalStars: number
}) => {
  const baseClasses = `rounded-xl p-6 ${getSkinClasses(skin)}`
  const widthClass = width === "half" ? "w-[415px]" : "w-[830px]"
  const chartType = config.starHistory_chart_type || "line"
  const showGrid = config.starHistory_show_grid !== false

  const chartHeight = width === "half" ? 200 : 240

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
      width: width === "half" ? 415 : 830,
      height: chartHeight,
    }

    if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />}
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            tickFormatter={(value) => abbreviateNumber(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#F9FAFB",
            }}
            formatter={(value: any) => [abbreviateNumber(value), "Stars"]}
          />
          <Area type="monotone" dataKey="stars" stroke="#F59E0B" strokeWidth={2} fill="#F59E0B" fillOpacity={0.2} />
        </AreaChart>
      )
    } else if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />}
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            tickFormatter={(value) => abbreviateNumber(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#F9FAFB",
            }}
            formatter={(value: any) => [abbreviateNumber(value), "Stars"]}
          />
          <Bar dataKey="stars" fill="#F59E0B" radius={[2, 2, 0, 0]} />
        </BarChart>
      )
    } else {
      return (
        <LineChart {...commonProps}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />}
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            tickFormatter={(value) => abbreviateNumber(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#F9FAFB",
            }}
            formatter={(value: any) => [abbreviateNumber(value), "Stars"]}
          />
          <Line type="monotone" dataKey="stars" stroke="#F59E0B" strokeWidth={2} dot={false} />
        </LineChart>
      )
    }
  }

  return (
    <div className={`${baseClasses} ${widthClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-neutral-400 text-sm font-medium uppercase tracking-wider">Star History</h4>
        <div className="text-right">
          <div className="text-yellow-500 text-lg font-bold flex items-center gap-1">
            <Star className="w-4 h-4" />
            {abbreviateNumber(totalStars)}
          </div>
          <div className="text-neutral-500 text-xs">Total Stars</div>
        </div>
      </div>

      <div style={{ width: "100%", height: chartHeight + 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const StarHistoryEmpty = ({ skin, width }: { skin: Skin; width: Width }) => {
  const baseClasses = `rounded-xl p-6 ${getSkinClasses(skin)}`
  const widthClass = width === "half" ? "w-[415px]" : "w-[830px]"

  return (
    <div className={`${baseClasses} ${widthClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-neutral-400 text-sm font-medium uppercase tracking-wider">Star History</h4>
        <span className="text-neutral-500 text-sm">No data available</span>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-neutral-500">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <p>Star history data not available</p>
          <p className="text-xs mt-2 opacity-70">Repository may be too new or data unavailable</p>
        </div>
      </div>
    </div>
  )
}

const StarHistoryTerminal = ({ starHistory, size }: { starHistory: any[]; size: string }) => {
  const isHalfMode = size === "half"
  const maxStars = Math.max(...starHistory.map((d) => d.stars_total))
  const minStars = Math.min(...starHistory.map((d) => d.stars_total))
  const range = maxStars - minStars || 1

  const chartWidth = isHalfMode ? 25 : 50
  const chartHeight = isHalfMode ? 8 : 12

  // Criar gráfico ASCII com linhas conectando pontos
  const createAsciiLineChart = () => {
    const data = starHistory.slice(-chartWidth)
    const chart = []

    // Criar grid vazio
    for (let y = 0; y < chartHeight; y++) {
      chart[y] = new Array(chartWidth).fill(" ")
    }

    // Calcular posições Y normalizadas
    const yPositions = data
      .map((d, i) => {
        const stars = d?.stars_total || 0
        const normalized = (stars - minStars) / range
        const yPos = Math.round((1 - normalized) * (chartHeight - 1))
        return {
          x: i,
          y: Math.max(0, Math.min(chartHeight - 1, yPos)),
          value: stars,
        }
      })
      .filter((pos) => pos !== null && pos !== undefined)

    // Desenhar linhas conectando pontos
    for (let i = 0; i < yPositions.length - 1; i++) {
      const current = yPositions[i]
      const next = yPositions[i + 1]

      if (!current || !next) continue

      // Desenhar ponto atual
      if (
        current &&
        typeof current.y === "number" &&
        typeof current.x === "number" &&
        current.y >= 0 &&
        current.y < chartHeight &&
        current.x >= 0 &&
        current.x < chartWidth &&
        Array.isArray(chart) &&
        chart[current.y] &&
        typeof chart[current.y][current.x] === "string"
      ) {
        chart[current.y][current.x] = "●"
      }

      // Conectar com linha
      const dx = next.x - current.x
      const dy = next.y - current.y

      if (dx > 0) {
        for (let step = 1; step < dx; step++) {
          const ratio = step / dx
          const y = Math.round(current.y + dy * ratio)
          const clampedY = Math.max(0, Math.min(chartHeight - 1, y))
          if (chart[clampedY] && chart[clampedY][current.x + step] !== undefined) {
            chart[clampedY][current.x + step] = "─"
          }
        }
      }
    }

    // Desenhar último ponto
    if (yPositions.length > 0) {
      const last = yPositions[yPositions.length - 1]
      if (
        last &&
        typeof last.y === "number" &&
        typeof last.x === "number" &&
        last.y >= 0 &&
        last.y < chartHeight &&
        last.x >= 0 &&
        last.x < chartWidth &&
        Array.isArray(chart) &&
        chart[last.y] &&
        typeof chart[last.y][last.x] === "string"
      ) {
        chart[last.y][last.x] = "●"
      }
    }

    // Adicionar eixos e labels
    const lines = chart.map((row, y) => {
      const yValue = Math.round(minStars + (range * (chartHeight - 1 - y)) / (chartHeight - 1))
      const label =
        y === 0
          ? `${abbreviateNumber(maxStars)}┤`
          : y === chartHeight - 1
            ? `${abbreviateNumber(minStars)}┤`
            : y === Math.floor(chartHeight / 2)
              ? `${abbreviateNumber(yValue)}┤`
              : " │"
      return label + row.join("")
    })

    // Adicionar labels X (datas)
    const dateLabels = data
      .map((d, i) => {
        if (i % Math.max(1, Math.floor(chartWidth / 5)) === 0) {
          const dateStr = d?.date || ""
          const date = new Date(dateStr)
          const monthLabel = isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", { month: "short" })
          return monthLabel.padEnd(3)
        }
        return " ".repeat(3)
      })
      .join("")

    return ["Stars ↑", ...lines, "       " + dateLabels.slice(0, chartWidth)].join("\n")
  }

  const asciiChart = createAsciiLineChart()

  // Estatísticas formatadas
  const totalStars = maxStars
  const growth = maxStars - minStars
  const period = `${new Date(starHistory[0]?.date || "").toLocaleDateString()} → ${new Date(starHistory[starHistory.length - 1]?.date || "").toLocaleDateString()}`

  const gridData = [
    { title: "📈 Star History - ASCII Chart", subtitle: "", value: "" },
    { title: `Total Stars: ${abbreviateNumber(totalStars)}`, subtitle: "", value: "" },
    { title: `Growth: +${abbreviateNumber(growth)}`, subtitle: "", value: "" },
    { title: `Period: ${period}`, subtitle: "", value: "" },
    { title: "", subtitle: "", value: "" },
    ...asciiChart.split("\n").map((line) => ({ title: line, subtitle: "", value: "" })),
    { title: "", subtitle: "", value: "" },
    { title: "● = Data points    ─ = Growth trend", subtitle: "", value: "" },
  ]

  return (
    <div className={`space-y-2 ${isHalfMode ? "text-xs" : "text-sm"}`}>
      <TerminalCommand command="gh api repos/{owner}/{repo}/stargazers --paginate | jq length" />
      <div
        className="border rounded p-2"
        style={{
          borderColor: "var(--terminal-color-muted)",
          backgroundColor: "var(--terminal-color-surface)",
        }}
      >
        {(() => {
          const border = generateTerminalBorder({ title: "Star Growth Chart", size: isHalfMode ? "half" : "full" })
          return (
            <div className="font-bold mb-2 text-center" style={{ color: "var(--terminal-color-default)" }}>
              {border.top}
            </div>
          )
        })()}

        <div className="space-y-1">
          {gridData.map((item, index) => (
            <div
              key={index}
              className={`font-mono text-green-400 ${
                item.title.includes("●") || item.title.includes("│") || item.title.includes("┤") ? "text-cyan-400" : ""
              } ${item.title.includes("↑") ? "text-yellow-400 font-bold" : ""}`}
            >
              {item.title}
            </div>
          ))}
        </div>

        {(() => {
          const border = generateTerminalBorder({ title: "Star Growth Chart", size: isHalfMode ? "half" : "full" })
          return (
            <div className="font-bold mt-2 text-center" style={{ color: "var(--terminal-color-default)" }}>
              {border.bottom}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

const StarHistoryTerminalEmpty = () => {
  const gridData = [{ title: "No star history data available", subtitle: "", value: "" }]

  return (
    <div className="space-y-3">
      <TerminalCommand command="gh repo view --json stargazerCount" />
      <TerminalGrid data={gridData} leftText="Star History" />
    </div>
  )
}
