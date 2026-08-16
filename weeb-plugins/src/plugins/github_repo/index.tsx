/**
 * GitHub Repository Card Plugin
 *
 * Plugin para exibir um card com estatísticas de um único repositório do GitHub
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import {
  CONTENT_SIZE_SCALE,
  resolveBannerText,
  resolveBannerVariant,
  resolveLanguagesVariant,
  resolveStarGraphVariant,
  type GithubRepoConfig,
  type GithubRepoData,
} from "./types"
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
    // Mesmo fator aplicado visualmente pelo ScaledBox - a seção inteira (fonte, ícones,
    // gráfico, padding) escala junto, então a altura calculada precisa escalar igual.
    const scale = CONTENT_SIZE_SCALE[cfg.content_size ?? "md"]

    let h = 0

    if (cfg.sections.includes("banner")) {
      const variant = resolveBannerVariant(cfg.banner_variant)
      const showDescription = cfg.banner_show_description ?? true
      // Texto resolvido, não repo.description cru: uma descrição custom faz a linha
      // existir mesmo num repo sem descrição, e a altura precisa contar isso.
      const bannerText = resolveBannerText(cfg, repo)
      const hasDescription = showDescription && !!bannerText.description
      const hasEyebrow = bannerText.eyebrow !== null
      let sectionH = 0

      if (isTerminal) {
        // Custo cheio da seção medido no render real (Chromium): comando + linha do
        // nome = 50, descrição com line-clamp-2 = +44. No terminal cada seção carrega
        // seu espaçamento completo; o pad global do manager (+24) é compensado no fim.
        sectionH = 50 + (hasDescription ? 44 : 0)
      } else if (variant === "minimal") {
        sectionH = 24 + 68
      } else if (variant === "split") {
        sectionH = 24 + (hasDescription ? 120 : 88)
      } else if (variant === "display") {
        sectionH = 24 + 118
      } else if (variant === "centered") {
        const showAvatar = cfg.banner_show_avatar ?? true
        const showOwner = cfg.banner_show_owner ?? true
        sectionH = 24 + 106 + (showAvatar ? 50 : 0) + (showOwner || hasEyebrow ? 18 : 0) + (hasDescription ? 44 : 0)
      } else if (variant === "centered_dark") {
        const showOwner = cfg.banner_show_owner ?? true
        sectionH = 24 + 76 + (showOwner || hasEyebrow ? 19 : 0) + (hasDescription ? 49 : 0)
      } else if (variant === "centered_gradient") {
        sectionH = 24 + 100 + (hasDescription ? 46 : 0)
      } else if (variant === "dark") {
        sectionH = 24 + (hasDescription ? 92 : 76)
      } else {
        // hero
        sectionH = 24 + 96 + (hasDescription ? 40 : 0)
      }
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("stats")) {
      const statsVariant = cfg.stats_variant ?? "grid"
      let bodyHeight = 86
      if (statsVariant === "inline") bodyHeight = 48
      if (statsVariant === "sparkstats") bodyHeight = 110
      if (statsVariant === "featured") bodyHeight = 96
      const sectionH = isTerminal ? 52 : 24 + bodyHeight
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("star_graph") && repo.starHistory && repo.starHistory.length >= 2) {
      const variant = resolveStarGraphVariant(cfg.star_graph_variant)
      let bodyHeight = 180 // area/steps/dots: head + gráfico 110
      if (variant === "bars") bodyHeight = 180
      if (variant === "milestones") bodyHeight = 130
      if (variant === "sparkline") bodyHeight = 76
      const sectionH = isTerminal ? 153 : 24 + bodyHeight
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("languages") && repo.languages && repo.languages.length > 0) {
      const variant = resolveLanguagesVariant(cfg.languages_variant)
      const count = Math.min(cfg.max_languages ?? 5, repo.languages.length)
      let bodyHeight = 104
      if (variant === "bars") bodyHeight = 32 + count * 22
      if (variant === "donut") bodyHeight = 128
      if (variant === "blocks") bodyHeight = 118
      const sectionH = isTerminal ? 78 : 24 + bodyHeight
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("topics") && repo.topics && repo.topics.length > 0) {
      const variant = cfg.topics_variant ?? "chips"
      let bodyHeight = 62
      if (variant === "hash") bodyHeight = 56
      const sectionH = isTerminal ? 44 : 24 + bodyHeight
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("overview")) {
      const hasChart = repo.starHistory && repo.starHistory.length >= 2
      const sectionH = isTerminal ? 72 : 24 + (hasChart ? 228 : 130)
      h += Math.round(sectionH * scale)
    }

    if (isTerminal && h > 0) {
      // As constantes do terminal já incluem o espaçamento completo de cada seção -
      // desconta o pad global (+24) que o PluginManager soma no total.
      h -= 24
      // Header do terminal (janela com os três botões) é renderizado uma única vez
      // por SVG, fora do ScaledBox - 32px fixos, sem escalar, apenas quando visível.
      if (!(config as { hideTerminalHeader?: boolean }).hideTerminalHeader) {
        h += 32
      }
    }

    return h
  },
}

export default githubRepoPlugin
