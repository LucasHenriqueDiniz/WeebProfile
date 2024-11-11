import React from "react"
import { GoDotFill } from "react-icons/go"
import { LiaWindowCloseSolid, LiaWindowMaximizeSolid, LiaWindowMinimize } from "react-icons/lia"

const LeftSection = () => {
  return (
    <div className="flex items-center gap-[0.1rem]">
      <GoDotFill className="text-red-500" />
      <GoDotFill className="text-yellow-500" />
      <GoDotFill className="text-green-500" />
    </div>
  )
}

const UrlSection = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <span className="truncate text-center text-sm text-terminal-muted">
        <span className="font-bold text-terminal-success">root</span>@
        <span className="font-bold text-terminal-success">weeb-profile</span>: ~
      </span>
    </div>
  )
}

const RightSection = () => {
  return (
    <div className="flex items-center gap-1">
      <LiaWindowMinimize className="half-mode:hidden" />
      <LiaWindowMaximizeSolid className="half-mode:hidden" />
      <LiaWindowCloseSolid />
    </div>
  )
}

function TerminalHeader(): JSX.Element {
  return (
    <div className="terminal-header">
      <LeftSection />
      <UrlSection />
      <RightSection />
    </div>
  )
}

export default TerminalHeader
