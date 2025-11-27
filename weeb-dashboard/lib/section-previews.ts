// Mapeamento de seções para previews de imagem
// Baseado em: source/plugins/{plugin}/assets/{style}/{section}.svg

export const SECTION_PREVIEWS: Record<string, Record<string, string>> = {
  github: {
    profile: "/section-previews/github/default/profile.svg",
    repositories: "/section-previews/github/default/repositories.svg",
    favorite_languages: "/section-previews/github/default/favorite_languages.svg",
    favorite_license: "/section-previews/github/default/favorite_license.svg",
    activity: "/section-previews/github/default/activity.svg",
    calendar: "/section-previews/github/default/calendar.svg",
    code_habits: "/section-previews/github/default/code_habits.svg",
  },
  lastfm: {
    recent_tracks: "/section-previews/lastfm/default/recent_tracks.svg",
    statistics: "/section-previews/lastfm/default/statistics.svg",
    top_artists: "/section-previews/lastfm/default/top_artists_default.svg", // Usa preview padrão, style é configurável
    top_albums: "/section-previews/lastfm/default/top_albums_default.svg", // Usa preview padrão, style é configurável
    top_tracks: "/section-previews/lastfm/default/top_tracks_default.svg", // Usa preview padrão, style é configurável
  },
  myanimelist: {
    statistics: "/section-previews/myanimelist/default/statistics.svg",
    anime_bar: "/section-previews/myanimelist/default/anime_bar.svg",
    manga_bar: "/section-previews/myanimelist/default/manga_bar.svg",
    statistics_simple: "/section-previews/myanimelist/default/statistics_simple.svg",
    anime_simple_favorites: "/section-previews/myanimelist/default/anime_simple_favorites.svg",
    manga_simple_favorites: "/section-previews/myanimelist/default/manga_simple_favorites.svg",
    people_simple_favorites: "/section-previews/myanimelist/default/people_simple_favorites.svg",
    character_simple_favorites: "/section-previews/myanimelist/default/character_simple_favorites.svg",
    anime_favorites: "/section-previews/myanimelist/default/anime_favorites.svg",
    manga_favorites: "/section-previews/myanimelist/default/manga_favorites.svg",
    people_favorites: "/section-previews/myanimelist/default/people_favorites.svg",
    character_favorites: "/section-previews/myanimelist/default/character_favorites.svg",
    last_activity: "/section-previews/myanimelist/default/last_activity.svg",
  },
}

export function getSectionPreview(plugin: string, section: string, style: "default" | "terminal" = "default"): string | null {
  const pluginPreviews = SECTION_PREVIEWS[plugin]
  if (!pluginPreviews) return null

  // Por enquanto, usar apenas default. Depois pode adicionar terminal
  let previewPath = pluginPreviews[section]
  if (!previewPath) return null

  // Se for terminal, trocar o caminho
  if (style === "terminal") {
    previewPath = previewPath.replace("/default/", "/terminal/")
  }

  // Usar rota API para servir as imagens
  return `/api/section-preview${previewPath}`
}


