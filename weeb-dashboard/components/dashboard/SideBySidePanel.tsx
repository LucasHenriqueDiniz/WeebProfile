import { useState } from "react"
import { Columns2, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PanelCard } from "@/components/dashboard/PanelCard"
import { useTranslations } from "@/i18n/use-translations"
import { useToast } from "@/hooks/use-toast"
import { generateMarkdownForMultipleHalf } from "@/lib/utils/markdown"
import { publicSvgUrl } from "@/lib/utils/svg-url"
import { embedAltFor } from "@/lib/utils/embed-prefs"

interface HalfSvg {
  id: string
  name: string
}

/**
 * The open SVG and the user's other half-width SVGs in one snippet, two per row. Shown
 * only for a half SVG when there is another one to pair it with.
 */
export function SideBySidePanel({
  current,
  currentAlt,
  others,
}: {
  current: HalfSvg
  currentAlt: string
  others: HalfSvg[]
}) {
  const t = useTranslations("embed.sideBySide")
  const { toast } = useToast()
  const [excluded, setExcluded] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const chosen = others.filter((svg) => !excluded.has(svg.id))
  const snippet = generateMarkdownForMultipleHalf([
    { alt: currentAlt, url: publicSvgUrl(current.id) },
    ...chosen.map((svg) => ({ alt: embedAltFor(svg), url: publicSvgUrl(svg.id) })),
  ])

  const toggle = (id: string) =>
    setExcluded((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      toast({ title: t("toastCopied"), description: t("toastCopiedDescription", { count: chosen.length + 1 }) })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: t("toastError"), variant: "destructive" })
    }
  }

  return (
    <PanelCard
      icon={Columns2}
      title={t("title")}
      action={
        <Button
          variant={copied ? "default" : "outline"}
          size="sm"
          onClick={copy}
          disabled={chosen.length === 0}
          className="h-7 gap-1.5 px-2.5 text-xs"
        >
          {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t("copied") : t("copy")}
        </Button>
      }
    >
      <p className="mb-3 text-xs text-muted-foreground">{t("description")}</p>
      <ul className="mb-3 space-y-1.5">
        <li className="flex items-center gap-2 text-xs text-foreground">
          <input type="checkbox" checked disabled className="h-3.5 w-3.5 accent-primary" />
          <span className="truncate">{current.name}</span>
        </li>
        {others.map((svg) => (
          <li key={svg.id}>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
              <input
                type="checkbox"
                checked={!excluded.has(svg.id)}
                onChange={() => toggle(svg.id)}
                className="h-3.5 w-3.5 accent-primary"
              />
              <span className="truncate">{svg.name}</span>
            </label>
          </li>
        ))}
      </ul>
      <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border border-border/50 bg-muted/50 p-3 font-mono text-xs">
        <code className="text-foreground">{snippet}</code>
      </pre>
    </PanelCard>
  )
}
