import { defaultThemes, terminalThemes } from "@weeb/weeb-plugins/themes"

/**
 * The public preview: a visitor types a username on the landing page and sees their
 * real card before having an account (docs/public-preview.md).
 *
 * Shared by the landing block, the Pages Function (functions/api/preview.ts) and the
 * wizard hand-off, so all three accept exactly the same requests. Everything here is a
 * whitelist: the endpoint builds the generator's body from what this returns and
 * nothing else.
 */

export interface PreviewPlugin {
  /** Chosen by the server, never by the visitor: cheap to fetch and good to look at. */
  sections: readonly string[]
  /** Where the visitor's identifier goes in the plugin config. */
  field: "username" | "steamId"
}

export const PREVIEW_PLUGINS = {
  github: { sections: ["profile", "favorite_languages"], field: "username" },
  myanimelist: { sections: ["statistics", "anime_bar"], field: "username" },
  anilist: { sections: ["statistics", "favorites_anime"], field: "username" },
  codewars: { sections: ["rank_honor", "languages_proficiency"], field: "username" },
  codeforces: { sections: ["rating_rank", "contests_participated"], field: "username" },
  duolingo: { sections: ["current_streak", "languages_learning"], field: "username" },
  devto: { sections: ["profile", "recent_articles"], field: "username" },
  steam: { sections: ["statistics", "top_games"], field: "steamId" },
} as const satisfies Record<string, PreviewPlugin>

export type PreviewPluginId = keyof typeof PREVIEW_PLUGINS

/**
 * A well-known public account per platform, so the field's placeholder doubles as
 * something to try. AniList's founder keeps a private profile.
 */
export const PREVIEW_PLACEHOLDERS: Record<PreviewPluginId, string> = {
  github: "torvalds",
  myanimelist: "Xinil",
  anilist: "username",
  codewars: "g964",
  codeforces: "tourist",
  duolingo: "luis",
  devto: "ben",
  steam: "steamcommunity.com/id/gabelogannewell",
}
export type PreviewStyle = "default" | "terminal"
export type PreviewSize = "half" | "full"

export interface PreviewRequest {
  plugin: PreviewPluginId
  /** As typed, trimmed. For Steam: a SteamID64, a profile URL or a vanity name. */
  username: string
  style: PreviewStyle
  theme: string
  size: PreviewSize
}

export type PreviewParseResult = { ok: true; value: PreviewRequest } | { ok: false; field: string; message: string }

/**
 * Letters, digits, `_`, `.` and `-`, up to 40 characters: covers the usernames of every
 * username-based plugin above without trying to mirror each site's exact rules (a
 * name that passes and does not exist comes back as "not found").
 */
const USERNAME = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,39}$/

/** A SteamID64, a steamcommunity.com profile URL or a vanity name. Parsed further by steam-id.ts. */
const STEAM_INPUT = /^[A-Za-z0-9_.:/-]{2,120}$/

export function isPreviewPlugin(value: unknown): value is PreviewPluginId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(PREVIEW_PLUGINS, value)
}

export function themesFor(style: PreviewStyle): string[] {
  return Object.keys(style === "terminal" ? terminalThemes : defaultThemes)
}

export function parsePreviewRequest(params: URLSearchParams): PreviewParseResult {
  const plugin = params.get("plugin")
  if (!isPreviewPlugin(plugin)) {
    return { ok: false, field: "plugin", message: `plugin must be one of: ${Object.keys(PREVIEW_PLUGINS).join(", ")}` }
  }

  const username = (params.get("username") ?? "").trim()
  const pattern = PREVIEW_PLUGINS[plugin].field === "steamId" ? STEAM_INPUT : USERNAME
  if (!pattern.test(username)) {
    return { ok: false, field: "username", message: "username is missing or has characters it cannot have" }
  }

  const style = params.get("style") ?? "default"
  if (style !== "default" && style !== "terminal") {
    return { ok: false, field: "style", message: "style must be default or terminal" }
  }

  const theme = params.get("theme") ?? "default"
  if (!themesFor(style).includes(theme)) {
    return { ok: false, field: "theme", message: `theme must be one of: ${themesFor(style).join(", ")}` }
  }

  const size = params.get("size") ?? "half"
  if (size !== "half" && size !== "full") {
    return { ok: false, field: "size", message: "size must be half or full" }
  }

  return { ok: true, value: { plugin, username, style, theme, size } }
}

/** The query string both the endpoint and the wizard hand-off read. Fixed order. */
export function previewQuery(request: PreviewRequest): string {
  return new URLSearchParams({
    plugin: request.plugin,
    username: request.username,
    style: request.style,
    theme: request.theme,
    size: request.size,
  }).toString()
}

/** Marks a /dashboard/new/profile visit as coming from the landing preview. */
export const PREVIEW_HANDOFF_SOURCE = "preview"

/** Where "Save to my profile" leads once the visitor is signed in. */
export function wizardPathFor(request: PreviewRequest): string {
  return `/dashboard/new/profile?source=${PREVIEW_HANDOFF_SOURCE}&${previewQuery(request)}`
}

/**
 * The preview in the shape the wizard store's loadFromTemplate reads, so the wizard
 * opens on the same card the visitor saw.
 *
 * A Steam identifier is not carried: Steam's ID is a profile setting (plugin_secrets),
 * which the wizard asks for as it does today. Terminal options are set to what the
 * preview rendered with; loadFromTemplate would otherwise hide the terminal header.
 */
export function previewToTemplate(request: PreviewRequest) {
  const plugin = PREVIEW_PLUGINS[request.plugin]
  const pluginConfig: Record<string, unknown> = { enabled: true, sections: [...plugin.sections] }
  if (plugin.field === "username") pluginConfig.username = request.username

  return {
    style: request.style,
    size: request.size,
    theme: request.theme,
    pluginsOrder: [request.plugin],
    pluginsConfig: { [request.plugin]: pluginConfig },
    uiConfig: { hideTerminalEmojis: false, hideTerminalHeader: false, hideTerminalCommand: false },
  }
}
