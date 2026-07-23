/**
 * Maps a plugin name to another plugin's essential-config namespace it should
 * fall back to when its own secret isn't configured. Mirrors
 * svg-generator/src/config/essential-config-aliases.ts — kept in sync manually
 * since the two packages don't share a common build output for this constant.
 */
export const ESSENTIAL_CONFIG_ALIASES: Record<string, string> = {
  github_repo: "github",
}
