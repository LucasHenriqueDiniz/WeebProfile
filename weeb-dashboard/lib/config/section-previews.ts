// Mapeamento de seções para previews de imagem
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Execute: pnpm generate-section-previews (in weeb-plugins)
//
// Este arquivo é gerado automaticamente a partir dos plugins em weeb-plugins
// e verifica quais previews existem (por estilo) na pasta previews/ de cada plugin.
// Os arquivos são copiados para weeb-dashboard/public/previews/ pelo mesmo script.

/** [width, height] of the preview SVG, or null when that style has no preview. */
export type PreviewSize = [width: number, height: number]

export const SECTION_PREVIEWS: Record<
  string,
  Record<string, { default: PreviewSize | null; terminal: PreviewSize | null }>
> = {
  "16personalities": {
    personality: { default: [415, 227], terminal: [415, 208] },
  },

  anilist: {
    statistics: { default: [415, 245], terminal: [415, 208] },
    favorites_anime: { default: [415, 189], terminal: [415, 148] },
    currently_watching: { default: [415, 253], terminal: [415, 108] },
  },

  codeforces: {
    rating_rank: { default: [415, 100], terminal: [415, 88] },
    contests_participated: { default: [415, 104], terminal: [415, 68] },
    problems_solved: { default: [415, 156], terminal: [415, 248] },
    recent_submissions: { default: [415, 235], terminal: [415, 96] },
  },

  codewars: {
    rank_honor: { default: [415, 100], terminal: [415, 88] },
    completed_kata: { default: [415, 343], terminal: [415, 128] },
    languages_proficiency: { default: [415, 343], terminal: [415, 128] },
    leaderboard_position: { default: [415, 100], terminal: [415, 78] },
  },

  devto: {
    profile: { default: [415, 117], terminal: [415, 128] },
    recent_articles: { default: [415, 217], terminal: [415, 108] },
    top_tags: { default: [415, 123], terminal: [415, 148] },
  },

  duolingo: {
    current_streak: { default: [415, 136], terminal: [415, 68] },
    total_xp: { default: [415, 164], terminal: [415, 68] },
    languages_learning: { default: [415, 235], terminal: [415, 96] },
  },

  github: {
    profile: { default: [415, 143], terminal: [415, 156] },
    activity: { default: [415, 180], terminal: [415, 256] },
    repositories: { default: [415, 156], terminal: [415, 236] },
    favorite_languages: { default: [415, 354], terminal: [415, 322] },
    favorite_license: { default: [415, 112], terminal: [415, 142] },
    calendar: { default: [415, 355], terminal: [415, 181] },
    code_habits: { default: [415, 634], terminal: [415, 1153] },
    starred_repositories: { default: [415, 1440], terminal: [415, 304] },
    gists: { default: [415, 456], terminal: [415, 136] },
    stargazers: { default: [415, 597], terminal: [415, 196] },
    top_repositories: { default: [415, 728], terminal: [415, 176] },
    star_lists: { default: [415, 380], terminal: [415, 116] },
    notable_contributions: { default: [415, 1172], terminal: [415, 276] },
    recent_activity: { default: [415, 1441], terminal: [415, 292] },
    introduction: { default: [415, 154], terminal: [415, 202] },
    featured_repositories: { default: [415, 458], terminal: [415, 136] },
    sponsorships: { default: [415, 272], terminal: [415, 136] },
    sponsors: { default: [415, 272], terminal: [415, 136] },
    people: { default: [415, 173], terminal: [415, 276] },
    repository_contributors: { default: [415, 375], terminal: [415, 276] },
  },

  github_repo: {
    banner: { default: [415, 184], terminal: [415, 94] },
    stats: { default: [415, 134], terminal: [415, 52] },
    star_graph: { default: [415, 228], terminal: [415, 153] },
    languages: { default: [415, 152], terminal: [415, 78] },
    topics: { default: [415, 110], terminal: [415, 44] },
    overview: { default: [415, 276], terminal: [415, 72] },
  },

  lastfm: {
    recent_tracks: { default: [415, 338], terminal: [415, 141] },
    statistics: { default: [415, 248], terminal: [415, 134] },
    top_artists: { default: [415, 315], terminal: [415, 275] },
    top_albums: { default: [415, 276], terminal: [415, 275] },
    top_tracks: { default: [415, 276], terminal: [415, 375] },
  },

  lyfta: {
    statistics: { default: [415, 156], terminal: [415, 115] },
    recent_workouts: { default: [415, 356], terminal: [415, 142] },
    exercises: { default: [415, 314], terminal: [415, 176] },
    overview: { default: [415, 245], terminal: [415, 136] },
    last_workout: { default: [415, 339], terminal: [415, 240] },
  },

  myanimelist: {
    statistics: { default: [415, 400], terminal: [415, 520] },
    last_activity: { default: [415, 534], terminal: [415, 532] },
    statistics_simple: { default: [415, 124], terminal: [415, 136] },
    anime_bar: { default: [415, 158], terminal: [415, 180] },
    manga_bar: { default: [415, 158], terminal: [415, 180] },
    anime_favorites: { default: [415, 680], terminal: [415, 583] },
    manga_favorites: { default: [415, 680], terminal: [415, 583] },
    character_favorites: { default: [415, 330], terminal: [415, 178] },
    people_favorites: { default: [415, 330], terminal: [415, 178] },
  },

  stackoverflow: {
    reputation: { default: [415, 104], terminal: [415, 68] },
    badges: { default: [415, 132], terminal: [415, 128] },
    answers_questions: { default: [415, 104], terminal: [415, 88] },
    tags_expertise: { default: [415, 343], terminal: [415, 128] },
  },

  steam: {
    statistics: { default: [415, 336], terminal: [415, 156] },
    recent_games: { default: [415, 384], terminal: [415, 156] },
    top_games: { default: [415, 464], terminal: [415, 176] },
  },

  websites: {
    websites: { default: [415, 496], terminal: [415, 162] },
  },
}

export function getSectionPreview(plugin: string, section: string, style: "default" | "terminal" = "default"): string | null {
  const info = SECTION_PREVIEWS[plugin]?.[section]
  if (!info) return null

  // Usa o estilo pedido se existir; senão cai para "default" (melhor que nada).
  const usableStyle = info[style] ? style : info.default ? "default" : null
  if (!usableStyle) return null

  return `/previews/${plugin}/${usableStyle}/${section}.svg`
}
