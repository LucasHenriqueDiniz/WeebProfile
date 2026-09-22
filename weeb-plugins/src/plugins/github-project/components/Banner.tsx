import React from "react"
import figlet from "figlet"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { ImageComponent } from "../../../utils/image"
import { abbreviateNumber } from "../../../utils/number"
import { FaStar, FaCodeBranch, FaEye } from "react-icons/fa"
import type { GitHubProjectData, GitHubProjectConfig } from "../types"
import { generateTerminalBorder } from "../../../utils/terminal"

type Skin = "glass" | "solid" | "outline"
type Width = "half" | "full"

interface BannerProps {
  data: GitHubProjectData
  config: GitHubProjectConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

const getSkinClasses = (skin: Skin): string => {
  switch (skin) {
    case "glass":
      return "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
    case "solid":
      return "bg-neutral-900 border border-neutral-800 shadow-lg"
    case "outline":
      return "bg-transparent border border-neutral-700 shadow-lg"
  }
}

export function Banner({ data, config, style = "default", size = "half" }: BannerProps) {
  const repo = data.repository
  const bannerStyle = config.banner_style || "hero"
  const bannerBackground = config.banner_background || "default"
  const customAvatar = config.banner_custom_avatar || ""
  const hideStars = config.banner_hide_stars || false
  const hideForks = config.banner_hide_forks || false
  const hideDescription = config.banner_hide_description || false
  const hideWatchers = config.banner_hide_watchers !== false // default true
  const headerText = config.banner_header_text
  const footerText = config.banner_footer_text
  const skin = config.skin || "glass"
  const showContributors = config.banner_show_contributors || false
  const contributorsLimit = config.banner_contributors_limit || 5
  const terminalFont = config.banner_terminal_font || "standard"
  const customName = config.banner_custom_name || ""
  const hideAsciiBox = config.banner_hide_ascii_box || false
  const customWidth = config.banner_custom_width || 0
  const hideTerminalHeader = config.hide_terminal_header || config.banner_hide_terminal_header || false
  const hideGitCommands = config.banner_hide_git_commands || false
  const hideBackground = config.banner_hide_background || false

  // Ensure numeric values are valid
  if (repo) {
    repo.stargazers_count =
      typeof repo.stargazers_count === "number" && !isNaN(repo.stargazers_count) ? repo.stargazers_count : 0
    repo.forks_count = typeof repo.forks_count === "number" && !isNaN(repo.forks_count) ? repo.forks_count : 0
    repo.watchers_count =
      typeof repo.watchers_count === "number" && !isNaN(repo.watchers_count) ? repo.watchers_count : 0
  }

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={
        <BannerDefault
          repo={repo}
          bannerStyle={bannerStyle}
          bannerBackground={bannerBackground}
          customAvatar={customAvatar}
          hideStars={hideStars}
          hideForks={hideForks}
          hideDescription={hideDescription}
          hideWatchers={hideWatchers}
          showContributors={showContributors}
          contributorsLimit={contributorsLimit}
          headerText={headerText}
          footerText={footerText}
          skin={skin}
          width={size as Width}
          contributors={data.contributors || []}
        />
      }
      terminalComponent={
        <BannerTerminal
          repo={repo}
          hideStars={hideStars}
          hideForks={hideForks}
          hideDescription={hideDescription}
          size={size}
          terminalFont={terminalFont}
          customName={customName}
          hideAsciiBox={hideAsciiBox}
          hideGitCommands={hideGitCommands}
          hideBackground={hideBackground}
          headerText={headerText}
          footerText={footerText}
          showContributors={showContributors}
          contributorsLimit={contributorsLimit}
          contributors={data.contributors || []}
          customWidth={customWidth}
        />
      }
    />
  )
}

