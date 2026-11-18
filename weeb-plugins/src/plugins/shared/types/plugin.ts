/**
 * Interface base para plugins
 *
 * Todos os plugins devem implementar esta interface
 */

import type React from "react"
import type { BasePluginConfig, EssentialPluginConfig } from "./base"
import type { PluginData } from "../../../types/index"

/**
 * Interface principal de um plugin
 *
 * @template TConfig - Tipo específico da configuração do plugin (deve estender BasePluginConfig)
 * @template TData - Tipo específico dos dados retornados pelo plugin
 */
export interface Plugin<TConfig extends BasePluginConfig = BasePluginConfig, TData extends PluginData = PluginData> {
  /** Nome único do plugin (ex: 'github', 'lastfm') */
  name: string

  /** Chaves de configuração essencial que este plugin requer (ex: ['apiKey'] para LastFM) */
  essentialConfigKeys: string[]

  /** Configuração padrão do plugin */
  config: TConfig

  /**
   * Função para buscar dados do plugin
   *
   * @param config - Configuração do plugin (inclui enabled, sections, nonEssential)
   * @param dev - Se true, retorna dados mock
   * @param essentialConfig - Configurações essenciais (API keys, tokens) vindas do perfil
   * @param previewMode - Se true, otimiza para preview (ex: não converte imagens para base64)
   * @returns Dados do plugin
   */
  fetchData: (
    config: TConfig,
    dev?: boolean,
    essentialConfig?: EssentialPluginConfig,
    previewMode?: boolean
  ) => Promise<TData>

  /**
   * Função para renderizar o plugin
   *
   * @param config - Configuração do plugin
   * @param data - Dados do plugin
   * @returns Componente React renderizado
   */
  render: (config: TConfig, data: TData) => React.ReactNode

  /**
   * Calcula a altura total do plugin renderizado em pixels.
   * Substitui a medição via browser (Playwright) permitindo deploy como Worker.
   * Deve retornar um upper-bound seguro — nunca cortar conteúdo.
   *
   * @param config - Configuração do plugin
   * @param data - Dados retornados por fetchData
   * @param size - Largura do card ('half' = 415px, 'full' = 830px)
   */
  calculateHeight: (config: TConfig, data: TData, size: "half" | "full") => number

  /**
   * One image per item, for a README that links each item on its own.
   *
   * A README shows a card as one <img>, and an image holds one link. Tiles laid side
   * by side, each inside its own <a href>, give every item its own click. They are
   * drawn from the same data as render, so fetchData runs once for the card and all
   * of its tiles. Optional: only plugins whose items each have a destination.
   */
  tiles?: (config: TConfig, data: TData) => PluginTile[]

  /**
   * Função opcional para validar configuração
   */
  validate?: (config: TConfig) => ValidationResult

  /**
   * CSS opcional específico do plugin
   * Será automaticamente carregado e injetado
   */
  styles?: string
}

/**
 * How a README lays a plugin's tiles out:
 * - "grid": the same size each, three to a row at a percentage width (websites).
 * - "inline": each at its own natural size, side by side and wrapping like text (link badges).
 */
export type TileLayout = "grid" | "inline"

/** One item of a card drawn on its own, at a fixed size (see Plugin.tiles). */
export interface PluginTile {
  /**
   * Where the tile's <a> goes in the README: an http(s) URL already through safeHref,
   * or a mailto: through safeLinkHref (utils/external-link.tsx).
   */
  href: string
  /** Alt text for the tile's <img>. */
  title: string
  element: React.ReactElement
  /**
   * The SVG's size. A "grid" plugin gives every tile the same, or a row in the README
   * is ragged; an "inline" one gives each its own width and the same height.
   */
  width: number
  height: number
  /** Absent means "grid". */
  layout?: TileLayout
}

/**
 * Resultado de validação de configuração
 */
export interface ValidationResult {
  valid: boolean
  errors?: string[]
}
