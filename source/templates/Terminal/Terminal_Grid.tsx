import React from "react"
import randomString from "core/utils/randomString"
import { GridItemProps } from "../types"

function TerminalGridItem({ title, subtitle, value }: GridItemProps): JSX.Element {
  return (
    <>
      <span className='text-bold text-overflow sm-text text-warning'>{title}</span>
      {subtitle && <span className='text-muted-light text-overflow sm-text'>{subtitle}</span>}
      <span className='text-muted sm-text text-nowrap flex-end '>{value}</span>
    </>
  )
}

function TerminalGridHeader({
  rightText,
  centerText,
  leftText,
}: {
  rightText?: string
  centerText?: string
  leftText?: string
}): JSX.Element {
  return (
    <>
      {rightText && (
        <>
          {rightText && <span className='text-bold text-overflow sm-text text-warning border-b'>{rightText}</span>}
          {centerText && <span className='text-muted-light text-overflow sm-text border-b'>{centerText}</span>}
          {leftText && <span className='text-muted sm-text text-nowrap border-b'>{leftText}</span>}
        </>
      )}
    </>
  )
}

interface Props {
  data: GridItemProps[]
  rightText?: string
  centerText?: string
  leftText?: string
}

function TerminalGrid({ data, rightText, centerText, leftText }: Props): JSX.Element {
  let col = 2

  data.forEach((item) => {
    if (item.subtitle) col = 3
  })

  return (
    <div className={`terminal-grid-${col}`}>
      <TerminalGridHeader rightText={rightText} centerText={centerText} leftText={leftText} />
      {data.map((item) => (
        <TerminalGridItem key={randomString()} {...item} />
      ))}
    </div>
  )
}

export default TerminalGrid
