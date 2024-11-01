import React from "react"
import randomString from "core/utils/randomString"
import { ListItemProps } from "../types"

function TerminalListItem({ right, left }: ListItemProps): JSX.Element {
  return (
    <div className='terminal-list-item'>
      <span className='text-bold text-overflow sm-text text-warning'>{right}</span>
      <span className='text-muted ml-auto sm-text'>{left}</span>
    </div>
  )
}

interface Props {
  data: ListItemProps[]
}

function TerminalList({ data }: Props): JSX.Element {
  return (
    <>
      {data.map((item) => (
        <TerminalListItem key={randomString()} {...item} />
      ))}
    </>
  )
}

export default TerminalList
