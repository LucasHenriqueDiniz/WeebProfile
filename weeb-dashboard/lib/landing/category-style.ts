import type { PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"

// Identidade por categoria: rótulo, tile do ícone e o glow do hover. Uma entrada por
// categoria, cobrada pelo tipo: antes, categoria sem entrada caía no estilo de coding.
// Usada pela grade da landing e pela galeria de plugins, que tinha um mapa próprio só
// de rótulos e pintava Perfil, Treino e Idiomas de violeta.
// `sticker` is the solid pastel of the icon tile in the landing's sticker look.
export const CATEGORY_STYLE: Record<PluginCategory, { label: string; tile: string; hover: string; sticker: string }> = {
  coding: {
    sticker: "bg-violet-300",
    label: "text-violet-500 dark:text-violet-400",
    tile: "from-violet-500/20 to-violet-500/5 text-violet-500 dark:text-violet-400",
    hover: "hover:border-violet-500/50 hover:shadow-[0_10px_36px_-14px_rgba(139,92,246,0.5)]",
  },
  music: {
    sticker: "bg-pink-300",
    label: "text-pink-500",
    tile: "from-pink-500/20 to-pink-500/5 text-pink-500",
    hover: "hover:border-pink-500/50 hover:shadow-[0_10px_36px_-14px_rgba(236,72,153,0.5)]",
  },
  anime: {
    sticker: "bg-cyan-300",
    label: "text-cyan-500",
    tile: "from-cyan-500/20 to-cyan-500/5 text-cyan-500",
    hover: "hover:border-cyan-500/50 hover:shadow-[0_10px_36px_-14px_rgba(6,182,212,0.5)]",
  },
  gaming: {
    sticker: "bg-emerald-300",
    label: "text-emerald-500",
    tile: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
    hover: "hover:border-emerald-500/50 hover:shadow-[0_10px_36px_-14px_rgba(16,185,129,0.5)]",
  },
  profile: {
    sticker: "bg-sky-300",
    label: "text-sky-500",
    tile: "from-sky-500/20 to-sky-500/5 text-sky-500",
    hover: "hover:border-sky-500/50 hover:shadow-[0_10px_36px_-14px_rgba(14,165,233,0.5)]",
  },
  fitness: {
    sticker: "bg-orange-300",
    label: "text-orange-500",
    tile: "from-orange-500/20 to-orange-500/5 text-orange-500",
    hover: "hover:border-orange-500/50 hover:shadow-[0_10px_36px_-14px_rgba(249,115,22,0.5)]",
  },
  languages: {
    sticker: "bg-lime-300",
    label: "text-lime-600 dark:text-lime-400",
    tile: "from-lime-500/20 to-lime-500/5 text-lime-600 dark:text-lime-400",
    hover: "hover:border-lime-500/50 hover:shadow-[0_10px_36px_-14px_rgba(132,204,22,0.5)]",
  },
  repository: {
    sticker: "bg-amber-300",
    label: "text-amber-500",
    tile: "from-amber-500/20 to-amber-500/5 text-amber-500",
    hover: "hover:border-amber-500/50 hover:shadow-[0_10px_36px_-14px_rgba(245,158,11,0.5)]",
  },
}
