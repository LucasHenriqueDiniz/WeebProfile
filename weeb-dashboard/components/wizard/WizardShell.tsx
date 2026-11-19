"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Eye,
  ListOrdered,
  Paintbrush,
  SlidersHorizontal,
  UserCircle2,
} from "lucide-react"
import { Link, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import { BUTTON_ICON, HALFTONE, SEGMENTED, TILE, TONE, segment } from "@/components/landing/sticker"
import { PreferencesMenu } from "@/components/layout/preferences"
import { FitWidth } from "@/components/preview/FitWidth"
import { WizardFooter, type WizardFooterProps } from "./WizardFooter"

import type { WizardTab } from "@/hooks/useWizardUIState"

export type { WizardTab }

interface WizardShellProps {
  activeTab: WizardTab
  onTabChange: (tab: WizardTab) => void
  /** The row of plugins above the card; null when the wizard has a single fixed one (Repository). */
  pluginStrip: ReactNode | null
  pluginDetail: ReactNode
  /** Null when there is nothing to reorder (Repository is always one item): no "Order" tab. */
  orderConfig?: ReactNode | null
  styleConfig: ReactNode
  preview: ReactNode
  footerProps: WizardFooterProps
  selectedPlugin: string | null
  /** Store-agnostic: each wizard (profile or repository) supplies its own slice. */
  name: string
  kind: "profile" | "repository"
  style: "default" | "terminal"
  setStyle: (style: "default" | "terminal") => void
  size: "half" | "full"
  setSize: (size: "half" | "full") => void
  contentCount: number
  /** Opens the first plugin with a pending setting. Without it the notice is plain text. */
  onShowPending?: () => void
}

/** Phones and tablets show one of the two areas at a time. */
type MobileView = "edit" | "preview"

/**
 * The wizard's workspace: the card in the middle, as it will look, with the plugins in a
 * row above it, the settings of the one picked in a drawer on the right, and the style
 * and width in a toolbar floating under the card.
 *
 * It replaced three columns (plugin list | settings | preview) with two rows of tabs on
 * phones, where "Plugins" showed up twice.
 */
export function WizardShell({
  activeTab,
  onTabChange,
  pluginStrip,
  pluginDetail,
  orderConfig,
  styleConfig,
  preview,
  footerProps,
  selectedPlugin,
  name,
  kind,
  style,
  setStyle,
  size,
  setSize,
  contentCount,
  onShowPending,
}: WizardShellProps) {
  const t = useTranslations("wizard.plugins")
  const tOrder = useTranslations("wizard.order")
  const tShell = useTranslations("wizard.shell")
  const tWizard = useTranslations("wizard")
  const tNew = useTranslations("dashboard.newPage")
  const router = useRouter()
  const contentWidth = size === "half" ? 415 : 830
  const [mobileView, setMobileView] = useState<MobileView>("edit")
  const drawerRef = useRef<HTMLDivElement>(null)

  // A new plugin is a new context: the drawer goes back to its top, and on a phone the
  // settings come forward.
  useEffect(() => {
    if (drawerRef.current) drawerRef.current.scrollTop = 0
    if (selectedPlugin) setMobileView("edit")
  }, [selectedPlugin])

  const openTab = (tab: WizardTab) => {
    onTabChange(tab)
    setMobileView("edit")
  }

  const missingCount = footerProps.missingConfigs.length
  const kindLabel = kind === "repository" ? tNew("repoTitle") : tNew("profileTitle")
  const tabs: { id: WizardTab; label: string; Icon: typeof SlidersHorizontal }[] = [
    {
      id: "plugins",
      label: kind === "repository" ? tNew("repoTitle") : tWizard("tabs.plugins"),
      Icon: SlidersHorizontal,
    },
    ...(orderConfig ? [{ id: "order" as const, label: tOrder("tab"), Icon: ListOrdered }] : []),
    { id: "style", label: tWizard("tabs.style"), Icon: Paintbrush },
  ]

  const stage = (
    <div className="relative flex min-h-full flex-col">
      <div
        aria-hidden
        className={cn(
          HALFTONE,
          "left-0 top-0 h-48 w-72 [mask-image:linear-gradient(to_bottom_right,black,transparent)]"
        )}
      />
      <div
        className={cn(
          "relative flex w-full flex-1 justify-center px-4 py-6 lg:px-8 lg:py-10",
          contentCount > 0 ? "items-start" : "items-center"
        )}
      >
        {contentCount > 0 ? (
          // Scaled down to the column instead of cut off by it. +4 is the frame's 2px
          // border on each side; FitWidth clips whatever is inside it, so the hard
          // shadow would be cut: the frame gets an ink border only.
          <FitWidth width={contentWidth + 4}>
            <div className="w-fit overflow-hidden rounded-xl border-2 border-foreground bg-background">{preview}</div>
          </FitWidth>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex max-w-sm flex-col items-center gap-4 text-center"
          >
            <img src="/sora/sora_main.png" alt="" className="h-24 w-24 object-contain" draggable={false} />
            <div>
              <p className="font-heading text-lg font-extrabold text-foreground">{tShell("emptyTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("enablePluginToPreview")}</p>
            </div>
            {kind === "profile" && (
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline decoration-2 underline-offset-4"
              >
                {tShell("startFromTemplate")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {/* The style and the width, under the card they change. */}
      <div className="sticky bottom-4 z-10 mx-auto mb-4 flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-foreground bg-card px-2 py-1.5 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
        <div role="group" aria-label={tWizard("tabs.style")} className="flex items-center">
          {(["default", "terminal"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={style === option}
              onClick={() => setStyle(option)}
              className={cn(segment(style === option), "px-2.5 py-1 font-mono text-[12px]")}
            >
              {option}
            </button>
          ))}
        </div>
        <span className="hidden h-5 w-px bg-foreground/20 sm:block" aria-hidden />
        <div role="group" aria-label={`${tShell("halfWidth")} / ${tShell("fullWidth")}`} className="flex items-center">
          {(["half", "full"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={size === option}
              onClick={() => setSize(option)}
              className={cn(segment(size === option), "px-2.5 py-1 text-[12px]")}
            >
              {option === "half" ? tShell("halfWidth") : tShell("fullWidth")}
            </button>
          ))}
        </div>
        <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">{contentWidth}px</span>
      </div>
    </div>
  )

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex flex-shrink-0 items-center gap-3 border-b-2 border-foreground bg-card px-4 py-2.5 lg:px-5">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={cn(BUTTON_ICON, "-ml-1.5")}
          aria-label={tShell("back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        {/* The same tile and colour as the "Create new" cards, so the choice made there is
            recognisable here. */}
        <span
          aria-hidden
          className={cn(TILE, "hidden h-9 w-9 sm:flex", kind === "repository" ? TONE.violet : TONE.cyan)}
        >
          {kind === "repository" ? (
            <BookMarked className="h-[18px] w-[18px]" />
          ) : (
            <UserCircle2 className="h-[18px] w-[18px]" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-lg font-extrabold leading-tight text-foreground">
            {name || tShell("newSvg")}
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {kindLabel}
            {contentCount > 0 && <> · {tShell("activePlugins", { count: contentCount })}</>}
          </p>
        </div>
        {/* The one notice of pending settings on desktop; below lg the footer carries it. */}
        {missingCount > 0 &&
          (onShowPending ? (
            <button
              type="button"
              onClick={() => {
                onShowPending()
                setMobileView("edit")
              }}
              className="hidden whitespace-nowrap rounded-lg border-2 border-foreground bg-amber-300 px-2.5 py-1 text-[12px] font-bold text-slate-950 transition-colors hover:bg-amber-200 lg:inline-flex"
            >
              {tShell("pendingConfigs", { count: missingCount })}
            </button>
          ) : (
            <span className="hidden whitespace-nowrap rounded-lg border-2 border-foreground bg-amber-300 px-2.5 py-1 text-[12px] font-bold text-slate-950 lg:inline-flex">
              {tShell("pendingConfigs", { count: missingCount })}
            </span>
          ))}
        <PreferencesMenu tone="theme" className="hidden md:inline-flex" />
        <div className="hidden lg:block">
          <WizardFooter {...footerProps} compact />
        </div>
      </header>

      {pluginStrip}

      {/* Phones and tablets: one row of tabs, the drawer's plus the preview, so the
          settings and the card are never squeezed side by side. */}
      <div className="flex-shrink-0 border-b-2 border-foreground bg-background px-4 py-2 lg:hidden">
        <div role="tablist" aria-label={tShell("configure")} className={cn(SEGMENTED, "flex w-full overflow-x-auto")}>
          {tabs.map(({ id, label, Icon }) => {
            const on = mobileView === "edit" && activeTab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => openTab(id)}
                className={cn(segment(on), "flex-1 justify-center px-2")}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            )
          })}
          <button
            type="button"
            role="tab"
            aria-selected={mobileView === "preview"}
            onClick={() => setMobileView("preview")}
            className={cn(segment(mobileView === "preview"), "flex-1 justify-center px-2")}
          >
            <Eye className="h-3.5 w-3.5" />
            {tWizard("sidebar.preview")}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* All areas stay mounted and only switch visibility, so changing tabs never
            remounts the live preview (the card would restart its animations). */}
        <main
          className={cn(
            "min-w-0 flex-1 overflow-y-auto bg-muted/40",
            mobileView === "preview" ? "block" : "hidden lg:block"
          )}
        >
          {stage}
        </main>

        <aside
          className={cn(
            "min-h-0 w-full flex-col border-foreground bg-background lg:flex lg:w-[440px] lg:flex-none lg:border-l-2 xl:w-[520px] 2xl:w-[600px]",
            mobileView === "edit" ? "flex" : "hidden"
          )}
        >
          <div className="hidden flex-shrink-0 border-b-2 border-foreground/15 px-4 py-2.5 lg:block lg:px-5">
            <div role="tablist" aria-label={tShell("configure")} className={SEGMENTED}>
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => openTab(id)}
                  className={segment(activeTab === id)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div ref={drawerRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className={activeTab === "plugins" ? "block" : "hidden"}>{pluginDetail}</div>
            {orderConfig && <div className={activeTab === "order" ? "block p-4 lg:p-5" : "hidden"}>{orderConfig}</div>}
            <div className={activeTab === "style" ? "block p-4 lg:p-5" : "hidden"}>{styleConfig}</div>
          </div>
        </aside>
      </div>

      {/* The main action stays at hand on phones whatever is shown; on desktop it is in the bar. */}
      <div className="flex-shrink-0 border-t-2 border-foreground bg-card px-4 py-3 lg:hidden">
        <WizardFooter {...footerProps} />
      </div>
    </div>
  )
}
