import { useEffect, useState } from "react"
import { CheckCircle2, Copy, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PanelCard } from "@/components/dashboard/PanelCard"
import { useTranslations } from "@/i18n/use-translations"
import { useToast } from "@/hooks/use-toast"
import { svgApi } from "@/lib/api"
import { generateTilesMarkdown } from "@/lib/utils/markdown"
import { publicTileUrl } from "@/lib/utils/svg-url"

/**
 * The snippet of one image per site, for a card with the websites plugin. Each image
 * sits in its own link, so a site opens with one click straight from the README.
 *
 * The links come from what the last generation stored (GET /api/svgs/:id/tiles), so
 * each one opens the site its image shows. Hidden until there is something stored.
 */
export function WebsiteTilesPanel({ svgId, generatedAt }: { svgId: string; generatedAt: string | null }) {
  const t = useTranslations("embed.tiles")
  const { toast } = useToast()
  const [tiles, setTiles] = useState<Array<{ href: string; title: string }>>([])
  const [copied, setCopied] = useState(false)

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
    // Again after each generation, which may have changed the sites.
  }, [svgId, generatedAt])

  const snippet = generateTilesMarkdown(tiles.map((tile, i) => ({ ...tile, src: publicTileUrl(svgId, i) })))
  if (!snippet) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      toast({ title: t("toastCopied"), description: t("toastCopiedDescription", { count: tiles.length }) })
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
      <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border border-border/50 bg-muted/50 p-3 font-mono text-xs">
        <code className="text-foreground">{snippet}</code>
      </pre>
    </PanelCard>
  )
}
