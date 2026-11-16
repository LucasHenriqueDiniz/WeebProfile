import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

/** Compact card shell shared by the SVG page's side panels — quieter than the shadcn Card headers. */
export function PanelCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: LucideIcon
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {action ? <span className="ml-auto">{action}</span> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
