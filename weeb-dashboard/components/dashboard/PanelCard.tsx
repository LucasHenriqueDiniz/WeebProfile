import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

/**
 * Card shell for the SVG page's side panels: an ink border without the hard shadow, so a
 * column of them stays quieter than the preview they sit next to.
 */
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
    <div className="rounded-2xl border-2 border-foreground bg-card">
      <div className="flex items-center gap-2 border-b-2 border-foreground/15 px-4 py-2.5">
        <Icon className="h-4 w-4 text-foreground" />
        <span className="font-heading text-[15px] font-bold text-foreground">{title}</span>
        {action ? <span className="ml-auto">{action}</span> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
