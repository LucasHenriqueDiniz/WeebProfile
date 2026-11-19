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
    personality: { default: [415, 217], terminal: [415, 198] },
  },

  about: {
    neofetch: { default: [415, 243], terminal: [415, 298] },
    links: { default: [415, 120], terminal: [415, 144] },
  },

  anilist: {
    statistics: { default: [415, 274], terminal: [415, 208] },
    favorites_anime: { default: [415, 194], terminal: [415, 128] },
    currently_watching: { default: [415, 258], terminal: [415, 108] },
  },

  codeforces: {
    rating_rank: { default: [415, 98], terminal: [415, 88] },
    contests_participated: { default: [415, 102], terminal: [415, 68] },
    problems_solved: { default: [415, 154], terminal: [415, 248] },
    recent_submissions: { default: [415, 232], terminal: [415, 96] },
  },

  codewars: {
    rank_honor: { default: [415, 98], terminal: [415, 88] },
    completed_kata: { default: [415, 340], terminal: [415, 128] },
    languages_proficiency: { default: [415, 340], terminal: [415, 128] },
    leaderboard_position: { default: [415, 122], terminal: [415, 68] },
  },

  devto: {
    profile: { default: [415, 130], terminal: [415, 128] },
    recent_articles: { default: [415, 198], terminal: [415, 108] },
    top_tags: { default: [415, 128], terminal: [415, 148] },
  },

  duolingo: {
    current_streak: { default: [415, 136], terminal: [415, 68] },
    total_xp: { default: [415, 162], terminal: [415, 68] },
    languages_learning: { default: [415, 232], terminal: [415, 96] },
  },

  github: {
    profile: { default: [415, 143], terminal: [415, 156] },
    activity: { default: [415, 180], terminal: [415, 256] },
    repositories: { default: [415, 156], terminal: [415, 236] },
    favorite_languages: { default: [415, 354], terminal: [415, 316] },
    favorite_license: { default: [415, 112], terminal: [415, 135] },
    calendar: { default: [415, 347], terminal: [415, 181] },
    code_habits: { default: [415, 628], terminal: [415, 1136] },
    starred_repositories: { default: [415, 1440], terminal: [415, 304] },
    gists: { default: [415, 456], terminal: [415, 136] },
    stargazers: { default: [415, 593], terminal: [415, 196] },
    top_repositories: { default: [415, 728], terminal: [415, 176] },
    star_lists: { default: [415, 380], terminal: [415, 116] },
    notable_contributions: { default: [415, 1172], terminal: [415, 276] },
    recent_activity: { default: [415, 1436], terminal: [415, 292] },
    introduction: { default: [415, 152], terminal: [415, 200] },
    featured_repositories: { default: [415, 456], terminal: [415, 136] },
    sponsorships: { default: [415, 272], terminal: [415, 136] },
    sponsors: { default: [415, 272], terminal: [415, 136] },
    people: { default: [415, 152], terminal: [415, 276] },
    repository_contributors: { default: [415, 372], terminal: [415, 276] },
  },

  github_repo: {
    banner: { default: [415, 161], terminal: [415, 94] },
    stats: { default: [415, 103], terminal: [415, 52] },
    star_graph: { default: [415, 210], terminal: [415, 153] },
    languages: { default: [415, 120], terminal: [415, 78] },
    topics: { default: [415, 120], terminal: [415, 44] },
    overview: { default: [415, 250], terminal: [415, 52] },
  },

  lastfm: {
    recent_tracks: { default: [415, 338], terminal: [415, 136] },
    statistics: { default: [415, 248], terminal: [415, 134] },
    top_artists: { default: [415, 276], terminal: [415, 275] },
    top_albums: { default: [415, 276], terminal: [415, 275] },
    top_tracks: { default: [415, 276], terminal: [415, 375] },
  },

  lyfta: {
    statistics: { default: [415, 236], terminal: [415, 176] },
    recent_workouts: { default: [415, 316], terminal: [415, 156] },
    exercises: { default: [415, 292], terminal: [415, 156] },
    overview: { default: [415, 192], terminal: [415, 136] },
    last_workout: { default: [415, 388], terminal: [415, 236] },
  },

  myanimelist: {
    statistics: { default: [415, 400], terminal: [415, 520] },
    last_activity: { default: [415, 534], terminal: [415, 504] },
    statistics_simple: { default: [415, 124], terminal: [415, 136] },
    anime_bar: { default: [415, 158], terminal: [415, 175] },
    manga_bar: { default: [415, 158], terminal: [415, 175] },
    anime_favorites: { default: [415, 680], terminal: [415, 556] },
    manga_favorites: { default: [415, 680], terminal: [415, 556] },
    character_favorites: { default: [415, 330], terminal: [415, 152] },
    people_favorites: { default: [415, 330], terminal: [415, 152] },
  },

  stackoverflow: {
    reputation: { default: [415, 102], terminal: [415, 68] },
    badges: { default: [415, 130], terminal: [415, 128] },
    answers_questions: { default: [415, 102], terminal: [415, 88] },
    tags_expertise: { default: [415, 340], terminal: [415, 128] },
  },

  steam: {
    statistics: { default: [415, 334], terminal: [415, 156] },
    recent_games: { default: [415, 384], terminal: [415, 156] },
    top_games: { default: [415, 464], terminal: [415, 176] },
  },

  websites: {
    websites: { default: [415, 481], terminal: [415, 152] },
  },

  wow_forever: {
    character: { default: [415, 232], terminal: [415, 244] },
    equipment: { default: [415, 432], terminal: [415, 364] },
    stats: { default: [415, 176], terminal: [415, 144] },
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
