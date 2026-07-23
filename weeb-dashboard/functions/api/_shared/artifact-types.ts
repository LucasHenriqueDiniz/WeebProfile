/**
 * Which plugin(s) each artifactType is allowed to combine. Empty array means
 * unrestricted (the existing Profile behavior — any registered plugin allowed).
 * Adding a future repository artifact type (banner, star_history, technologies, ...)
 * means adding one entry here plus the corresponding plugin — no orchestration changes.
 */
export const ARTIFACT_TYPE_ALLOWED_PLUGINS: Record<string, string[]> = {
  profile_card: [],
  repository_card: ["github_repo"],
}

export function assertPluginsMatchEntityType(
  entityType: string,
  pluginsConfig: Record<string, unknown>
): string | null {
  const artifactType = entityType === "repository" ? "repository_card" : "profile_card"
  const allowed = ARTIFACT_TYPE_ALLOWED_PLUGINS[artifactType]
  if (!allowed || allowed.length === 0) return null

  const configuredPlugins = Object.keys(pluginsConfig)
  const disallowed = configuredPlugins.filter((p) => !allowed.includes(p))
  if (disallowed.length > 0) {
    return `Artifact type "${artifactType}" only supports these plugins: ${allowed.join(", ")}. Found: ${disallowed.join(", ")}`
  }
  return null
}
