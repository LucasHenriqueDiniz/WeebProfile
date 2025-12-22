/**
 * DefaultTitle - Título para estilo default
 */

import React from 'react'

interface DefaultTitleProps {
  icon?: React.ReactElement
  title: string
  subtitle?: string | null
}

export function DefaultTitle({ icon, title, subtitle }: DefaultTitleProps): React.ReactElement {
  const iconElement = icon && React.isValidElement(icon) ? (
    <div className="text-default-highlight fill-default-highlight" style={{ fill: 'var(--default-color-highlight)', color: 'var(--default-color-highlight)' }}>
      {React.cloneElement(icon as React.ReactElement<any>, { 
        className: `${(icon as any).props?.className || ''} text-default-highlight fill-default-highlight`.trim(),
        style: { fill: 'var(--default-color-highlight)', color: 'var(--default-color-highlight)' }
      })}
    </div>
  ) : null

  return (
    <div className="w-full overflow-hidden flex items-center gap-1.5 border-0 border-b border-default-highlight border-solid pb-0.5 my-1.5">
      {iconElement}
      <div className="flex justify-between w-full">
        <h2 className="text-xl text-default-highlight font-semibold leading-none">{title}</h2>
        {subtitle && <h3 className="text-sm text-default-muted flex items-end">{subtitle}</h3>}
      </div>
    </div>
  )
}

