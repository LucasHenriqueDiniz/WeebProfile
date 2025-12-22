// Mapeamento de seções para previews de imagem
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Execute: pnpm generate-section-previews (in weeb-plugins)
// 
// Este arquivo é gerado automaticamente a partir dos plugins em weeb-plugins
// e verifica quais previews existem na pasta previews/ de cada plugin

export const SECTION_PREVIEWS: Record<string, Record<string, string>> = {
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

  myanimelist: {
    statistics: "myanimelist/default/statistics.svg",
    last_activity: "myanimelist/default/last_activity.svg",
    statistics_simple: "myanimelist/default/statistics_simple.svg",
    anime_bar: "myanimelist/default/anime_bar.svg",
    manga_bar: "myanimelist/default/manga_bar.svg",
    anime_favorites: "myanimelist/default/anime_favorites.svg",
    manga_favorites: "myanimelist/default/manga_favorites.svg",
    people_favorites: "myanimelist/default/people_favorites.svg",
  },
}

export function getSectionPreview(plugin: string, section: string, style: "default" | "terminal" = "default"): string | null {
  const pluginPreviews = SECTION_PREVIEWS[plugin]
  if (!pluginPreviews) return null

  // Sempre usar default, não importa o style
  const previewPath = pluginPreviews[section]
  if (!previewPath) return null

  // Usar rota API para servir as imagens
  return `/api/section-preview/${previewPath}`
}
