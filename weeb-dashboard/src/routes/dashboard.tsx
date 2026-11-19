import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState"
import { SvgLibraryCard } from "@/components/dashboard/SvgLibraryCard"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BUTTON_PRIMARY, BUTTON_SECONDARY_SM, CHIP, SEGMENTED, STICKER, segment } from "@/components/landing/sticker"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { ApiException, svgApi } from "@/lib/api"
import type { Svg } from "@/lib/db/schema"
import { useSvgStore } from "@/stores/svg-store"
import { generateMarkdown } from "@/lib/utils/markdown"
import { publicSvgUrl } from "@/lib/utils/svg-url"
import { embedAltFor } from "@/lib/utils/embed-prefs"
import { cn } from "@/lib/utils"
import { ArrowUpDown, Loader2, Plus } from "lucide-react"
import { Link, useRouter } from "@/i18n/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "@/i18n/use-translations"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"

type SortOption = "newest" | "oldest" | "name" | "status"
type FilterStatus = "all" | Svg["status"]

const SORT_OPTIONS: { id: SortOption; key: string }[] = [
  { id: "newest", key: "newestFirst" },
  { id: "oldest", key: "oldestFirst" },
  { id: "name", key: "nameAZ" },
  { id: "status", key: "status" },
]

/** The filters only earn their room once the library no longer fits a screen or two. */
const FILTERS_FROM = 7

function sortSvgs(svgs: Svg[], sortBy: SortOption): Svg[] {
  const time = (value: string | null | undefined) => new Date(value || 0).getTime()
  return [...svgs].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return time(a.createdAt) - time(b.createdAt)
      case "name":
        return a.name.localeCompare(b.name)
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return time(b.createdAt) - time(a.createdAt)
    }
  })
}

