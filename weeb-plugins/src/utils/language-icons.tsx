/**
 * Helper para obter ícones de linguagens de programação
 */

import React from 'react'
import { FaCode, FaJava, FaTerminal } from 'react-icons/fa'
import { SiJavascript, SiTypescript, SiPython, SiSharp, SiCplusplus, SiC, SiRust, SiGo, SiRuby, SiPhp, SiSwift, SiKotlin, SiDart, SiScala, SiHaskell, SiElixir, SiClojure, SiLua, SiR, SiHtml5, SiCss3, SiSass, SiLess, SiPowers, SiDocker, SiYaml, SiJson, SiXml, SiMarkdown, SiVuedotjs, SiReact, SiAngular, SiNodedotjs } from 'react-icons/si'
import type { IconType } from 'react-icons'

// Mapeamento de nomes de linguagens para ícones
// Usando react-icons simples por enquanto, pode ser expandido para devicons no futuro
const LANGUAGE_ICONS: Record<string, IconType> = {
  // Linguagens comuns
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  java: FaJava,
  csharp: SiSharp,
  'c#': SiSharp,
  cpp: SiCplusplus,
  'c++': SiCplusplus,
  c: SiC,
  rust: SiRust,
  go: SiGo,
  ruby: SiRuby,
  php: SiPhp,
  swift: SiSwift,
  kotlin: SiKotlin,
  dart: SiDart,
  scala: SiScala,
  haskell: SiHaskell,
  elixir: SiElixir,
  clojure: SiClojure,
  lua: SiLua,
  r: SiR,
  matlab: FaCode,
  sql: FaCode,
  html: SiHtml5,
  css: SiCss3,
  scss: SiSass,
  sass: SiSass,
  less: SiLess,
  shell: FaTerminal,
  bash: FaTerminal,
  powershell: SiPowers,
  docker: SiDocker,
  yaml: SiYaml,
  json: SiJson,
  xml: SiXml,
  markdown: SiMarkdown,
  vue: SiVuedotjs,
  react: SiReact,
  angular: SiAngular,
  nodejs: SiNodedotjs,
  'node.js': SiNodedotjs,
  // Tags do Stack Overflow (ferramentas/frameworks)
  bison: FaCode,
  'flex-lexer': FaCode,
  lex: FaCode,
}

/**
 * Obtém o ícone de uma linguagem ou retorna um ícone padrão
 */
export function getLanguageIcon(languageName: string): IconType {
  const normalized = languageName.toLowerCase().trim()
  return LANGUAGE_ICONS[normalized] || FaCode
}

/**
 * Capitaliza o nome da linguagem (primeira letra maiúscula)
 */
export function capitalizeLanguage(languageName: string): string {
  return languageName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_')
}


