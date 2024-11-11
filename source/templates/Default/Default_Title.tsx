import React from "react"

interface DefaultTitleProps {
  icon?: JSX.Element
  title: string
  subtitle?: string | null
}

export default function DefaultTitle({ icon, title, subtitle }: DefaultTitleProps): JSX.Element {
  return (
    <div className="w-full max-h-10 overflow-hidden flex mb-1 items-center gap-1.5 border-b border-primary/15 border-solid pb-1 mb-2">
      {icon && icon}
      <div className="flex justify-between w-full">
        <h2 className="text-xl text-shadow">{title}</h2>
        {subtitle && <h3 className="text-sm text-shadow flex justify-end">{subtitle}</h3>}
      </div>
    </div>
  )
}
