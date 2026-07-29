/**
 * GitHub Repository Card Plugin
 *
 * Plugin para exibir um card com estatísticas de um único repositório do GitHub
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import { CONTENT_SIZE_SCALE, resolveBannerVariant, type GithubRepoConfig, type GithubRepoData } from "./types"
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
    // Mesmo fator aplicado visualmente pelo ScaledBox - a seção inteira (fonte, ícones,
    // gráfico, padding) escala junto, então a altura calculada precisa escalar igual.
    const scale = CONTENT_SIZE_SCALE[cfg.content_size ?? "md"]

    let h = 0

    if (cfg.sections.includes("banner")) {
      const variant = resolveBannerVariant(cfg.banner_variant)
      const showDescription = cfg.banner_show_description ?? true
      const hasDescription = showDescription && !!repo.description
      let sectionH = 0

      if (isTerminal) {
        // Custo cheio da seção medido no render real (Chromium): comando + linha do
        // nome = 50, descrição com line-clamp-2 = +44. No terminal cada seção carrega
        // seu espaçamento completo; o pad global do manager (+24) é compensado no fim.
        sectionH = 50 + (hasDescription ? 44 : 0)
      } else if (variant === "minimal") {
        sectionH = 24 + (hasDescription ? 48 : 24)
      } else if (variant === "clean") {
        const showLanguages = cfg.banner_show_languages ?? true
        const hasLanguages = showLanguages && repo.languages && repo.languages.length > 0
        sectionH = 24 + 48 + (hasDescription ? 16 : 0) + (hasLanguages ? 20 : 0)
      } else if (variant === "editorial" || variant === "aurora" || variant === "blueprint") {
        // Header row + optional description line + optional tech row - similar shape
        // across these variants (single card, no separate description block).
        const showLanguages = cfg.banner_show_languages ?? true
        const hasLanguages = showLanguages && repo.languages && repo.languages.length > 0
        sectionH = 24 + 60 + (hasDescription ? 20 : 0) + (hasLanguages ? 24 : 0)
      } else if (variant === "split") {
        sectionH = 24 + 100
      } else if (variant === "ribbon") {
        sectionH = 24 + 70 + (hasDescription ? 16 : 0) + 34
      } else if (variant === "social") {
        sectionH = 24 + 110
      } else if (variant === "hero") {
        // avatar/nome grandes + padding generoso (p-6) + descrição maior + linha de stats/techs
        sectionH = 24 + 24 + 64 + (hasDescription ? 44 : 0) + 44
      } else {
        // large: avatar/name row + border, + description block (border-top + 2-line text)
        sectionH = 24 + 68
        if (hasDescription) sectionH += 56
      }
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("stats")) {
      const hideTitle = cfg.stats_hide_title ?? false
      const statsVariant = cfg.stats_variant ?? "inline"
      const bodyHeight = statsVariant === "grid" ? 76 : 40
      const sectionH = isTerminal ? 52 : 24 + (hideTitle ? 0 : 40) + bodyHeight
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("star_graph") && repo.starHistory && repo.starHistory.length >= 2) {
      const hideTitle = cfg.star_graph_hide_title ?? false
      // Corpo do gráfico é fixo em 120 (baseline "md") - o content_size escala isso
      // junto com o resto via ScaledBox, sem precisar de um controle de altura separado.
      const chartHeight = 120
      const sectionH = isTerminal ? chartHeight + 33 : 24 + (hideTitle ? 0 : 40) + chartHeight + 32
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("languages") && repo.languages && repo.languages.length > 0) {
      const hideTitle = cfg.languages_hide_title ?? false
      const languagesVariant = cfg.languages_variant ?? "bars"
      const bodyHeight = languagesVariant === "badges" ? 28 : 32
      const sectionH = isTerminal ? 76 : 24 + (hideTitle ? 0 : 40) + bodyHeight
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("topics") && repo.topics && repo.topics.length > 0) {
      const hideTitle = cfg.topics_hide_title ?? false
      const sectionH = isTerminal ? 74 : 24 + (hideTitle ? 0 : 40) + 24
      h += Math.round(sectionH * scale)
    }

    if (cfg.sections.includes("overview")) {
      const sectionH = isTerminal ? 72 : 24 + 220
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
