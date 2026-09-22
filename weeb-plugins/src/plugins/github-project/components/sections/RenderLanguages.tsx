import React from "react"
import { GitHubLanguage } from "../../types"

interface RenderLanguagesProps {
  languages: GitHubLanguage[]
  top?: number
  size?: "half" | "full"
  styleMode?: "default" | "terminal"
  circleStyle?: boolean
}

export function RenderLanguages({
  languages,
  top = 5,
  size = "full",
  styleMode = "default",
  circleStyle = false,
}: RenderLanguagesProps) {
  const topLanguages = languages.slice(0, top)

  if (topLanguages.length === 0) {
    return null
  }

  // Terminal mode with emojis - usando sistema de temas
  if (styleMode === "terminal") {
    return (
      <div className="terminal-container p-4 rounded-lg border">
        <div className="terminal-line">
          <span className="text-terminal-highlight">git languages</span>
        </div>
        {topLanguages.map((lang, index) => (
          <div key={lang.language} className="terminal-line">
            <span className="text-terminal-default">
              💻 {lang.language}: {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Circle style - usando sistema de temas
  if (circleStyle) {
    return (
      <div className="default-container p-5 rounded-xl shadow-lg border">
        <h4 className="text-default-text text-base font-semibold mb-4">Programming Languages</h4>
        <div className="flex flex-wrap gap-4 justify-center">
          {topLanguages.map((lang, index) => {
            const angle = (index / topLanguages.length) * 360
            const percentage = lang.percentage
            const radius = 60
            const circumference = 2 * Math.PI * radius
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

            return (
              <div key={lang.language} className="flex flex-col items-center gap-2">
                <svg width="140" height="140" className="drop-shadow-md">
                  <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--default-color-muted)" strokeWidth="12" />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="var(--default-color-highlight)"
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-300"
                  />
                  <text
                    x="70"
                    y="70"
                    textAnchor="middle"
                    dy="5"
                    fill="var(--default-color-text)"
                    fontSize="14"
                    fontWeight="600"
                  >
                    {lang.percentage}%
                  </text>
                </svg>
                <span className="text-default-text text-sm font-medium">{lang.language}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Default list mode - usando sistema de temas
  return (
    <div className="default-container p-5 rounded-xl shadow-lg border">
      <h4 className="text-default-text text-base font-semibold mb-4">Programming Languages</h4>
      <div className="flex flex-col gap-3">
        {topLanguages.map((lang, index) => (
          <div
            key={lang.language}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-default-surface hover:bg-default-muted transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
          >
            <div className="flex items-center gap-2 min-w-120">
              <span className="text-default-text text-sm font-medium">{lang.language}</span>
              <span className="text-default-muted text-xs font-semibold">{lang.percentage}%</span>
            </div>
            <div className="flex-1 h-2 bg-default-muted rounded-2 overflow-hidden">
              <div
                className="h-full rounded-2 transition-all duration-300"
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: getLanguageColor(lang.language),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to get language colors
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3776ab",
    Java: "#007396",
    "C++": "#00599c",
    "C#": "#239120",
    PHP: "#777bb4",
    Ruby: "#cc342d",
    Go: "#00add8",
    Rust: "#dea584",
    Swift: "#fa7343",
    Kotlin: "#7f52ff",
    CSS: "#1572b6",
    HTML: "#e34f26",
    Shell: "#89e051",
    Docker: "#2496ed",
    Vue: "#4fc08d",
    Angular: "#dd0031",
    Svelte: "#ff3e00",
  }
  return colors[language] || "#6b7280"
}
