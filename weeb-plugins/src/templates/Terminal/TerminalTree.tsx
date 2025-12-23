/**
 * TerminalTree - Árvore para estilo terminal
 */

import React from 'react'
import type { GridItemProps } from '../types.js'

interface TerminalTreeProps {
  data: GridItemProps[]
  title: string
}

const TerminalTree = ({ data, title }: TerminalTreeProps): React.ReactElement => {
  const renderTreeItem = (item: GridItemProps, last = false) => {
    const { title, subtitle, value } = item

    const T = () => <span className="text-terminal-raw">├──</span>
    const S = () => <span className="text-terminal-raw">│</span>
    const L = () => <span className="text-terminal-raw">└──</span>
    const N = () => <span></span>

    return (
      <div className="flex flex-col text-sm" key={title}>
        <div className="font-bold grid grid-cols-[30px_1fr] truncate">
          {last ? <L /> : <T />} {title}
        </div>
        <div className="text-terminal-muted grid grid-cols-[30px_min-content_1fr] truncate">
          {subtitle && (
            <>
              {last ? <N /> : <S />}
              <T /> <span>{subtitle}</span>
            </>
          )}
        </div>
        <div className="text-terminal-muted grid grid-cols-[30px_min-content_1fr] truncate">
          {last ? <N /> : <S />}
          <L /> <span>{value}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="text-terminal-raw text-md font-semibold border-b border-terminal-muted-light px-2 mx-[3px]">
        {title}
      </div>
      {data.map((item, index) => renderTreeItem(item, index === data.length - 1))}
    </>
  )
}

export default TerminalTree

