import React from "react"
import type { GridItemProps } from "../types"

interface TerminalGridProps {
  data: GridItemProps[]
  rightText?: string
  centerText?: string
  leftText?: string
}

/**
 * Every row fills every column. The grid takes a third column when any item has a
 * subtitle, and it used to leave the cell out of the header when there was no
 * `centerText`, and out of an item when that item had no subtitle. The cells after it
 * then moved up a column: with a two-cell header the first item's title sat in the header
 * row, and a list where some repositories have a description drew a different number of
 * rows than items, so the height the plugins compute (header plus one row per item) was
 * wrong both ways.
 */
function TerminalGridItem({
  title,
  subtitle,
  value,
  index,
  columns,
}: GridItemProps & { index: number; columns: 2 | 3 }): React.ReactElement {
  const isOdd = index % 2 === 0
  return (
    <>
      <span
        className={`font-semibold w-full truncate text-sm text-terminal-warning pl-1 ${isOdd ? "bg-terminal-stripe" : ""}`}
      >
        {title}
      </span>
      {columns === 3 && (
        <span
          className={`text-terminal-muted-light w-full text-center truncate text-sm ${isOdd ? "bg-terminal-stripe" : ""}`}
        >
          {subtitle}
        </span>
      )}
      <span
        className={`text-terminal-muted text-sm w-full whitespace-nowrap pr-1 text-end ${isOdd ? "bg-terminal-stripe" : ""}`}
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
  columns,
}: {
  rightText?: string
  centerText?: string
  leftText?: string
  columns: 2 | 3
}): React.ReactElement {
  if (!rightText) return <></>
  return (
    <>
      <span className="truncate text-sm text-white font-semibold bg-terminal-highlight text-center px-1">
        {rightText}
      </span>
      {columns === 3 ? (
        <>
          <span className="truncate text-sm bg-terminal-highlight text-white font-semibold text-center px-1">
            {centerText}
          </span>
          <span className="text-sm whitespace-nowrap bg-terminal-highlight text-white font-semibold text-center px-1">
            {leftText}
          </span>
        </>
      ) : (
        // Two columns have no middle one: the last header names the value column.
        <span className="text-sm whitespace-nowrap bg-terminal-highlight text-white font-semibold text-center px-1">
          {leftText || centerText}
        </span>
      )}
    </>
  )
}

export function TerminalGrid({ data, rightText, centerText, leftText }: TerminalGridProps): React.ReactElement {
  const columns = data.some((item) => item.subtitle) ? 3 : 2

  return (
    <div className={`grid ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      <TerminalGridHeader rightText={rightText} centerText={centerText} leftText={leftText} columns={columns} />
      {data.map((item, index) => (
        <TerminalGridItem key={`${index}-${item.title}`} {...item} index={index} columns={columns} />
      ))}
    </div>
  )
}
