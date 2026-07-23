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
    sections: ["repository_card"],
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

    if (!cfg.sections.includes("repository_card")) return 0

    if (isTerminal) {
      // TerminalCommand + TerminalGrid header + 1 row
      return 84 + 1 * 20
    }

    // Default style — fixed-height blocks regardless of actual content length:
    // header row + card padding
    let h = 40 + 24 // title (if shown, still budget for consistency) + card top padding

    const showDescription = cfg.show_description ?? true
    const showStats = cfg.show_stats ?? true
    const showTopics = cfg.show_topics ?? true

    // header row (name + language + license badges)
    h += 28
    // description: fixed 2-line block, always reserved when the toggle is on
    if (showDescription) h += 40
    // stats row (stars/forks/license)
    if (showStats) h += 24
    // topics row — single fixed-height row regardless of topic count (wraps within card)
    if (showTopics && repo.topics && repo.topics.length > 0) h += 32

    return h
  },
}

export default githubRepoPlugin
