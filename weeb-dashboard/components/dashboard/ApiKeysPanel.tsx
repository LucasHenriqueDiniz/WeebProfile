import { useCallback, useEffect, useState } from "react"
import { KeyRound, Loader2 } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useLocale, useTranslations } from "@/i18n/use-translations"
import { secretsApi, svgApi } from "@/lib/api/client"
import { pluginKeyRows, type PluginKeyRow } from "@/lib/config/plugin-keys"
import { getPluginIcon } from "@/lib/plugin-icons"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { formatRelative } from "@/lib/utils/relative-time"

/**
 * The plugin keys and tokens the user saved, in Settings > Account. They used to show
 * only inside the wizard, one plugin at a time, and nothing could remove one short of
 * deleting the account. Values never reach the browser: the list is which keys exist
 * and when they were saved.
 */
export function ApiKeysPanel() {
  const t = useTranslations("settings.account.apiKeys")
  const locale = useLocale()
  const { tWithFallback } = usePluginI18n()
  const { toast } = useToast()
  const [rows, setRows] = useState<PluginKeyRow[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [confirming, setConfirming] = useState<PluginKeyRow | null>(null)
  const [removing, setRemoving] = useState(false)

  const load = useCallback(async () => {
    try {
      const [{ secrets }, { svgs }] = await Promise.all([secretsApi.list(), svgApi.list()])
      setRows(pluginKeyRows(secrets, svgs))
      setLoadFailed(false)
    } catch {
      setLoadFailed(true)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const pluginName = (plugin: string) => {
    const meta = (PLUGINS_METADATA as Record<string, { displayName?: string; i18nKey?: { displayName?: string } }>)[
      plugin
    ]
    if (!meta) return plugin
    return meta.i18nKey?.displayName
      ? tWithFallback(meta.i18nKey.displayName.replace(/^plugins\./, ""), meta.displayName ?? plugin)
      : (meta.displayName ?? plugin)
  }
  const keyLabel = (row: PluginKeyRow) =>
    row.labelI18nKey ? tWithFallback(row.labelI18nKey.replace(/^plugins\./, ""), row.label) : row.label

  const remove = async () => {
    if (!confirming) return
    setRemoving(true)
    try {
      await secretsApi.remove(confirming.plugin, confirming.key)
      toast({ title: t("removed", { key: keyLabel(confirming), plugin: pluginName(confirming.plugin) }) })
      setConfirming(null)
      await load()
    } catch {
      toast({ title: t("removeFailed"), variant: "destructive" })
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-foreground">{t("title")}</p>
      <p className="mb-3 mt-1 text-xs text-muted-foreground">{t("description")}</p>

      {loadFailed ? (
        <p className="text-sm text-destructive">{t("loadFailed")}</p>
      ) : rows === null ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("loading")}
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-xl border border-border">
          {rows.map((row) => {
            const Icon = getPluginIcon(row.plugin) ?? KeyRound
            const configured = !!row.updatedAt
            return (
              <li key={`${row.plugin}/${row.key}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {pluginName(row.plugin)} <span className="text-muted-foreground">· {keyLabel(row)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {configured ? t("savedAgo", { when: formatRelative(row.updatedAt, locale) }) : t("notConfigured")}
                    {" · "}
                    {row.usedBy > 0 ? t("usedBy", { count: row.usedBy }) : t("unused")}
                    {row.sharedWith.length > 0 &&
                      ` · ${t("sharedWith", { plugins: row.sharedWith.map(pluginName).join(", ") })}`}
                  </div>
                </div>
                {configured && (
                  <Button variant="outline" size="sm" onClick={() => setConfirming(row)}>
                    {t("remove")}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <Dialog open={!!confirming} onOpenChange={(open) => !open && !removing && setConfirming(null)}>
        <DialogContent>
          {confirming && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t("confirmTitle", { key: keyLabel(confirming), plugin: pluginName(confirming.plugin) })}
                </DialogTitle>
                <DialogDescription>
                  {confirming.usedBy > 0 ? t("confirmUsed", { count: confirming.usedBy }) : t("confirmUnused")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirming(null)} disabled={removing}>
                  {t("cancel")}
                </Button>
                <Button variant="destructive" onClick={remove} disabled={removing}>
                  {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {removing ? t("removing") : t("confirm")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
