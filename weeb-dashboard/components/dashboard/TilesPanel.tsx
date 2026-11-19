import { useEffect, useState } from "react"
import { CheckCircle2, Copy, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PanelCard } from "@/components/dashboard/PanelCard"
import { useTranslations } from "@/i18n/use-translations"
import { useToast } from "@/hooks/use-toast"
import { svgApi } from "@/lib/api"
import { generateBadgesMarkdown, generateTilesMarkdown } from "@/lib/utils/markdown"
import { publicTileUrl } from "@/lib/utils/svg-url"

/** Plugins that draw tiles (Plugin.tiles in weeb-plugins): the card page shows this panel for them. */
export const TILE_PLUGINS = ["websites", "about"] as const

type StoredTile = { href: string; title: string; layout: "grid" | "inline" }

/**
 * The snippets of one image per item, for a card whose plugins draw tiles: one link per
 * site (websites) and one link per badge (About). Each image sits in its own link, so
 * an item opens with one click straight from the README.
 *
 * The links come from what the last generation stored (GET /api/svgs/:id/tiles), so
 * each one opens what its image shows. A tile's place in the card is its URL, so the
 * indexes run across both kinds. Hidden until there is something stored.
 */
export function TilesPanel({ svgId, generatedAt }: { svgId: string; generatedAt: string | null }) {
  const [tiles, setTiles] = useState<StoredTile[]>([])

  useEffect(() => {
    let cancelled = false
    svgApi
      .tiles(svgId)
      .then(({ tiles }) => {
        if (!cancelled) setTiles(tiles)
      })
      .catch(() => {
        if (!cancelled) setTiles([])
      })
    return () => {
      cancelled = true
    }
    // Again after each generation, which may have changed the items.
  }, [svgId, generatedAt])

  const withSrc = tiles.map((tile, i) => ({ ...tile, src: publicTileUrl(svgId, i) }))
  const sites = withSrc.filter((tile) => tile.layout !== "inline")
  const badges = withSrc.filter((tile) => tile.layout === "inline")

  return (
    <>
      <SnippetPanel kind="tiles" snippet={generateTilesMarkdown(sites)} count={sites.length} />
      <SnippetPanel kind="badges" snippet={generateBadgesMarkdown(badges)} count={badges.length} />
    </>
  )
}

function SnippetPanel({ kind, snippet, count }: { kind: "tiles" | "badges"; snippet: string; count: number }) {
  const t = useTranslations(`embed.${kind}`)
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  if (!snippet) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      toast({ title: t("toastCopied"), description: t("toastCopiedDescription", { count }) })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: t("toastError"), variant: "destructive" })
    }
  }

  return (
    <PanelCard
      icon={MousePointerClick}
      title={t("title")}
      action={
        <Button
          variant={copied ? "default" : "outline"}
          size="sm"
          onClick={copy}
          className="h-7 gap-1.5 px-2.5 text-xs"
        >
          {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t("copied") : t("copy")}
        </Button>
      }
    >
      <p className="mb-2 text-xs text-muted-foreground">{t("description")}</p>
      <p className="mb-3 text-xs text-muted-foreground">{t("note")}</p>
      <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border-2 border-foreground/30 bg-muted/50 p-3 font-mono text-xs">
        <code className="text-foreground">{snippet}</code>
      </pre>
    </PanelCard>
  )
}
