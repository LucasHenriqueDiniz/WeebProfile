/**
 * Maps a plugin name to another plugin's essential-config namespace it should
 * fall back to when its own secret isn't configured. Lets multiple plugins share
 * a single stored secret (e.g. the same GitHub PAT) without the user re-entering it.
 */
export const ESSENTIAL_CONFIG_ALIASES: Record<string, string> = {
  github_repo: "github",
}
