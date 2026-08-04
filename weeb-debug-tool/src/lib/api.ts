/**
 * API Client for Debug Tool Backend
 */

const API_BASE = "http://localhost:5001/api"

export interface Plugin {
  name: string
  displayName: string
  sections: Array<{ id: string; name: string }>
}

export interface GenerateSvgRequest {
  plugin: string
  section: string
  style?: string
  theme?: string
  size?: "half" | "full"
  sectionConfig?: Record<string, any>
  html?: string // Optional: HTML with debug IDs from generate-react
  css?: string // Optional: CSS from generate-react
}

export interface GenerateSvgResponse {
  svg: string
  height: number
  width: number
}

export interface GenerateReactRequest {
  plugin: string
  section: string
  style?: string
  size?: "half" | "full"
  sectionConfig?: Record<string, any>
}

export interface GenerateReactResponse {
  html: string
  css: string
  debugVersion?: number
}

export const api = {
  async getPlugins(): Promise<{ plugins: Plugin[] }> {
    const response = await fetch(`${API_BASE}/plugins`)
    if (!response.ok) {
      throw new Error("Failed to fetch plugins")
    }
    return response.json()
  },

  async generateSvg(request: GenerateSvgRequest): Promise<GenerateSvgResponse> {
    const response = await fetch(`${API_BASE}/generate-svg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })
    if (!response.ok) {
      throw new Error("Failed to generate SVG")
    }
    return response.json()
  },

  async generateReact(request: GenerateReactRequest): Promise<GenerateReactResponse> {
    const response = await fetch(`${API_BASE}/generate-react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })
    if (!response.ok) {
      throw new Error("Failed to generate React HTML")
    }
    return response.json()
  },
}
