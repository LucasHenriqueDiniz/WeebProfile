/**
 * TerminalCommand - Exibe comando no estilo terminal Linux
 * Estilo autêntico de terminal com prompt destacado e comando em monospace
 *
 * With card animations on, the command is typed out behind a block cursor
 * (styles/animations.ts). The extra markup exists only then.
 */

import React from "react"
import { useAnimations } from "../animations"

interface TerminalCommandProps {
  command: string
  prompt?: string
  className?: string
}

export function TerminalCommand({ command, prompt = "$", className = "" }: TerminalCommandProps): React.ReactElement {
  const animations = useAnimations()

  return (
    <div
      className={`flex items-center gap-2 px-1 py-0.5 text-nowrap overflow-ellipsis overflow-hidden ${className}${
        animations ? " weeb-cmd" : ""
      }`}
      style={{
        fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
    >
      <span
        className="text-terminal-highlight font-bold select-none"
        style={{
          fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
          fontSize: "0.875rem",
          fontWeight: 700,
        }}
      >
        {prompt}
      </span>
      <span
        className={animations ? "font-medium weeb-cmd-text" : "font-medium"}
        style={{
          fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
          fontSize: "0.875rem",
          color: "var(--terminal-color-default)",
          ...(animations ? { ["--weeb-chars" as string]: Math.max(1, [...command].length) } : {}),
        }}
      >
        {animations ? (
          <>
            <span className="weeb-cmd-chars">{command}</span>
            <span className="weeb-cmd-cursor" aria-hidden="true" />
          </>
        ) : (
          command
        )}
      </span>
    </div>
  )
}
