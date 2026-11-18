/**
 * GitHub Repository Card Plugin
 *
 * Plugin para exibir um card com estatísticas de um único repositório do GitHub
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import { CONTENT_SIZE_SCALE, type GithubRepoConfig, type GithubRepoData } from "./types"
import { bannerHeight } from "./banner-height"
import { languagesHeight, overviewHeight, starGraphHeight, statsHeight, topicsHeight } from "./section-heights"
import { RenderGithubRepo } from "./components/RenderGithubRepo"
import { fetchGithubRepoData } from "./services/fetchGithubRepo"

export const githubRepoPlugin: Plugin<PluginConfig & GithubRepoConfig, PluginData & GithubRepoData> = {
  name: "github_repo",
  essentialConfigKeys: ["pat"], // Shared with the "github" plugin's PAT via alias resolution
  config: {
    enabled: false,
    // Repositório é um item único, não uma pilha de seções como o Profile - "sections"
    // sempre tem no máximo 1 entrada (ver types.ts).
    sections: ["banner"],
    owner: "",
    repo: "",
  } as PluginConfig & GithubRepoConfig,
  fetchData: async (config: PluginConfig & GithubRepoConfig, dev = false, essentialConfig?: EssentialPluginConfig) => {
    const pat = essentialConfig?.pat
    if (!dev && !pat) {
      throw new Error("GitHub Classic Token is required. Please configure it in your profile settings.")
    }
    return (await fetchGithubRepoData(config as GithubRepoConfig, dev, pat)) as PluginData & GithubRepoData
  },
  render: (config: PluginConfig & GithubRepoConfig, data: PluginData & GithubRepoData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return (
      <RenderGithubRepo config={config as GithubRepoConfig} data={data as GithubRepoData} style={style} size={size} />
    )
  },
  calculateHeight: (config, data, size = "half") => {
    const cfg = config as GithubRepoConfig
    const repo = data as GithubRepoData
    const isTerminal = (config as { style?: string }).style === "terminal"
    // ScaledBox zooms the whole section (font, icons, chart, padding): its text wraps in the
    // width divided by the scale, and the height scales and rounds up once.
    const scale = CONTENT_SIZE_SCALE[cfg.content_size ?? "md"]
    const card = size === "full" ? 830 : 415
    const scaled = (height: number) => Math.ceil(height * scale)
    // The default style's section pads 8px each side outside the zoom; the terminal's does not.
    const width = (isTerminal ? card : card - 16) / scale

    // A card holds one section (see types.ts); the sum keeps an old multi-section config honest.
    let h = 0
    if (cfg.sections.includes("banner")) h += scaled(bannerHeight(cfg, repo, isTerminal, card / scale))
    if (cfg.sections.includes("stats")) h += scaled(statsHeight(cfg, repo, isTerminal, width, scale))
    if (cfg.sections.includes("star_graph")) h += scaled(starGraphHeight(cfg, repo, isTerminal))
    if (cfg.sections.includes("languages")) h += scaled(languagesHeight(cfg, repo, isTerminal, width, scale))
    if (cfg.sections.includes("topics")) h += scaled(topicsHeight(cfg, repo, isTerminal, width, scale))
    if (cfg.sections.includes("overview")) h += scaled(overviewHeight(repo, isTerminal, width, scale))

    if (isTerminal && h > 0) {
      // The terminal heights are the whole section: take back the 24px the PluginManager adds.
      // At least 1px: the manager drops a card of 0 or less, and the command alone at sm is 23px.
      h = Math.max(1, h - 24)
      // The terminal header is counted once per SVG by generateSvg, not here.
    }

    return h
  },
}

export default githubRepoPlugin
