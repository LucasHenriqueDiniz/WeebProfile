import { EnvironmentManager } from "source/plugins/@utils/EnvManager"

interface PseudoCommandProps {
  plugin: string
  section: string
  username?: string
  period?: string
  limit?: number
  min?: number
  type?: string
  prefix?: string
  command?: string
}

function getPseudoCommands({
  plugin,
  section,
  username,
  period,
  limit,
  min,
  type,
  prefix = "run",
  command = "view",
}: PseudoCommandProps): string {
  const env = EnvironmentManager.getInstance().getEnv()
  const variant = env.half_mode ? "half" : "full"

  let cmd = `${prefix} ${plugin}`

  if (variant === "half") {
    // Shorter version for 400px
    return `${cmd} ${username ? username.trim() + " " : ""}${section}`
  }

  // Full version (800px)
  cmd += ` ${command} ${section}`

  // Add parameters with proper formatting
  if (username) cmd += ` --user=${username.trim()}`
  if (period) {
    const formattedPeriod = period.toLowerCase().replace("last ", "").replace(" days", "d")
    cmd += ` --period=${formattedPeriod}`
  }
  if (limit) cmd += ` --max=${limit}`
  if (min) cmd += ` --min=${min}`
  if (type) cmd += ` --type=${type}`

  return cmd
}

export default getPseudoCommands
