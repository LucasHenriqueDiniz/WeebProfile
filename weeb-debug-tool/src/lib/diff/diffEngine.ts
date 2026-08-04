/**
 * Diff Engine
 *
 * Compares style snapshots between React and SVG outputs
 */

import type { StyleSnapshot } from "../iframe/iframeProtocol"

export type Severity = "low" | "medium" | "high"

export type DiffItem = {
  property: string
  reactValue: string
  svgValue: string
  severity: Severity
  weight: number
}

export type DiffResult = {
  differenceScore: number // 0..100
  diffs: DiffItem[]
  hints: string[]
}

const IMPORTANT_PROPS = [
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "color",
  "background-color",
  "opacity",
  "display",
  "position",
  "top",
  "left",
  "right",
  "bottom",
  "width",
  "height",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
  "fill",
  "stroke",
  "stroke-width",
  "vector-effect",
  "shape-rendering",
  "text-rendering",
] as const

const WEIGHTS: Record<string, number> = {
  "font-family": 10,
  "font-size": 10,
  "font-weight": 6,
  "line-height": 6,
  "letter-spacing": 4,

  fill: 10,
  stroke: 8,
  "stroke-width": 6,

  color: 6,
  "background-color": 4,
  opacity: 4,

  width: 8,
  height: 8,
  display: 4,
  position: 3,
} // props não listadas caem em 2

function w(prop: string) {
  return WEIGHTS[prop] ?? 2
}

function normWhitespace(v: string) {
  return (v || "").trim().replace(/\s+/g, " ").toLowerCase()
}

function normFontFamily(v: string) {
  return normWhitespace(v)
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean)
    .join(",")
}

function parsePx(v: string): number | null {
  const m = (v || "").trim().match(/^(-?\d+(\.\d+)?)px$/i)
  if (!m) return null
  return Number(m[1])
}

function nearlyEqualPx(a: string, b: string, tol = 0.5) {
  const pa = parsePx(a)
  const pb = parsePx(b)
  if (pa == null || pb == null) return false
  return Math.abs(pa - pb) <= tol
}

function normalize(prop: string, v: string) {
  if (!v) return ""
  if (prop === "font-family") return normFontFamily(v)
  return normWhitespace(v)
}

function bboxDiffScore(a: StyleSnapshot["bbox"], b: StyleSnapshot["bbox"]) {
  // percentuais simples (evita dividir por zero)
  const aw = Math.max(1, a.width)
  const ah = Math.max(1, a.height)

  const dw = Math.abs(a.width - b.width) / aw
  const dh = Math.abs(a.height - b.height) / ah
  const dx = Math.abs(a.x - b.x) / Math.max(1, Math.abs(a.x) + 1)
  const dy = Math.abs(a.y - b.y) / Math.max(1, Math.abs(a.y) + 1)

  const raw = (dw + dh) * 0.6 + (dx + dy) * 0.4
  return Math.min(1, raw) // 0..1
}

function severityFor(prop: string, ra: string, sv: string): Severity {
  if (!ra && sv) return w(prop) >= 8 ? "high" : "medium"
  if (ra && !sv) return w(prop) >= 8 ? "high" : "medium"

  if (nearlyEqualPx(ra, sv)) return "low"

  const weight = w(prop)
  if (weight >= 8) return "high"
  if (weight >= 4) return "medium"
  return "low"
}

function hintsFromDiffs(diffs: DiffItem[]) {
  const hints: string[] = []
  const has = (p: string) => diffs.some((d) => d.property === p && d.reactValue !== d.svgValue)

  if (has("font-family"))
    hints.push("Fonte divergente: verifique carregamento de fontes no pipeline do SVG (fallback diferente é comum).")
  if (has("font-size"))
    hints.push("Tamanho de fonte divergente: pode ser conversão de unidade / fallback de font metrics no SVG.")
  if (has("fill") || has("stroke"))
    hints.push(
      "Fill/stroke divergentes: CSS pode não estar sendo aplicado no SVG final ou atributo inline está sobrescrevendo."
    )
  if (has("width") || has("height"))
    hints.push("Dimensões divergentes: suspeite de layout/medidas diferentes entre renderer HTML e gerador de SVG.")
  if (diffs.some((d) => d.property.startsWith("--")))
    hints.push("CSS vars divergentes: escopo de vars (:root/body) pode não estar igual entre previews.")

  return hints
}

export function compareSnapshots(
  reactSnap: StyleSnapshot,
  svgSnap: StyleSnapshot,
  opts?: { properties?: string[] }
): DiffResult {
  const props = opts?.properties?.length ? opts.properties : [...IMPORTANT_PROPS]

  const diffs: DiffItem[] = []
  let diffWeightSum = 0
  let totalWeightSum = 0

  for (const prop of props) {
    const rv = reactSnap.computedStyle[prop] ?? ""
    const sv = svgSnap.computedStyle[prop] ?? ""

    const nr = normalize(prop, rv)
    const ns = normalize(prop, sv)

    const weight = w(prop)
    totalWeightSum += weight

    if (nr !== ns) {
      const sev = severityFor(prop, rv, sv)
      diffs.push({ property: prop, reactValue: rv, svgValue: sv, severity: sev, weight })
      diffWeightSum += weight
    }
  }

  // bbox entra como "peso extra"
  const bboxScore01 = bboxDiffScore(reactSnap.bbox, svgSnap.bbox)
  const bboxWeight = 12
  totalWeightSum += bboxWeight
  diffWeightSum += bboxScore01 * bboxWeight

  const score = totalWeightSum === 0 ? 0 : Math.round((diffWeightSum / totalWeightSum) * 100)

  diffs.sort((a, b) => b.weight - a.weight)

  return {
    differenceScore: Math.max(0, Math.min(100, score)),
    diffs,
    hints: hintsFromDiffs(diffs),
  }
}
