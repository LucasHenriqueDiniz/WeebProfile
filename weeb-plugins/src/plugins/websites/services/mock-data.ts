/**
 * Dados mock do plugin Websites
 *
 * Usados em modo dev e na geração de previews, onde a config vem vazia e nenhum
 * fetch externo pode acontecer.
 */

import type { WebsiteEntry, WebsitesData } from "../types"

function toDataUri(svg: string): string {
  const base64 =
    typeof Buffer !== "undefined" ? Buffer.from(svg).toString("base64") : btoa(unescape(encodeURIComponent(svg)))
  return `data:image/svg+xml;base64,${base64}`
}

/** Thumbnail fake: gradiente + inicial, para o preview não virar uma parede de "No Image". */
function mockThumbnail(from: string, to: string, initial: string): string {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>` +
      `</linearGradient></defs>` +
      `<rect width="320" height="160" fill="url(#g)"/>` +
      `<text x="160" y="98" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" fill-opacity="0.85" text-anchor="middle">${initial}</text>` +
      `</svg>`
  )
}

/** Favicon fake: quadradinho arredondado com a inicial. */
function mockFavicon(color: string, initial: string): string {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">` +
      `<rect width="64" height="64" rx="14" fill="${color}"/>` +
      `<text x="32" y="44" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle">${initial}</text>` +
      `</svg>`
  )
}

const MOCK_WEBSITES: WebsiteEntry[] = [
  {
    url: "https://weebprofile.pages.dev",
    domain: "weebprofile.pages.dev",
    title: "WeebProfile",
    description: "Generate beautiful SVG cards for your GitHub profile",
    thumbnail: mockThumbnail("#7c3aed", "#db2777", "W"),
    favicon: mockFavicon("#7c3aed", "W"),
  },
  {
    url: "https://my-portfolio.dev",
    domain: "my-portfolio.dev",
    title: "My Portfolio",
    description: "Personal site, side projects and a bit of writing",
    thumbnail: mockThumbnail("#0ea5e9", "#2563eb", "P"),
    favicon: mockFavicon("#0ea5e9", "P"),
  },
  {
    url: "https://blog.my-portfolio.dev",
    domain: "blog.my-portfolio.dev",
    title: "Dev Notes",
    description: "Notes on TypeScript, edge runtimes and design systems",
    thumbnail: mockThumbnail("#f59e0b", "#ef4444", "D"),
    favicon: mockFavicon("#f59e0b", "D"),
  },
  {
    url: "https://componentkit.dev",
    domain: "componentkit.dev",
    title: "ComponentKit",
    description: "An open source React component library",
    thumbnail: mockThumbnail("#10b981", "#0d9488", "C"),
    favicon: mockFavicon("#10b981", "C"),
  },
  {
    url: "https://pixelgarden.art",
    domain: "pixelgarden.art",
    title: "Pixel Garden",
    description: "Pixel art experiments and generative sketches",
    thumbnail: mockThumbnail("#ec4899", "#8b5cf6", "G"),
    favicon: mockFavicon("#ec4899", "G"),
  },
  {
    url: "https://snippets.sh",
    domain: "snippets.sh",
    title: "Snippets",
    description: "A tiny paste bin for shell one-liners",
    thumbnail: mockThumbnail("#64748b", "#0f172a", "S"),
    favicon: mockFavicon("#64748b", "S"),
  },
]

export function getMockWebsitesData(max = MOCK_WEBSITES.length): WebsitesData {
  return { websites: MOCK_WEBSITES.slice(0, Math.max(1, max)).map((site) => ({ ...site })) }
}
