import * as cheerio from "cheerio"
import * as crypto from "node:crypto"
import type { Element, AnyNode } from "domhandler"

function shortHash(input: string) {
  return crypto.createHash("sha1").update(input).digest("base64url").slice(0, 10)
}

type WalkCtx = {
  plugin: string
  section: string
  path: string
}

function stableKey($el: cheerio.Cheerio<AnyNode>) {
  const id = $el.attr("id")
  if (id) return `#${id}`

  const testId = $el.attr("data-testid")
  if (testId) return `[data-testid=${testId}]`

  const href = $el.attr("href")
  if (href) return `[href=${href}]`

  const src = $el.attr("src")
  if (src) return `[src=${src}]`

  const aria = $el.attr("aria-label")
  if (aria) return `[aria-label=${aria}]`

  const alt = $el.attr("alt")
  if (alt) return `[alt=${alt}]`

  // primeira class "estável" (evita classes utilitárias demais)
  const cls = ($el.attr("class") || "")
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .find((c) => c.startsWith("wp-") || c.startsWith("weeb-") || c.includes("title") || c.includes("container"))

  return cls ? `.${cls}` : ""
}

function walkAssign(
  $: cheerio.CheerioAPI,
  el: AnyNode,
  ctx: WalkCtx,
  siblingTagCounters: Map<string, number> = new Map()
) {
  if (el.type !== "tag") return
  
  const element = el as Element
  const $el = $(element)
  const tag = element.tagName.toLowerCase()

  const count = (siblingTagCounters.get(tag) || 0) + 1
  siblingTagCounters.set(tag, count)

  const key = stableKey($el)
  const seg = `${tag}:${count}${key ? `:${key}` : ""}`
  const path = ctx.path ? `${ctx.path}/${seg}` : seg

  const debugId = `dbg-${ctx.plugin}-${ctx.section}-${shortHash(`${ctx.plugin}:${ctx.section}:${path}`)}`
  $el.attr("data-debug-id", debugId)

  // filhos: precisamos de contadores por pai
  const childCounters = new Map<string, number>()
  $el.contents().each((_, child) => {
    if (child.type === "tag") {
      walkAssign($, child, { ...ctx, path }, childCounters)
    }
  })
}

export function injectDebugIds(html: string, plugin: string, section: string): string {
  const $ = cheerio.load(html, {
    xml: false,
  })

  // escolhe um root razoável (seu HTML pode não ter <html>/<body>)
  const $body = $("body")
  const startSelector = $body.length > 0 ? "body > *" : "*"

  const topCounters = new Map<string, number>()
  $(startSelector).each((_, el) => {
    if (el.type === "tag") {
      walkAssign($, el, { plugin, section, path: "" }, topCounters)
    }
  })

  // Se body existe, retornar HTML do body, senão retornar HTML completo
  if ($body.length > 0) {
    return $body.html() ?? ""
  }
  return $.html()
}

