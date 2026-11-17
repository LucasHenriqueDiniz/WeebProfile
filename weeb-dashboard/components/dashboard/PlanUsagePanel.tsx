import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import { cn } from "@/lib/utils"
import { useSvgStore } from "@/stores/svg-store"

/**
 * The plan and how much of it is used, in Settings > Account. It only showed under the
 * SVG list and in the sidebar's counter; the account tab had nothing but the danger zone.
 * Same store as the sidebar, refreshed once when the tab opens.
 */
export function PlanUsagePanel() {
  const t = useTranslations("dashboard.quota")
  const tAccount = useTranslations("settings.account")
  const count = useSvgStore((state) => state.svgs.length)
  const fetchSvgs = useSvgStore((state) => state.fetchSvgs)

  useEffect(() => {
    fetchSvgs()
  }, [fetchSvgs])

  const full = count >= MAX_SVGS_FREE_TIER

  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-foreground">{tAccount("planTitle")}</p>
      <div className="mt-3 rounded-xl border border-border px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{t("title")}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {t("label", { count, max: MAX_SVGS_FREE_TIER })}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-48 max-w-full overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "block h-full rounded-full transition-all",
                  full ? "bg-amber-400" : "bg-gradient-to-r from-violet-500 to-cyan-500"
                )}
                style={{ width: `${Math.min(100, (count / MAX_SVGS_FREE_TIER) * 100)}%` }}
              />
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">{tAccount("planManage")}</Link>
          </Button>
        </div>
        {full && <p className="mt-2 text-xs text-muted-foreground">{tAccount("planFull")}</p>}
      </div>
    </div>
  )
}
