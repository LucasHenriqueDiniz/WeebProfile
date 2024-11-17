import React from "react"

interface DefaultTitleProps {
  icon?: JSX.Element
  title: string
  subtitle?: string | null
}

export default function DefaultTitle({ icon, title, subtitle }: DefaultTitleProps): JSX.Element {
  return (
    <div className="w-full overflow-hidden flex items-center gap-1.5 border-0 border-b border-default-highlight border-solid pb-0.5 my-1.5">
      {icon && React.cloneElement(icon, { className: "text-default-highlight" })}
      <div className="flex justify-between w-full">
        <h2 className="text-xl text-muted">{title}</h2>
        {subtitle && <h3 className="text-sm flex items-end">{subtitle}</h3>}
      </div>
    </div>
  )
}
