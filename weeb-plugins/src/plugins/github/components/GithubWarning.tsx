import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import type { GithubData } from "../types"

interface GithubWarningProps {
  warnings: GithubData["warnings"]
  style?: "default" | "terminal"
  size?: "half" | "full"
}

const DefaultWarning = ({ warnings }: { warnings: NonNullable<GithubData["warnings"]> }) => {
  if (!warnings || warnings.length === 0) return null

  // Get the most relevant warning (rate limit > api error > partial data)
  const priorityOrder: Array<NonNullable<GithubData["warnings"]>[number]["type"]> = [
    "rate_limit",
    "auth_error",
    "api_error",
    "partial_data",
  ]
  const sortedWarnings = [...warnings].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.type)
    const bIndex = priorityOrder.indexOf(b.type)
    return aIndex - bIndex
  })
  const mainWarning = sortedWarnings[0]

  if (!mainWarning) return null

  // Map warning types to user-friendly messages
  const warningMessages: Record<string, string> = {
    rate_limit: "API rate limit reached",
    api_error: "API error occurred",
    partial_data: "Some data may be incomplete",
    auth_error: "Authentication error",
  }

  const message = warningMessages[mainWarning.type] || mainWarning.message

  return (
    <div className="flex items-center justify-center py-2 px-3 mt-2">
      <p className="text-xs text-default-muted italic opacity-75">{message}</p>
    </div>
  )
}

const TerminalWarning = ({ warnings }: { warnings: NonNullable<GithubData["warnings"]> }) => {
  if (!warnings || warnings.length === 0) return null

  // Get the most relevant warning
  const priorityOrder: Array<NonNullable<GithubData["warnings"]>[number]["type"]> = [
    "rate_limit",
    "auth_error",
    "api_error",
    "partial_data",
  ]
  const sortedWarnings = [...warnings].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.type)
    const bIndex = priorityOrder.indexOf(b.type)
    return aIndex - bIndex
  })
  const mainWarning = sortedWarnings[0]

  if (!mainWarning) return null

  const warningMessages: Record<string, string> = {
    rate_limit: "API rate limit reached",
    api_error: "API error occurred",
    partial_data: "Some data may be incomplete",
    auth_error: "Authentication error",
  }

  const message = warningMessages[mainWarning.type] || mainWarning.message

  return (
    <div className="py-1 px-2 mt-1">
      <p className="text-xs text-terminal-muted italic opacity-70"># {message}</p>
    </div>
  )
}

export function GithubWarning({
  warnings,
  style = "default",
  size = "half",
}: GithubWarningProps): React.ReactElement | null {
  if (!warnings || warnings.length === 0) {
    return null
  }

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<DefaultWarning warnings={warnings} />}
      terminalComponent={<TerminalWarning warnings={warnings} />}
    />
  )
}
