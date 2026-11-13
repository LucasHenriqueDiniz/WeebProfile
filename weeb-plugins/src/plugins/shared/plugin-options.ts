import type { Plugin } from "./types/plugin"

/**
 * One place for a plugin's section options, whichever shape the config arrived in.
 *
 * The plugin types put the options under `config.nonEssential`, and much of the code
 * reads them there. Nothing in production sends that key: the dashboard stores the
 * options at the root of the plugin config, and the generator's renderer flattens
 * sectionConfigs to the root too. So every `nonEssential` read got {} and used its
 * defaults, while code reading the root got the user's value. Where a section drew
 * one and calculateHeight assumed the other, the card was cut (Last.fm, up to 180px)
 * or padded with blank space (Steam, up to 320px); where both read `nonEssential`,
 * the user's option was ignored outright.
 *
 * `nonEssential` gets the root's values, and keeps any it was given explicitly (the
 * audit scripts pass it). The root is left as it is, so both reads agree.
 */
export function withPluginOptions<T>(config: T): T {
  if (!config || typeof config !== "object") return config
  const { nonEssential, ...root } = config as Record<string, unknown>
  return {
    ...config,
    nonEssential: { ...root, ...((nonEssential as Record<string, unknown> | undefined) ?? {}) },
  }
}

/** The plugin, with every config it is handed passed through withPluginOptions first. */
export function withNormalizedOptions(plugin: Plugin): Plugin {
  return {
    ...plugin,
    fetchData: (config, ...rest) => plugin.fetchData(withPluginOptions(config), ...rest),
    render: (config, data) => plugin.render(withPluginOptions(config), data),
    calculateHeight: (config, data, size) => plugin.calculateHeight(withPluginOptions(config), data, size),
  }
}
