import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import type { GitHubProjectData, GitHubProjectConfig } from "../types"

type Skin = "glass" | "solid" | "outline"
type Width = "half" | "full"

interface LanguagesProps {
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

export function Languages({ data, config, style = "default", size = "half" }: LanguagesProps) {
  const languages = (data.languages || []).filter(
    (lang) => lang && typeof lang.percentage === "number" && !isNaN(lang.percentage)
  )
  const languagesStyle = config.languages_style || "bars"
  const skin = config.skin || "glass"

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={
        <LanguagesDefault languages={languages} languagesStyle={languagesStyle} skin={skin} width={size as Width} />
      }
      terminalComponent={<LanguagesTerminal languages={languages} languagesStyle={languagesStyle} size={size} />}
    />
  )
}

const LanguagesDefault = ({
  languages,
  languagesStyle,
  skin,
  width,
}: {
  languages: any[]
  languagesStyle: string
  skin: Skin
  width: Width
}) => {
  const baseClasses = `rounded-xl p-6 ${getSkinClasses(skin)}`
  const widthClass = width === "half" ? "w-[415px]" : "w-[830px]"

  if (languagesStyle === "bars") {
    return (
      <div className={`${baseClasses} ${widthClass}`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-default-muted text-sm font-medium uppercase tracking-wider">Languages</h4>
          <span className="text-default-muted text-sm">{languages.length} languages</span>
        </div>

        <div className="space-y-4">
          {languages.slice(0, width === "half" ? 5 : 6).map((lang, index) => (
            <div key={lang.language} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: getLanguageColor(lang.language) }}
                  />
                  <span className="text-default-text font-medium">{lang.language}</span>
                </div>
                <span className="text-default-muted font-mono">{lang.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-default-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: getLanguageColor(lang.language),
                  }}
                />
              </div>
            </div>
          ))}

          {languages.length > (width === "half" ? 5 : 6) && (
            <div className="text-center pt-2 border-t border-default-border/30">
              <span className="text-xs text-default-muted">
                +{languages.length - (width === "half" ? 5 : 6)} more languages
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Circles/Donut style
  const total = languages.reduce((sum, lang) => sum + lang.percentage, 0)

  return (
    <div className={`${baseClasses} ${widthClass}`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-default-muted text-sm font-medium uppercase tracking-wider">Languages</h4>
        <span className="text-default-muted text-sm">{languages.length} languages</span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 40 40" className="-rotate-90 transform">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-default-muted/20"
            />

            {languages.slice(0, 6).map((lang, index) => {
              const strokeDasharray = `${(lang.percentage / total) * 100} ${100 - (lang.percentage / total) * 100}`
              const cumulativePercentage = languages.slice(0, index).reduce((sum, l) => sum + l.percentage, 0)
              const strokeDashoffset = -cumulativePercentage

              return (
                <circle
                  key={lang.language}
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke={getLanguageColor(lang.language)}
                  strokeWidth="3"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              )
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-default-text">{languages.length}</div>
            <div className="text-xs text-default-muted">langs</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {languages.slice(0, 6).map((lang) => (
            <div
              key={lang.language}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-surface/50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full border-2 border-white/30"
                style={{ backgroundColor: getLanguageColor(lang.language) }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-default-text font-medium truncate">{lang.language}</div>
                <div className="text-xs text-default-muted font-mono">{lang.percentage}%</div>
              </div>
            </div>
          ))}

          {languages.length > 6 && (
            <div className="col-span-2 text-center pt-2 border-t border-default-border/30">
              <span className="text-xs text-default-muted">+{languages.length - 6} more languages</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const LanguagesTerminal = ({
  languages,
  languagesStyle,
  size,
}: {
  languages: any[]
  languagesStyle: string
  size: string
}) => {
  const items = languages.slice(0, size === "half" ? 5 : 8).map((lang) => `${lang.language}: ${lang.percentage}%`)

  const gridData = [
    { title: "Programming Languages", subtitle: "", value: "" },
    ...items.map((item) => ({ title: item, subtitle: "", value: "" })),
  ]

  return (
    <div className="space-y-3">
      <TerminalCommand command="gh repo view --json languages" />
      <TerminalGrid data={gridData} leftText="Languages" />
    </div>
  )
}

// Helper function to get language colors
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#ed8b00",
    "C++": "#f34b7d",
    C: "#555555",
    PHP: "#777BB4",
    Ruby: "#701516",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Shell: "#89e051",
    Dockerfile: "#384d54",
  }

  return colors[language] || "#6b7280"
}
