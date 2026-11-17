import { wrappedLineCount } from "../../utils/text-lines"
import { resolveBannerText, resolveBannerVariant } from "./types"
import type { GithubRepoConfig, GithubRepoData } from "./types"

/**
 * Height of the banner section, at content size md, before `content_size` scales it.
 *
 * Every constant is the section's height in Chrome 158, measured 17/11/2026 the way
 * `pnpm --filter @weeb/svg-generator audit:heights` measures it (renderPlugins, theme CSS,
 * no terminal header), for each variant with and without avatar, owner line, custom label
 * and a description of 0, 1 and 2 lines. The browser rounds the total up, so the parts keep
 * their fractions (a 13px line at `leading-[1.55]` is 20.15px) and the caller rounds once.
 *
 * Until 11/2026 each default variant added 24px to its height on top of the 24px the
 * PluginManager adds to every card, and counted 2 description lines whatever the text: a
 * banner with a one-line description had 43 to 67px of blank under it. The terminal counted
 * 2 lines too, 20px of blank for a short description.
 *
 * The description wraps by `wrappedLineCount`, at the width its box has in each variant.
 */
export function bannerHeight(cfg: GithubRepoConfig, repo: GithubRepoData, isTerminal: boolean, width: number): number {
  const showDescription = cfg.banner_show_description ?? true
  const showAvatar = cfg.banner_show_avatar ?? true
  const showOwner = cfg.banner_show_owner ?? true
  // The resolved text, not repo.description: a custom description draws the line even for
  // a repository with none.
  const text = resolveBannerText(cfg, repo)
  const description = showDescription ? (text.description ?? "") : ""
  // centered and centered_dark draw the label line for a custom label even with the owner off.
  const showLabel = text.eyebrow !== null || showOwner

  const lines = (fontSize: number, maxWidth: number, font: "poppins" | "mono" = "poppins") =>
    wrappedLineCount(description, { fontSize, maxWidth, maxLines: 2, font })

  if (isTerminal) {
    // Command and name line; the description is 14px monospace in a box with 4px of padding
    // each side, 20px a line, plus 4px under it.
    const n = lines(14, width - 8, "mono")
    return 50 + (n > 0 ? 4 + 20 * n : 0)
  }

  // Card border (1px each side) and horizontal padding (18px each side).
  const inner = width - 38

  switch (resolveBannerVariant(cfg.banner_variant)) {
    case "minimal":
      // One row: the 40px avatar, or the name with a truncated description under it.
      return showAvatar ? 68 : description ? 63 : 47
    case "split": {
      // The star panel takes 132px; the description is 12px, 18px a line.
      const n = lines(12, inner - 146)
      return 82 + (n > 0 ? 6 + 18 * n : 0)
    }
    case "display":
      // Label, giant title and meta row; no description.
      return 112
    case "centered": {
      // 48px avatar, label line, 13px description at most 320px wide.
      const n = lines(13, Math.min(320, inner))
      return 100.5 + (showAvatar ? 50 : 0) + (showLabel ? (showAvatar ? 26 : 18) : 0) + (n > 0 ? 6 + 20.15 * n : 0)
    }
    case "centered_dark": {
      // 24px of padding each side; 12.5px description at most 300px wide, 9px gaps.
      const n = lines(12.5, Math.min(300, width - 50))
      return 75.75 + (showLabel ? 25 : 0) + (n > 0 ? 9 + 18.75 * n : 0)
    }
    case "centered_gradient": {
      const n = lines(12.5, Math.min(310, width - 50))
      return 112.75 + (n > 0 ? 8 + 18.75 * n : 0)
    }
    case "dark":
      // The description is truncated to one line.
      return 60 + (description ? 20 : 0)
    case "hero":
    default: {
      // 44px avatar and its 14px gap sit left of the text.
      const n = lines(13, inner - 14 - (showAvatar ? 58 : 0))
      return 90.5 + (n > 0 ? 6 + 20.15 * n : 0)
    }
  }
}
