import React from "react"
import { randomString } from "source/helpers/string"
import { TerminalLineProps } from "../types"
import TerminalLine from "./TerminalLine"

interface Props {
  data: TerminalLineProps[]
}

function TerminalList({ data }: Props): JSX.Element {
  return (
    <>
      {data.map((item) => (
        <TerminalLine key={randomString()} {...item} />
      ))}
    </>
  )
}

export default TerminalList
