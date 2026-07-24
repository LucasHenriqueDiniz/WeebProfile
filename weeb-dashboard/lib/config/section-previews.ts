// Mapeamento de seções para previews de imagem
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Execute: pnpm generate-section-previews (in weeb-plugins)
//
// Este arquivo é gerado automaticamente a partir dos plugins em weeb-plugins
// e verifica quais previews existem (por estilo) na pasta previews/ de cada plugin.
// Os arquivos são copiados para weeb-dashboard/public/previews/ pelo mesmo script.

export const SECTION_PREVIEWS: Record<string, Record<string, { default: boolean; terminal: boolean }>> = {
  "16personalities": {
    personality: { default: true, terminal: true },
  },

  codeforces: {
    rating_rank: { default: true, terminal: true },
    contests_participated: { default: true, terminal: true },
    problems_solved: { default: true, terminal: true },
    recent_submissions: { default: true, terminal: true },
  },

  codewars: {
    rank_honor: { default: true, terminal: true },
    completed_kata: { default: true, terminal: true },
    languages_proficiency: { default: true, terminal: true },
    leaderboard_position: { default: true, terminal: true },
  },

  duolingo: {
    current_streak: { default: true, terminal: true },
    total_xp: { default: true, terminal: true },
    languages_learning: { default: true, terminal: true },
  },

  github: {
    profile: { default: true, terminal: true },
    activity: { default: true, terminal: true },
    repositories: { default: true, terminal: true },
    favorite_languages: { default: true, terminal: true },
    favorite_license: { default: true, terminal: true },
    calendar: { default: true, terminal: true },
    code_habits: { default: true, terminal: true },
    starred_repositories: { default: true, terminal: true },
    gists: { default: true, terminal: true },
    stargazers: { default: true, terminal: true },
    top_repositories: { default: true, terminal: true },
    star_lists: { default: true, terminal: true },
    notable_contributions: { default: true, terminal: true },
    recent_activity: { default: true, terminal: true },
    introduction: { default: true, terminal: true },
    featured_repositories: { default: true, terminal: true },
    sponsorships: { default: true, terminal: true },
    sponsors: { default: true, terminal: true },
    people: { default: true, terminal: true },
    repository_contributors: { default: true, terminal: true },
  },

  github_repo: {
    banner: { default: true, terminal: true },
    stats: { default: true, terminal: true },
    star_graph: { default: true, terminal: true },
    languages: { default: true, terminal: true },
    topics: { default: true, terminal: true },
  },

  lastfm: {
    recent_tracks: { default: true, terminal: true },
    statistics: { default: true, terminal: true },
    top_artists: { default: true, terminal: true },
    top_albums: { default: true, terminal: true },
    top_tracks: { default: true, terminal: true },
  },

  lyfta: {
    statistics: { default: true, terminal: true },
    recent_workouts: { default: true, terminal: true },
    exercises: { default: true, terminal: true },
    overview: { default: true, terminal: true },
    last_workout: { default: true, terminal: true },
  },

  myanimelist: {
    statistics: { default: true, terminal: true },
    last_activity: { default: true, terminal: true },
    statistics_simple: { default: true, terminal: true },
    anime_bar: { default: true, terminal: true },
    manga_bar: { default: true, terminal: true },
    anime_favorites: { default: true, terminal: true },
    manga_favorites: { default: true, terminal: true },
    character_favorites: { default: true, terminal: true },
    people_favorites: { default: true, terminal: true },
  },

  stackoverflow: {
    reputation: { default: true, terminal: true },
    badges: { default: true, terminal: true },
    answers_questions: { default: true, terminal: true },
    tags_expertise: { default: true, terminal: true },
  },

  steam: {
    statistics: { default: true, terminal: true },
    recent_games: { default: true, terminal: true },
    top_games: { default: true, terminal: true },
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
