/**
 * Plugin Exports - Generated from weeb-plugins
 * 
 * This file is auto-generated. Do not edit manually.
 * Run: pnpm generate:plugin-wrappers
 * 
 * Re-exports plugins from local copies
 */

export { personality16Plugin } from './16personalities/index'
export { githubPlugin } from './github/index'
export { lastFmPlugin } from './lastfm/index'
export { myAnimeListPlugin } from './myanimelist/index'

export async function loadPlugin(name: string) {
  switch (name) {
    case '16personalities':
      const { personality16Plugin } = await import('./16personalities/index')
      return personality16Plugin
    case 'github':
      const { githubPlugin } = await import('./github/index')
      return githubPlugin
    case 'lastfm':
      const { lastFmPlugin } = await import('./lastfm/index')
      return lastFmPlugin
    case 'myanimelist':
      const { myAnimeListPlugin } = await import('./myanimelist/index')
      return myAnimeListPlugin
    default:
      return undefined
  }
}
