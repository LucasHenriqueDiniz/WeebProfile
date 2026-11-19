"use client"

import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { MobileNav } from "@/components/dashboard/MobileNav"
import { contentContainer, type ContentWidth } from "@/components/layout/page-width"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  /** The page's heading: each route supplies its own. */
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  /**
   * Content width, applied to the heading and the children at once, so a route cannot
   * give its heading one width and its content another.
   */
  width?: ContentWidth
  /** A control before the title, such as back. Kept out of the <h1>. */
  leading?: ReactNode
  /** Content that manages its own width and padding (the onboarding): no container. */
  bleed?: boolean
}

/**
 * The signed-in pages: the rail on desktop, the tab bar on phones, and the page's
 * heading in the content, set like the public site's pages (a big Sora title, the
 * actions on its right) instead of a bar across the top.
 */
export function DashboardLayout({
  children,
  title,
  description,
  actions,
  width = "app",
  leading,
  bleed = false,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <DashboardSidebar />

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-24 md:pb-0">
        {(title || actions) && (
          <div className={cn(contentContainer(width), "pt-5 md:pt-10")}>
            <PageHeading title={title} description={description} actions={actions} leading={leading} />
          </div>
        )}
        {bleed ? children : <div className={cn(contentContainer(width), "py-6 md:py-8")}>{children}</div>}
      </main>

      <MobileNav />
    </div>
  )
}

function PageHeading({
  title,
  description,
  actions,
  leading,
}: Pick<DashboardLayoutProps, "title" | "description" | "actions" | "leading">) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 flex-1 basis-[280px] items-start gap-2">
        {leading}
        <div className="min-w-0">
          {title && (
            <h1 className="break-words font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-[40px]">
              {title}
            </h1>
          )}
          {description && <div className="mt-2 text-[15px] text-muted-foreground">{description}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}
