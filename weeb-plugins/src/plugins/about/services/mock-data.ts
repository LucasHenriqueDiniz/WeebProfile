/**
 * Mock data of the About plugin: what the wizard preview, the section previews and
 * the height audit draw while nothing has been typed in. No network.
 */

import type { AboutLink, NeofetchContent } from "../types"

function toDataUri(svg: string): string {
  const base64 =
    typeof Buffer !== "undefined" ? Buffer.from(svg).toString("base64") : btoa(unescape(encodeURIComponent(svg)))
  return `data:image/svg+xml;base64,${base64}`
}

/** A 12x12 pixel cat: K for its edge, O fur, W eye, P nose. */
const CAT = [
  ".K........K.",
  ".KK......KK.",
  ".KOK....KOK.",
  ".KOOKKKKOOK.",
  "KOOOOOOOOOOK",
  "KOWKOOOOWKOK",
  "KOKKOOOOKKOK",
  "KOOOOPPOOOOK",
  "KOOOKOOKOOOK",
  ".KOOOKKOOOK.",
  "..KOOOOOOK..",
  "...KKKKKK...",
]
const CAT_COLORS: Record<string, string> = { K: "#1f2328", O: "#f2a65a", W: "#ffffff", P: "#ff7b9c" }

function pixelArt(rows: string[], colors: Record<string, string>): string {
  const rects = rows.flatMap((row, y) =>
    [...row].flatMap((cell, x) =>
      colors[cell] ? [`<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[cell]}"/>`] : []
    )
  )
  const size = rows.length
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${size + 2} ${size + 2}" shape-rendering="crispEdges">${rects.join("")}</svg>`
  )
}

export const MOCK_NEOFETCH: NeofetchContent = {
  title: "weeb@profile",
  fields: [
    { label: "Location", value: "Tokyo, Japan" },
    { label: "Work", value: "Indie dev" },
    { label: "Stack", value: "TypeScript · React · Rust" },
    { label: "Editor", value: "Neovim" },
    { label: "Watching", value: "Frieren · Dandadan" },
    { label: "Playing", value: "Hollow Knight" },
    { label: "Site", value: "my-site.dev" },
  ],
  image: pixelArt(CAT, CAT_COLORS),
}

export const MOCK_LINKS: AboutLink[] = [
  { href: "https://my-site.dev/", label: "my-site.dev", icon: "website" },
  { href: "https://github.com/", label: "GitHub", icon: "github" },
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: "linkedin" },
  { href: "mailto:you@example.com", label: "Email", icon: "email" },
]
