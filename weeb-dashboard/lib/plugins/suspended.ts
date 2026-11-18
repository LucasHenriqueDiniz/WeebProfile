/**
 * Plugins that are registered but cannot generate a card right now. They stay listed,
 * marked as suspended with the reason (`pluginStatus.reasons.<id>` in the locale files),
 * and the public preview refuses them before spending a generator call.
 *
 * - anilist, 18/11/2026: graphql.anilist.co answers 403 to every request that leaves the
 *   Worker (the same request answers 200 from a laptop), so no AniList card generates:
 *   4 of 4 previews failed. Remove the entry when a preview for an existing account
 *   answers 200 again.
 */
export const SUSPENDED_PLUGINS: ReadonlySet<string> = new Set(["anilist"])

export const isSuspended = (pluginId: string): boolean => SUSPENDED_PLUGINS.has(pluginId)
