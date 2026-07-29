import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  kicker: string
  kickerClassName?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: "center" | "left"
}

export function SectionHeading({ kicker, kickerClassName, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-[640px]", align === "center" ? "mx-auto text-center" : "")}>
      <div className={cn("text-[11.5px] font-bold tracking-[0.16em]", kickerClassName ?? "text-primary")}>{kicker}</div>
      <h2 className="mt-3.5 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3.5 text-base leading-relaxed text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}
