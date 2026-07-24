/**
 * GitHub Repository Card Plugin
 *
 * Plugin para exibir um card com estatísticas de um único repositório do GitHub
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import type { GithubRepoConfig, GithubRepoData } from "./types"
import { RenderGithubRepo } from "./components/RenderGithubRepo"
import { fetchGithubRepoData } from "./services/fetchGithubRepo"

export const githubRepoPlugin: Plugin<PluginConfig & GithubRepoConfig, PluginData & GithubRepoData> = {
  name: "github_repo",
  essentialConfigKeys: ["pat"], // Shared with the "github" plugin's PAT via alias resolution
  config: {
    enabled: false,
    sections: ["banner", "stats", "star_graph", "languages", "topics"],
    owner: "",
    repo: "",
  } as PluginConfig & GithubRepoConfig,
  fetchData: async (
    config: PluginConfig & GithubRepoConfig,
    dev = false,
    essentialConfig?: EssentialPluginConfig
  ) => {
    const pat = essentialConfig?.pat
    if (!dev && !pat) {
      throw new Error("GitHub Classic Token is required. Please configure it in your profile settings.")
    }
    return (await fetchGithubRepoData(config as GithubRepoConfig, dev, pat)) as PluginData & GithubRepoData
  },
  render: (config: PluginConfig & GithubRepoConfig, data: PluginData & GithubRepoData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderGithubRepo config={config as GithubRepoConfig} data={data as GithubRepoData} style={style} size={size} />
  },
  calculateHeight: (config, data, size = "half") => {
    const cfg = config as GithubRepoConfig
    const repo = data as GithubRepoData
    const isTerminal = (config as { style?: string }).style === "terminal"

    let h = 0

    if (cfg.sections.includes("banner")) {
      const variant = cfg.banner_variant ?? "large"
      const showDescription = cfg.banner_show_description ?? true
      const hasDescription = showDescription && !!repo.description

      if (isTerminal) {
        // TerminalCommand + name line + (description line, unless compact)
        h += 84 + 24 + (hasDescription && variant !== "compact" ? 24 : 0)
      } else if (variant === "minimal") {
        h += 24 + (hasDescription ? 48 : 24)
      } else if (variant === "compact") {
        h += 24 + 44
      } else {
        // large: avatar/name row + border, + description block (border-top + 2-line text)
        h += 24 + 68
        if (hasDescription) h += 56
      }
    }

    if (cfg.sections.includes("stats")) {
      const hideTitle = cfg.stats_hide_title ?? false
      h += isTerminal ? 84 + 28 : 24 + (hideTitle ? 0 : 40) + 72
    }

    if (cfg.sections.includes("star_graph") && repo.starHistory && repo.starHistory.length >= 2) {
      const hideTitle = cfg.star_graph_hide_title ?? false
      h += isTerminal ? 84 + 64 : 24 + (hideTitle ? 0 : 40) + 88
    }

    if (cfg.sections.includes("languages") && repo.languages && repo.languages.length > 0) {
      const hideTitle = cfg.languages_hide_title ?? false
      h += isTerminal ? 84 + 40 : 24 + (hideTitle ? 0 : 40) + 64
    }

    if (cfg.sections.includes("topics") && repo.topics && repo.topics.length > 0) {
      const hideTitle = cfg.topics_hide_title ?? false
      h += isTerminal ? 84 + 32 : 24 + (hideTitle ? 0 : 40) + 56
    }

    return h
  },
}

export default githubRepoPlugin
