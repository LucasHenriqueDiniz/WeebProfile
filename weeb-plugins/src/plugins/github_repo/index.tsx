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
    sections: ["banner", "insights"],
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
      const showDescription = cfg.banner_show_description ?? true
      if (isTerminal) {
        // TerminalCommand + name line + description line
        h += 84 + 24 + (showDescription && repo.description ? 24 : 0)
      } else {
        // avatar/name row + border
        h += 24 + 68
        // description block (border-top + 2-line text)
        if (showDescription && repo.description) h += 56
      }
    }

    if (cfg.sections.includes("insights")) {
      const showGraph = cfg.insights_show_star_graph ?? true
      const showLanguages = cfg.insights_show_languages ?? true
      const showTopics = cfg.insights_show_topics ?? true
      const hideTitle = cfg.insights_hide_title ?? false

      if (isTerminal) {
        h += 84 // TerminalCommand
        h += 28 // stars/forks line
        if (showGraph && repo.starHistory && repo.starHistory.length >= 2) h += 64
        if (showLanguages && repo.languages && repo.languages.length > 0) h += 40
      } else {
        h += 24 // card top padding
        if (!hideTitle) h += 40 // DefaultTitle
        h += 24 + 44 // card padding + stars/forks row
        if (showGraph && repo.starHistory && repo.starHistory.length >= 2) h += 64
        if (showLanguages && repo.languages && repo.languages.length > 0) h += 40
        if (showTopics && repo.topics && repo.topics.length > 0) h += 32
      }
    }

    return h
  },
}

export default githubRepoPlugin