const BannerDefault = ({
  repo,
  bannerStyle,
  bannerBackground,
  customAvatar,
  hideStars,
  hideForks,
  hideDescription,
  hideWatchers,
  showContributors,
  contributorsLimit,
  headerText,
  footerText,
  skin,
  width,
  contributors,
}: {
  repo: any
  bannerStyle: string
  bannerBackground: string
  customAvatar: string
  hideStars: boolean
  hideForks: boolean
  hideDescription: boolean
  hideWatchers: boolean
  showContributors?: boolean
  contributorsLimit?: number
  headerText?: string
  footerText?: string
  skin: Skin
  width: Width
  contributors?: any[]
}) => {
  const baseClasses = `rounded-xl p-6 ${getSkinClasses(skin)}`
  const widthClass = width === "half" ? "w-[415px]" : "w-[830px]"

  const showStars = !hideStars
  const showForks = !hideForks
  const showDescription = !hideDescription
  const showWatchers = !hideWatchers

  // Render background based on bannerBackground setting
  const renderBackground = () => {
    if (bannerBackground === "none") return null

    switch (bannerBackground) {
      case "gradient":
        return (
          <div className="absolute inset-0">
            {/* Beautiful gradient with sophisticated color blending */}
            <div
              className="absolute inset-0 rounded-xl opacity-25 blur-sm"
              style={{
                background: `linear-gradient(135deg,
                  color-mix(in srgb, var(--default-color-highlight) 15%, var(--default-color-success) 10%) 0%,
                  color-mix(in srgb, var(--default-color-success) 12%, var(--default-color-muted) 8%) 25%,
                  color-mix(in srgb, var(--default-color-muted) 6%, var(--default-color-surface) 4%) 50%,
                  color-mix(in srgb, var(--default-color-highlight) 18%, var(--default-color-success) 12%) 75%,
                  color-mix(in srgb, var(--default-color-success) 15%, var(--default-color-highlight) 10%) 100%)`,
              }}
            ></div>
            {/* Subtle overlay */}
            <div
              className="absolute inset-0 rounded-xl opacity-20"
              style={{
                background: `linear-gradient(45deg,
                  transparent 25%,
                  color-mix(in srgb, var(--default-color-highlight) 8%, transparent) 50%,
                  transparent 75%)`,
                backgroundSize: "200% 200%",
              }}
            ></div>
            {/* Premium inner glow */}
            <div
              className="absolute inset-4 rounded-lg opacity-60 blur-sm"
              style={{
                background: `linear-gradient(135deg,
                  color-mix(in srgb, var(--default-color-surface) 15%, transparent) 0%,
                  transparent 50%,
                  color-mix(in srgb, var(--default-color-surface) 10%, transparent) 100%)`,
              }}
            ></div>
          </div>
        )

      case "grid":
        return (
          <div className="absolute inset-0">
            {/* Premium grid pattern with theme colors */}
            <div
              className="absolute inset-0 rounded-xl opacity-25 blur-[0.5px]"
              style={{
                backgroundImage: `
                  linear-gradient(color-mix(in srgb, var(--default-color-highlight) 15%, transparent) 1px, transparent 1px),
                  linear-gradient(90deg, color-mix(in srgb, var(--default-color-success) 12%, transparent) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            ></div>
            {/* Secondary grid */}
            <div
              className="absolute inset-0 rounded-xl opacity-15 blur-[0.5px]"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, color-mix(in srgb, var(--default-color-muted) 8%, transparent) 1px, transparent 1px),
                  linear-gradient(-45deg, color-mix(in srgb, var(--default-color-muted-light) 6%, transparent) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            ></div>
            {/* Premium dot pattern */}
            <div
              className="absolute inset-0 rounded-xl opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, color-mix(in srgb, var(--default-color-highlight) 12%, transparent) 1px, transparent 1px)`,
                backgroundSize: "80px 80px",
              }}
            ></div>
          </div>
        )

      case "spotlight":
        return (
          <div className="absolute inset-0">
            {/* Premium spotlight effects with theme colors */}
            <div
              className="absolute top-8 right-8 w-56 h-56 rounded-full blur-3xl opacity-30"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, var(--default-color-highlight) 25%, transparent) 0%, transparent 70%)`,
              }}
            ></div>
            <div
              className="absolute bottom-8 left-8 w-48 h-48 rounded-full blur-3xl opacity-25"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, var(--default-color-success) 20%, transparent) 0%, transparent 70%)`,
              }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, var(--default-color-muted) 15%, transparent) 0%, transparent 70%)`,
              }}
            ></div>
            {/* Premium light rays */}
            <div
              className="absolute inset-0 opacity-15 blur-sm"
              style={{
                background: `conic-gradient(from 0deg at 50% 50%,
                  transparent 0deg,
                  color-mix(in srgb, var(--default-color-surface) 20%, transparent) 60deg,
                  transparent 120deg,
                  color-mix(in srgb, var(--default-color-surface) 15%, transparent) 180deg,
                  transparent 240deg,
                  color-mix(in srgb, var(--default-color-surface) 18%, transparent) 300deg,
                  transparent 360deg)`,
                backgroundSize: "300% 300%",
              }}
            ></div>
            {/* Subtle vignette */}
            <div
              className="absolute inset-0 rounded-xl opacity-50"
              style={{
                background: `radial-gradient(circle at center, transparent 50%, color-mix(in srgb, var(--default-color-background) 40%, transparent) 100%)`,
              }}
            ></div>
          </div>
        )

      case "default":
      default:
        // Premium skin-based backgrounds
        if (skin === "glass") {
          return (
            <div className="absolute inset-0">
              {/* Premium glass morphism */}
              <div
                className="absolute inset-0 rounded-xl opacity-80 backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg,
                    color-mix(in srgb, var(--default-color-surface) 25%, transparent) 0%,
                    color-mix(in srgb, var(--default-color-muted) 8%, transparent) 50%,
                    color-mix(in srgb, var(--default-color-surface) 20%, transparent) 100%)`,
                }}
              ></div>
              {/* Premium orbs */}
              <div
                className="absolute top-10 right-10 w-24 h-24 rounded-full blur-2xl opacity-60"
                style={{
                  background: `radial-gradient(circle, color-mix(in srgb, var(--default-color-highlight) 30%, transparent) 0%, transparent 70%)`,
                }}
              ></div>
              <div
                className="absolute bottom-10 left-10 w-20 h-20 rounded-full blur-2xl opacity-50"
                style={{
                  background: `radial-gradient(circle, color-mix(in srgb, var(--default-color-success) 25%, transparent) 0%, transparent 70%)`,
                }}
              ></div>
              {/* Premium inner highlight */}
              <div
                className="absolute inset-3 rounded-lg opacity-40 blur-sm"
                style={{
                  background: `linear-gradient(135deg,
                    color-mix(in srgb, var(--default-color-surface) 15%, transparent) 0%,
                    transparent 70%,
                    color-mix(in srgb, var(--default-color-surface) 10%, transparent) 100%)`,
                }}
              ></div>
            </div>
          )
        } else if (skin === "solid") {
          return (
            <div className="absolute inset-0">
              {/* Premium solid gradient */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg,
                    color-mix(in srgb, var(--default-color-muted) 40%, var(--default-color-background)) 0%,
                    color-mix(in srgb, var(--default-color-muted) 60%, var(--default-color-background)) 50%,
                    color-mix(in srgb, var(--default-color-muted) 50%, var(--default-color-background)) 100%)`,
                }}
              ></div>
              {/* Premium dot pattern */}
              <div
                className="absolute inset-0 opacity-25 blur-[0.5px]"
                style={{
                  backgroundImage: `radial-gradient(circle, color-mix(in srgb, var(--default-color-surface) 20%, transparent) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              ></div>
              {/* Premium overlay */}
              <div
                className="absolute inset-0 rounded-xl opacity-30"
                style={{
                  background: `linear-gradient(to top, color-mix(in srgb, var(--default-color-background) 20%, transparent) 0%, transparent 100%)`,
                }}
              ></div>
            </div>
          )
        } else if (skin === "outline") {
          return (
            <div className="absolute inset-0">
              {/* Premium outline effect */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg,
                    color-mix(in srgb, var(--default-color-muted) 30%, var(--default-color-background)) 0%,
                    color-mix(in srgb, var(--default-color-muted) 50%, var(--default-color-background)) 100%)`,
                }}
              ></div>
              {/* Premium glowing border */}
              <div
                className="absolute inset-1 rounded-lg opacity-60 blur-sm"
                style={{
                  background: `linear-gradient(135deg,
                    color-mix(in srgb, var(--default-color-highlight) 15%, transparent) 0%,
                    color-mix(in srgb, var(--default-color-success) 12%, transparent) 50%,
                    color-mix(in srgb, var(--default-color-highlight) 18%, transparent) 100%)`,
                }}
              ></div>
              {/* Premium light streaks */}
              <div
                className="absolute inset-2 opacity-25 blur-[0.5px]"
                style={{
                  background: `linear-gradient(45deg,
                    transparent 20%,
                    color-mix(in srgb, var(--default-color-surface) 12%, transparent) 50%,
                    transparent 80%)`,
                  backgroundSize: "150% 150%",
                }}
              ></div>
            </div>
          )
        }
        return null
    }
  }

  const avatarUrl = customAvatar || (repo.owner?.avatar_url ? `${repo.owner.avatar_url}&s=160` : null)

  // Contributors section
  const renderContributors = () => {
    if (!showContributors || !contributors || contributors.length === 0) return null

    const topContributors = contributors.slice(0, contributorsLimit || 5)

    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-default-muted text-xs font-medium">Contributors:</span>
        <div className="flex -space-x-2">
          {topContributors.map((contributor, index) => (
            <ImageComponent
              key={contributor.login}
              url64={contributor.avatar_url}
              alt={`${contributor.login} avatar`}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-200"
            />
          ))}
        </div>
        <span className="text-default-muted text-xs ml-1">
          +{Math.max(0, contributors.length - (contributorsLimit || 5))} more
        </span>
      </div>
    )
  }

  // Different layouts based on banner style
  switch (bannerStyle) {
    case "hero":
      return (
        <div className={`${baseClasses} ${widthClass} relative overflow-hidden`}>
          {/* Header Text */}
          {headerText && (
            <div className="text-center mb-4">
              <span className="text-default-muted text-sm font-medium tracking-wide uppercase">{headerText}</span>
            </div>
          )}

          <div className="relative z-10">
            {/* Repository Icon and Name - Hero Style */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <span className="text-white font-bold text-2xl">{repo.name?.charAt(0).toUpperCase() || "R"}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-default-text mb-1 leading-tight">{repo.name}</h2>
                {repo.full_name && <p className="text-default-muted text-sm font-mono">{repo.full_name}</p>}
              </div>
            </div>

            {/* Description */}
            {showDescription && repo.description && (
              <p className="text-default-text text-sm leading-relaxed mb-4 line-clamp-3">{repo.description}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {showStars && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm">
                    <FaStar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-default-text font-semibold text-lg">
                      {abbreviateNumber(repo.stargazers_count)}
                    </span>
                    <span className="text-default-muted text-xs">Stars</span>
                  </div>
                </div>
              )}

              {showForks && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-sm">
                    <FaCodeBranch className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-default-text font-semibold text-lg">
                      {abbreviateNumber(repo.forks_count)}
                    </span>
                    <span className="text-default-muted text-xs">Forks</span>
                  </div>
                </div>
              )}

              {showWatchers && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                    <FaEye className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-default-text font-semibold text-lg">
                      {abbreviateNumber(repo.watchers_count)}
                    </span>
                    <span className="text-default-muted text-xs">Watchers</span>
                  </div>
                </div>
              )}
            </div>

            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {repo.topics.slice(0, width === "half" ? 4 : 6).map((topic: string) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            {/* Contributors */}
            {renderContributors()}
          </div>

          {/* Footer Text */}
          {footerText && (
            <div className="text-center mt-4 pt-4 border-t border-default-border/30">
              <span className="text-default-muted text-sm">{footerText}</span>
            </div>
          )}

          {/* Custom Background */}
          {renderBackground()}
        </div>
      )

    case "compact":
      return (
        <div className={`${baseClasses} ${widthClass} relative overflow-hidden`}>
          {/* Custom Background */}
          {renderBackground()}

          {headerText && (
            <div className="text-center mb-3">
              <span className="text-default-muted text-xs font-medium tracking-wide uppercase">{headerText}</span>
            </div>
          )}

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <span className="text-white font-bold text-lg">{repo.name?.charAt(0).toUpperCase() || "R"}</span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-default-text mb-1">{repo.name}</h3>
                {repo.full_name && <p className="text-default-muted text-xs font-mono truncate">{repo.full_name}</p>}
              </div>
            </div>

            {showDescription && repo.description && (
              <p className="text-default-text text-sm leading-relaxed mb-3 line-clamp-2">{repo.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs">
              {showStars && (
                <span className="flex items-center gap-1 text-default-muted">
                  <FaStar className="w-3 h-3 inline" /> {abbreviateNumber(repo.stargazers_count)}
                </span>
              )}
              {showForks && (
                <span className="flex items-center gap-1 text-default-muted">
                  <FaCodeBranch className="w-3 h-3 inline" /> {abbreviateNumber(repo.forks_count)}
                </span>
              )}
              {showWatchers && (
                <span className="flex items-center gap-1 text-default-muted">
                  <FaEye className="w-3 h-3 inline" /> {abbreviateNumber(repo.watchers_count)}
                </span>
              )}
            </div>
          </div>

          {footerText && (
            <div className="text-center mt-3 pt-3 border-t border-default-border/30">
              <span className="text-default-muted text-xs">{footerText}</span>
            </div>
          )}
        </div>
      )

    case "minimal":
      return (
        <div className={`${baseClasses} ${widthClass} text-center relative overflow-hidden`}>
          {/* Custom Background */}
          {renderBackground()}

          {headerText && (
            <div className="mb-3">
              <span className="text-default-muted text-xs font-medium tracking-wide uppercase">{headerText}</span>
            </div>
          )}

          <h3 className="text-xl font-bold text-default-text mb-2">{repo.name}</h3>

          {showDescription && repo.description && (
            <p className="text-default-text text-sm leading-relaxed mb-3 line-clamp-2">{repo.description}</p>
          )}

          <div className="flex items-center justify-center gap-4 text-sm">
            {showStars && (
              <span className="flex items-center gap-1 text-default-muted">
                <FaStar className="w-3 h-3 inline" /> {abbreviateNumber(repo.stargazers_count)}
              </span>
            )}
            {showForks && (
              <span className="flex items-center gap-1 text-default-muted">
                🍴 {abbreviateNumber(repo.forks_count)}
              </span>
            )}
            {showWatchers && (
              <span className="flex items-center gap-1 text-default-muted">
                👁️ {abbreviateNumber(repo.watchers_count)}
              </span>
            )}
          </div>

          {footerText && (
            <div className="mt-3 pt-3 border-t border-default-border/30">
              <span className="text-default-muted text-xs">{footerText}</span>
            </div>
          )}
        </div>
      )

    case "centered":
      return (
        <div className={`${baseClasses} ${widthClass} text-center relative overflow-hidden`}>
          {/* Custom Background */}
          {renderBackground()}

          {headerText && (
            <div className="mb-4">
              <span className="text-default-muted text-sm font-medium tracking-wide uppercase">{headerText}</span>
            </div>
          )}

          {/* Large centered avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl ring-4 ring-white/20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">{repo.name?.charAt(0).toUpperCase() || "R"}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-default-text mb-2">{repo.name}</h2>

          {repo.full_name && <p className="text-default-muted text-sm font-mono mb-3">{repo.full_name}</p>}

          {showDescription && repo.description && (
            <p className="text-default-text text-sm leading-relaxed mb-4 line-clamp-2">{repo.description}</p>
          )}

          <div className="flex items-center justify-center gap-6 text-sm mb-4">
            {showStars && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm">
                  <FaStar className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-default-text font-semibold text-lg">
                    {abbreviateNumber(repo.stargazers_count)}
                  </div>
                  <div className="text-default-muted text-xs">Stars</div>
                </div>
              </div>
            )}

            {showForks && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-sm">
                  <FaCodeBranch className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-default-text font-semibold text-lg">{abbreviateNumber(repo.forks_count)}</div>
                  <div className="text-default-muted text-xs">Forks</div>
                </div>
              </div>
            )}

            {showWatchers && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                  <FaEye className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-default-text font-semibold text-lg">{abbreviateNumber(repo.watchers_count)}</div>
                  <div className="text-default-muted text-xs">Watchers</div>
                </div>
              </div>
            )}
          </div>

          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {repo.topics.slice(0, width === "half" ? 4 : 6).map((topic: string) => (
                <span
                  key={topic}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {footerText && (
            <div className="mt-4 pt-4 border-t border-default-border/30">
              <span className="text-default-muted text-sm">{footerText}</span>
            </div>
          )}

          {/* Custom Background */}
          {renderBackground()}
        </div>
      )

    default:
      return null
  }
}

const BannerTerminal = ({
  repo,
  hideStars,
  hideForks,
  hideDescription,
  size,
  terminalFont = "standard",
  customName = "",
  hideAsciiBox = false,
  hideGitCommands = false,
  hideBackground = false,
  customWidth = 0,
  headerText,
  footerText,
  showContributors = false,
  contributorsLimit = 5,
  contributors = [],
}: {
  repo: any
  hideStars: boolean
  hideForks: boolean
  hideDescription: boolean
  size: string
  terminalFont?: string
  customName?: string
  hideAsciiBox?: boolean
  hideGitCommands?: boolean
  customWidth?: number
  hideBackground?: boolean
  headerText?: string
  footerText?: string
  showContributors?: boolean
  contributorsLimit?: number
  contributors?: any[]
}) => {
  const name = customName || repo.name || "unknown"
  const owner = repo.owner?.login || "unknown"
  const stars = repo.stargazers_count || 0
  const forks = repo.forks_count || 0
  const description = repo.description || "No description"

  const isHalfMode = size === "half"

  // Mapeamento de fontes figlet disponíveis
  const getFigletFont = (fontName: string) => {
    const fontMap: Record<string, string> = {
      alligator: "Alligator",
      "banner3-d": "Banner3-D",
      banner3: "Banner3",
      basic: "Basic",
      bell: "Bell",
      broadway: "Broadway",
      amc: "AMC 3 Line",
      "4max": "4Max",
      block: "Blocks",
      bubble: "Bubble",
      digital: "Digital",
      lean: "Lean",
      rectangles: "Rectangles",
      slant: "Slant",
      soft: "Soft",
      wicked: "Wicked",
      standard: "Standard",
      small: "Small",
    }

    return fontMap[fontName] || "Standard"
  }

  // Configuração inteligente baseada no modo
  const getFigletConfig = () => {
    const font = getFigletFont(terminalFont)
    const width = customWidth > 0 ? customWidth : isHalfMode ? 35 : 80

    if (isHalfMode) {
      return {
        font: font,
        width: width,
        horizontalLayout: "fitted" as const, // Ajusta para caber
        verticalLayout: "fitted" as const,
        whitespaceBreak: true,
      }
    } else {
      return {
        font: font,
        width: width,
        horizontalLayout: "fitted" as const, // Melhor distribuição
        verticalLayout: "default" as const,
        whitespaceBreak: true,
      }
    }
  }

  // Gerar ASCII art com figlet - versão simplificada e robusta
  const generateAsciiBanner = (repoName: string) => {
    const displayName = repoName.toUpperCase().slice(0, isHalfMode ? 12 : 25)

    // Tentar usar figlet primeiro
    try {
      const config = getFigletConfig()
      const asciiText = figlet.textSync(displayName, config)
      const lines = asciiText.split("\n").filter((line) => line.trim())

      if (lines.length > 0) {
        if (hideAsciiBox) {
          return lines.join("\n")
        }

        // Criar caixa ao redor
        const maxLineLength = Math.max(...lines.map((line) => line.length))
        const boxWidth = Math.max(maxLineLength + 4, isHalfMode ? 35 : 80)

        const borderTop = "╔" + "═".repeat(boxWidth - 2) + "╗"
        const borderBottom = "╚" + "═".repeat(boxWidth - 2) + "╝"
        const emptyLine = "║" + " ".repeat(boxWidth - 2) + "║"

        const centeredLines = lines.map((line) => {
          const padding = Math.max(0, Math.floor((boxWidth - 2 - line.length) / 2))
          return "║" + " ".repeat(padding) + line + " ".repeat(boxWidth - 2 - line.length - padding) + "║"
        })

        return [borderTop, emptyLine, ...centeredLines, emptyLine, borderBottom].join("\n")
      }
    } catch (error) {
      console.warn("Figlet failed, using simple text")
    }

    // Fallback: texto simples em caixa
    if (hideAsciiBox) {
      return displayName
    }

    const boxWidth = isHalfMode ? 25 : 50
    const padding = Math.max(0, Math.floor((boxWidth - 2 - displayName.length) / 2))

    return `╔${"═".repeat(boxWidth - 2)}╗
║${" ".repeat(boxWidth - 2)}║
║${" ".repeat(padding)}${displayName}${" ".repeat(boxWidth - 2 - padding - displayName.length)}║
║${" ".repeat(boxWidth - 2)}║
╚${"═".repeat(boxWidth - 2)}╝`
  }

  const asciiBanner = generateAsciiBanner(name)

  const statsLine =
    `📊 ${!hideStars ? `⭐ ${abbreviateNumber(stars)} ` : ""}${!hideForks ? `🍴 ${abbreviateNumber(forks)}` : ""}`.trim()
  const repoLine = `📁 ${owner}/${name}`
  const descLine = !hideDescription ? `💬 ${description}` : ""

  // Contributors section
  const renderContributors = () => {
    if (!showContributors || !contributors || contributors.length === 0) return null

    // Sort by contributions (assuming contributors have contributions field)
    const sortedContributors = [...contributors].sort((a, b) => (b.contributions || 0) - (a.contributions || 0))

    const topContributors = sortedContributors.slice(0, contributorsLimit || 5)
    const remaining = Math.max(0, contributors.length - (contributorsLimit || 5))

    return (
      <div className="mt-2">
        <span className="text-xs" style={{ color: "var(--terminal-color-default)" }}>
          Top Contributors:
        </span>
        <div className="ml-2 mt-1 space-y-0.5">
          {topContributors.map((contributor, index) => (
            <div key={contributor.login} className="text-xs" style={{ color: "var(--terminal-color-muted-light)" }}>
              <span style={{ color: "var(--terminal-color-muted)" }}>├─</span> {contributor.login}
              {contributor.contributions && (
                <span className="ml-2" style={{ color: "var(--terminal-color-highlight)" }}>
                  ({contributor.contributions})
                </span>
              )}
            </div>
          ))}
          {remaining > 0 && (
            <div className="text-xs" style={{ color: "var(--terminal-color-muted)" }}>
              <span style={{ color: "var(--terminal-color-muted)" }}>└─</span> +{remaining} more contributors
            </div>
          )}
        </div>
      </div>
    )
  }

  // Container responsivo - background controlado pelo PluginStyles.tsx
  const containerClasses = `font-mono px-2 ${isHalfMode ? "space-y-1 text-xs" : "space-y-2"}`

  return (
    <div
      className={containerClasses}
      style={{
        color: "var(--terminal-color-default)",
      }}
    >
      {/* ASCII Art Header com fonte configurável */}
      <div className="text-center">
        <pre
          className={`leading-tight whitespace-pre font-mono ${isHalfMode ? "text-xs" : "text-sm"}`}
          style={{
            color: "var(--terminal-color-default)",
            backgroundColor: hideBackground ? "transparent" : "var(--terminal-color-background)",
            padding: hideBackground ? "0" : "0.5rem",
            borderRadius: hideBackground ? "0" : "0.375rem",
            display: "inline-block",
            textAlign: "center",
            lineHeight: "1.2",
          }}
        >
          {asciiBanner}
        </pre>
      </div>

      {/* Terminal Commands */}
      {!hideGitCommands && (
        <div className={isHalfMode ? "space-y-1" : "space-y-1"}>
          <div className="terminal-command">
            <span className="terminal-prompt" style={{ color: "var(--terminal-color-highlight)" }}>
              $
            </span>
            <span className="terminal-command-text" style={{ color: "var(--terminal-color-default)" }}>
              git clone https://github.com/{owner}/{name}.git
            </span>
          </div>
          {!isHalfMode && (
            <div className="terminal-command">
              <span className="terminal-prompt" style={{ color: "var(--terminal-color-highlight)" }}>
                $
              </span>
              <span className="terminal-command-text" style={{ color: "var(--terminal-color-default)" }}>
                cd {name} && code .
              </span>
            </div>
          )}
        </div>
      )}

      {/* Repository Info - sem header para evitar TerminalHeader */}
      <div
        className={`border rounded p-2 ${hideBackground ? "bg-transparent" : ""} ${isHalfMode ? "p-1" : "p-3"}`}
        style={{
          borderColor: hideBackground ? "transparent" : "var(--terminal-color-muted)",
          backgroundColor: "transparent",
        }}
      >
        {(() => {
          const border = generateTerminalBorder({ title: "Repository Information", size: isHalfMode ? "half" : "full" })
          return (
            <>
              <div
                className={`font-bold mb-1 ${isHalfMode ? "text-xs" : "text-sm"}`}
                style={{ color: "var(--terminal-color-default)" }}
              >
                {border.top}
              </div>
              <div
                className={`space-y-2 ${isHalfMode ? "text-xs" : "text-sm"}`}
                style={{ color: "var(--terminal-color-default)" }}
              >
                <div>📊 {statsLine}</div>
                <div>📁 {repoLine}</div>
                {descLine && <div>{descLine}</div>}
              </div>
              <div
                className={`font-bold mt-1 ${isHalfMode ? "text-xs" : "text-sm"}`}
                style={{ color: "var(--terminal-color-default)" }}
              >
                {border.bottom}
              </div>
            </>
          )
        })()}
      </div>

      {/* Contributors in terminal */}
      {renderContributors() && (
        <div className={`${isHalfMode ? "text-xs" : "text-sm"}`} style={{ color: "var(--terminal-color-default)" }}>
          <span style={{ color: "var(--terminal-color-muted)" }}>└─</span>
          {renderContributors()}
        </div>
      )}

      {/* Status Indicators - only in full mode */}
      {!isHalfMode && (
        <div className="flex items-center gap-4 text-xs">
          <span
            style={{
              color: "var(--terminal-color-success)",
              backgroundColor: hideBackground ? "transparent" : "var(--terminal-color-background)",
            }}
          >
            ●
          </span>
          <span style={{ color: "var(--terminal-color-default)" }}>Ready to clone</span>
          <span
            style={{
              color: "var(--terminal-color-warning)",
              backgroundColor: hideBackground ? "transparent" : "var(--terminal-color-background)",
            }}
          >
            ●
          </span>
          <span style={{ color: "var(--terminal-color-muted-light)" }}>Public repository</span>
          <span
            style={{
              color: "var(--terminal-color-highlight)",
              backgroundColor: hideBackground ? "transparent" : "var(--terminal-color-background)",
            }}
          >
            ●
          </span>
          <span style={{ color: "var(--terminal-color-raw)" }}>MIT License</span>
        </div>
      )}
    </div>
  )
}
