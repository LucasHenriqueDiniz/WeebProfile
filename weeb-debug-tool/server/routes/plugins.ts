/**
 * Get Plugins Route
 * 
 * GET /api/plugins
 * Returns list of available plugins and their sections
 */

import { Router, Request, Response } from 'express'
import { PLUGINS_METADATA } from '@weeb-plugins/plugins/metadata'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  try {
    const plugins = Object.entries(PLUGINS_METADATA).map(([name, metadata]) => ({
      name: metadata.name || name,
      displayName: metadata.displayName || name,
      sections: metadata.sections.map((section) => ({
        id: section.id,
        name: section.name,
      })),
    }))

    res.json({ plugins: plugins.sort((a, b) => a.name.localeCompare(b.name)) })
  } catch (error) {
    console.error('Error reading plugins:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to read plugins',
    })
  }
})

export default router


