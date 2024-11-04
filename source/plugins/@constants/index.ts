export const SUPPORTED_STORAGE_METHODS = ["gist", "local", "repository"] as const
export type StorageMethod = (typeof SUPPORTED_STORAGE_METHODS)[number]

export const SUPPORTED_STYLES = ["default", "terminal"] as const
export type PluginStyle = (typeof SUPPORTED_STYLES)[number]

export const SUPPORTED_SIZES = ["half", "full"] as const
export type PluginSize = (typeof SUPPORTED_SIZES)[number]
