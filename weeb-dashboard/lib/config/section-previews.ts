// Mapeamento de seções para previews de imagem
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Execute: pnpm generate-section-previews (in weeb-plugins)
// 
// Este arquivo é gerado automaticamente a partir dos plugins em weeb-plugins
// e verifica quais previews existem na pasta previews/ de cada plugin

export const SECTION_PREVIEWS: Record<string, Record<string, string>> = {
  "16personalities": {
    personality: "16personalities/default/personality.svg",
  },

  codeforces: {
    rating_rank: "codeforces/default/rating_rank.svg",
    contests_participated: "codeforces/default/contests_participated.svg",
    problems_solved: "codeforces/default/problems_solved.svg",
    recent_submissions: "codeforces/default/recent_submissions.svg",
  },

  codewars: {
    rank_honor: "codewars/default/rank_honor.svg",
    completed_kata: "codewars/default/completed_kata.svg",
    languages_proficiency: "codewars/default/languages_proficiency.svg",
    leaderboard_position: "codewars/default/leaderboard_position.svg",
  },

  duolingo: {
    current_streak: "duolingo/default/current_streak.svg",
    total_xp: "duolingo/default/total_xp.svg",
    languages_learning: "duolingo/default/languages_learning.svg",
  },

  github: {
    profile: "github/default/profile.svg",
    activity: "github/default/activity.svg",
    repositories: "github/default/repositories.svg",
    favorite_languages: "github/default/favorite_languages.svg",
    favorite_license: "github/default/favorite_license.svg",
    calendar: "github/default/calendar.svg",
    code_habits: "github/default/code_habits.svg",
    starred_repositories: "github/default/starred_repositories.svg",
    gists: "github/default/gists.svg",
    stargazers: "github/default/stargazers.svg",
    top_repositories: "github/default/top_repositories.svg",
    star_lists: "github/default/star_lists.svg",
    notable_contributions: "github/default/notable_contributions.svg",
    recent_activity: "github/default/recent_activity.svg",
    introduction: "github/default/introduction.svg",
    featured_repositories: "github/default/featured_repositories.svg",
    sponsorships: "github/default/sponsorships.svg",
    sponsors: "github/default/sponsors.svg",
    people: "github/default/people.svg",
    repository_contributors: "github/default/repository_contributors.svg",
  },

  lastfm: {
    recent_tracks: "lastfm/default/recent_tracks.svg",
    statistics: "lastfm/default/statistics.svg",
    top_artists: "lastfm/default/top_artists.svg",
    top_albums: "lastfm/default/top_albums.svg",
    top_tracks: "lastfm/default/top_tracks.svg",
  },

  lyfta: {
    statistics: "lyfta/default/statistics.svg",
    recent_workouts: "lyfta/default/recent_workouts.svg",
    exercises: "lyfta/default/exercises.svg",
    overview: "lyfta/default/overview.svg",
    last_workout: "lyfta/default/last_workout.svg",
  },

  myanimelist: {
    statistics: "myanimelist/default/statistics.svg",
    last_activity: "myanimelist/default/last_activity.svg",
    statistics_simple: "myanimelist/default/statistics_simple.svg",
    anime_bar: "myanimelist/default/anime_bar.svg",
    manga_bar: "myanimelist/default/manga_bar.svg",
    anime_favorites: "myanimelist/default/anime_favorites.svg",
    manga_favorites: "myanimelist/default/manga_favorites.svg",
    character_favorites: "myanimelist/default/character_favorites.svg",
    people_favorites: "myanimelist/default/people_favorites.svg",
  },

  spotify: {
    recent_tracks: "spotify/default/recent_tracks.svg",
    top_artists: "spotify/default/top_artists.svg",
    top_tracks: "spotify/default/top_tracks.svg",
    currently_playing: "spotify/default/currently_playing.svg",
    playlists: "spotify/default/playlists.svg",
    profile: "spotify/default/profile.svg",
  },

  stackoverflow: {
    reputation: "stackoverflow/default/reputation.svg",
    badges: "stackoverflow/default/badges.svg",
    answers_questions: "stackoverflow/default/answers_questions.svg",
    tags_expertise: "stackoverflow/default/tags_expertise.svg",
  },

  steam: {
    statistics: "steam/default/statistics.svg",
    recent_games: "steam/default/recent_games.svg",
    top_games: "steam/default/top_games.svg",
  },
}

export function getSectionPreview(plugin: string, section: string, style: "default" | "terminal" = "default"): string | null {
  const pluginPreviews = SECTION_PREVIEWS[plugin]
  if (!pluginPreviews) return null

  // Sempre usar default, não importa o style
  const previewPath = pluginPreviews[section]
  if (!previewPath) return null

  // Usar rota API que serve previews do weeb-plugins
  return `/api/preview/${previewPath}`
}
