import React from "react"
import { randomString } from "source/helpers/string"
import { GridItemProps } from "../types"

interface TerminalGridItemProps extends GridItemProps {
  index: number
}

function TerminalGridItem({ title, subtitle, value, index }: TerminalGridItemProps): JSX.Element {
  const isOdd = index % 2 === 0
  return (
    <>
      <span
        className={`font-semibold w-full truncate text-sm text-terminal-warning pl-1 ${isOdd ? "bg-black/25" : ""}`}
      >
        {title}
      </span>
      {subtitle && (
        <span className={`text-terminal-muted-light w-full text-center truncate text-sm ${isOdd ? "bg-black/25" : ""}`}>
          {subtitle}
        </span>
      )}
      <span
        className={`text-terminal-muted text-sm w-full whitespace-nowrap pr-1 text-end ${isOdd ? "bg-black/25" : ""}`}
      >
        {value}
      </span>
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
          <span className="truncate text-sm text-white font-semibold bg-terminal-highlight text-center px-1">
            {rightText}
          </span>
          {centerText && (
            <span className="truncate text-sm bg-terminal-highlight text-white font-semibold text-center px-1">
              {centerText}
            </span>
          )}
          {leftText && (
            <span className="text-sm whitespace-nowrap bg-terminal-highlight text-white font-semibold text-center px-1">
              {leftText}
            </span>
          )}
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
  const hasSubtitle = data.some((item) => item.subtitle)

  return (
    <div className={`grid grid-cols-2 ${hasSubtitle ? "grid-cols-3" : ""}`}>
      <TerminalGridHeader rightText={rightText} centerText={centerText} leftText={leftText} />
      {data.map((item, index) => (
        <TerminalGridItem key={randomString()} {...item} index={index} />
      ))}
    </div>
  )
}

export default TerminalGrid