export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { svgs, svgsLoading, fetchSvgs, removeSvg, updateSvg } = useSvgStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [svgToDelete, setSvgToDelete] = useState<string | null>(null)

  const total = svgs.length
  const countOf = (status: Svg["status"]) => svgs.filter((s) => s.status === status).length
  const isTrulyEmpty = !svgsLoading && total === 0

  // Fetch once per mount, as soon as auth resolves. The store rehydrates from
  // localStorage synchronously (no SSR here), so there is nothing to wait for.
  const hasFetchedRef = useRef(false)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user && !authLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchSvgs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  const shown = useMemo(
    () => sortSvgs(statusFilter === "all" ? svgs : svgs.filter((svg) => svg.status === statusFilter), sortBy),
    [svgs, statusFilter, sortBy]
  )

  const forgetImageError = (id: string) =>
    setImageErrors((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })

  const handleDeleteConfirm = async () => {
    if (!svgToDelete) return
    try {
      setDeletingId(svgToDelete)
      await svgApi.delete(svgToDelete)
      removeSvg(svgToDelete)
      toast({ title: t("toast.svgDeleted"), description: t("toast.deletedSuccess") })
    } catch (error) {
      console.error("Error deleting SVG:", error)
      toast({
        title: t("toast.errorDeleting"),
        description:
          error instanceof ApiException
            ? error.data.message || error.data.error || error.message
            : t("toast.errorDeletingMessage"),
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
      setSvgToDelete(null)
    }
  }

  const handleCopyUrl = async (svg: Svg) => {
    const markdown = generateMarkdown({
      alt: embedAltFor(svg),
      url: publicSvgUrl(svg.id),
      size: (svg.size as "half" | "full") || "half",
    })
    await navigator.clipboard.writeText(markdown)
    toast({ title: t("toast.markdownCopied"), description: t("toast.markdownCopiedDescription") })
  }

  const handleForceGenerate = async (svg: Svg) => {
    try {
      setGeneratingId(svg.id)
      updateSvg(svg.id, { status: "generating" })
      const result = await svgApi.generate(svg.id, true)
      toast({ title: t("toast.generationStarted"), description: t("toast.generationStartedDescription") })
      fetchSvgs(true)
      if (result.svg && result.svg.status === "completed") {
        updateSvg(svg.id, {
          status: result.svg.status,
          storageUrl: result.svg.storageUrl,
          lastGeneratedAt: result.svg.lastGeneratedAt,
          updatedAt: result.svg.updatedAt || new Date().toISOString(),
        })
        forgetImageError(svg.id)
      }
      // Generation can finish after the response: look again once it likely has.
      setTimeout(() => fetchSvgs(true), 5000)
    } catch (error) {
      toast({
        title: t("toast.errorGenerating"),
        description:
          error instanceof ApiException
            ? error.data.message || error.data.error || error.message
            : t("toast.errorGeneratingMessage"),
        variant: "destructive",
      })
    } finally {
      setGeneratingId(null)
    }
  }

  if (authLoading) return <LoadingScreen />
  if (!user) return null

  const ready = countOf("completed")
  const generating = countOf("generating")
  const failed = countOf("failed")
  const filters: { id: FilterStatus; label: string; count: number }[] = [
    { id: "all" as const, label: t("filterAll"), count: total },
    { id: "completed" as const, label: t("status.ready"), count: ready },
    { id: "generating" as const, label: t("status.generating"), count: generating },
    { id: "pending" as const, label: t("status.pending"), count: countOf("pending") },
    { id: "failed" as const, label: t("status.failed"), count: failed },
  ].filter((filter) => filter.id === "all" || filter.count > 0 || filter.id === statusFilter)

  const summary = isTrulyEmpty ? undefined : (
    <span className="flex flex-wrap items-center gap-2">
      <span className={cn(CHIP, "font-mono")}>
        {total} {t("total")}
      </span>
      {ready > 0 && (
        <span className={CHIP}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t("readyCount", { count: ready })}
        </span>
      )}
      {generating > 0 && (
        <span className={CHIP}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
          {t("generatingCount", { count: generating })}
        </span>
      )}
      {failed > 0 && (
        <span className={cn(CHIP, "border-red-600 text-red-700 dark:border-red-400 dark:text-red-400")}>
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {t("failedCount", { count: failed })}
        </span>
      )}
    </span>
  )

  const actions = isTrulyEmpty ? undefined : (
    <>
      <QuotaMeter count={total} label={t("quota.label", { count: total, max: MAX_SVGS_FREE_TIER })} />
      <Link href="/dashboard/new" className={cn(BUTTON_PRIMARY, "px-5 py-3")}>
        <Plus className="h-4 w-4" />
        {t("createNew")}
      </Link>
    </>
  )

  return (
    <DashboardLayout title={t("title")} description={summary} actions={actions} bleed={isTrulyEmpty}>
      {isTrulyEmpty ? (
        <div className="px-4 pb-6 md:px-6 lg:px-8">
          <DashboardEmptyState />
        </div>
      ) : (
        <div className="space-y-6">
          {total >= FILTERS_FROM && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label={t("filterByStatus")}
                className={cn(SEGMENTED, "max-w-full overflow-x-auto")}
              >
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={statusFilter === filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className={segment(statusFilter === filter.id)}
                  >
                    {filter.label}
                    <span className="font-mono text-[11px] font-normal opacity-80">{filter.count}</span>
                  </button>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className={BUTTON_SECONDARY_SM} aria-label={t("sortBy")}>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {t(SORT_OPTIONS.find((option) => option.id === sortBy)!.key)}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl border-2 border-foreground p-1.5 shadow-[4px_4px_0_0_hsl(var(--primary))]"
                >
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuRadioItem key={option.id} value={option.id} className="rounded-lg">
                        {t(option.key)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* One card per SVG, the published image at its real width (the full-width ones
              take both columns). */}
          <div className="grid items-start gap-7 lg:grid-cols-2">
            {svgsLoading && total === 0
              ? Array.from({ length: 2 }).map((_, index) => <CardSkeleton key={index} />)
              : shown.map((svg, index) => (
                  <SvgLibraryCard
                    key={svg.id}
                    svg={svg}
                    index={index}
                    imageErrored={imageErrors.has(svg.id)}
                    onImageError={() => setImageErrors((prev) => new Set(prev).add(svg.id))}
                    onImageLoad={() => forgetImageError(svg.id)}
                    onCopyUrl={() => handleCopyUrl(svg)}
                    onView={() => router.push(`/dashboard/${svg.id}`)}
                    onEdit={() => router.push(`/dashboard/${svg.id}/edit`)}
                    onForceGenerate={() => handleForceGenerate(svg)}
                    onDelete={() => setSvgToDelete(svg.id)}
                    isGenerating={generatingId === svg.id}
                    isDeleting={deletingId === svg.id}
                    t={t}
                  />
                ))}
          </div>

          {/* A filter with no match (the library itself is not empty: that is the onboarding). */}
          {shown.length === 0 && !svgsLoading && (
            <div className={cn(STICKER, "mx-auto max-w-md px-6 py-10 text-center")}>
              <h3 className="font-heading text-xl font-extrabold">{t("noResultsFound")}</h3>
              <p className="mx-auto mb-6 mt-2 text-sm text-muted-foreground">{t("noResultsDescription")}</p>
              <Button variant="outline" onClick={() => setStatusFilter("all")}>
                {t("clearFilter")}
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={svgToDelete !== null} onOpenChange={(open) => !open && setSvgToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>{t("deleteDialog.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSvgToDelete(null)}>
              {t("deleteDialog.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deletingId !== null}>
              {deletingId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                t("deleteDialog.confirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

/** The free plan's use: an ink-bordered bar and the count. */
function QuotaMeter({ count, label }: { count: number; label: string }) {
  const atLimit = count >= MAX_SVGS_FREE_TIER
  return (
    <div className="flex items-center gap-2.5" title={label}>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={MAX_SVGS_FREE_TIER}
        aria-valuenow={count}
        className="h-3 w-28 overflow-hidden rounded-full border-2 border-foreground bg-card"
      >
        <span
          className={cn("block h-full", atLimit ? "bg-amber-400" : "bg-cyan-400")}
          style={{ width: `${Math.min(100, (count / MAX_SVGS_FREE_TIER) * 100)}%` }}
        />
      </div>
      <span className="font-mono text-[12px] text-muted-foreground">
        {count}/{MAX_SVGS_FREE_TIER}
      </span>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className={cn(STICKER, "overflow-hidden")} aria-hidden>
      <div className="h-56 animate-pulse bg-muted/60" />
      <div className="flex items-center gap-3 border-t-2 border-foreground px-5 py-4">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
