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
      } else if (variant === "clean") {
        const showLanguages = cfg.banner_show_languages ?? true
        const hasLanguages = showLanguages && repo.languages && repo.languages.length > 0
        h += 24 + 48 + (hasDescription ? 16 : 0) + (hasLanguages ? 20 : 0)
      } else if (variant === "editorial" || variant === "mono" || variant === "aurora" || variant === "blueprint") {
        // Header row + optional description line + optional tech row - similar shape
        // across these variants (single card, no separate description block).
        const showLanguages = cfg.banner_show_languages ?? true
        const hasLanguages = showLanguages && repo.languages && repo.languages.length > 0
        h += 24 + 60 + (hasDescription ? 20 : 0) + (hasLanguages ? 24 : 0)
      } else if (variant === "bold") {
        h += 24 + 84 + (hasDescription ? 16 : 0)
      } else if (variant === "split") {
        h += 24 + 100
      } else if (variant === "ribbon") {
        h += 24 + 70 + (hasDescription ? 16 : 0) + 34
      } else if (variant === "social") {
        h += 24 + 110
      } else if (variant === "hero") {
        // avatar/nome grandes + padding generoso (p-6) + descrição maior + linha de stats/techs
        h += 24 + 24 + 64 + (hasDescription ? 44 : 0) + 44
      } else {
        // large: avatar/name row + border, + description block (border-top + 2-line text)
        h += 24 + 68
        if (hasDescription) h += 56
      }
      h += cfg.banner_height ?? 0
    }

    if (cfg.sections.includes("stats")) {
      const hideTitle = cfg.stats_hide_title ?? false
      const statsVariant = cfg.stats_variant ?? "inline"
      const bodyHeight = statsVariant === "grid" ? 76 : 40
      h += isTerminal ? 84 + 28 : 24 + (hideTitle ? 0 : 40) + bodyHeight
      h += cfg.stats_height ?? 0
    }

    if (cfg.sections.includes("star_graph") && repo.starHistory && repo.starHistory.length >= 2) {
      const hideTitle = cfg.star_graph_hide_title ?? false
      // Corpo do gráfico é configurável (star_graph_chart_height) - a caixa em volta
      // soma padding (p-4 = 32) ao tamanho real do SVG.
      const chartHeight = cfg.star_graph_chart_height ?? 120
      h += isTerminal ? 84 + chartHeight + 8 : 24 + (hideTitle ? 0 : 40) + chartHeight + 32
      h += cfg.star_graph_height ?? 0
    }

    if (cfg.sections.includes("languages") && repo.languages && repo.languages.length > 0) {
      const hideTitle = cfg.languages_hide_title ?? false
      const languagesVariant = cfg.languages_variant ?? "bars"
      const bodyHeight = languagesVariant === "badges" ? 28 : 32
      h += isTerminal ? 84 + 40 : 24 + (hideTitle ? 0 : 40) + bodyHeight
      h += cfg.languages_height ?? 0
    }

    if (cfg.sections.includes("topics") && repo.topics && repo.topics.length > 0) {
      const hideTitle = cfg.topics_hide_title ?? false
      h += isTerminal ? 84 + 32 : 24 + (hideTitle ? 0 : 40) + 24
      h += cfg.topics_height ?? 0
    }

    if (cfg.sections.includes("overview")) {
      h += isTerminal ? 84 + 24 : 24 + 220
      h += cfg.overview_height ?? 0
    }

    return h
  },
}

export default githubRepoPlugin
