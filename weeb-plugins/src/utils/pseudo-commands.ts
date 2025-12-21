/**
 * Gera comandos pseudo-terminal
 */

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
  size?: "half" | "full"
}

export function getPseudoCommands({
  plugin,
  section,
  username,
  period,
  limit,
  min,
  type,
  prefix = "run",
  command = "view",
  size = "full",
}: PseudoCommandProps): string {
  let cmd = `${prefix} ${plugin}`

  if (size === "half") {
    // Versão curta para 400px
    return `${cmd} ${username ? username.trim() + " " : ""}${section}`
  }

  // Versão completa (800px)
  cmd += ` ${command} ${section}`

  // Adicionar parâmetros
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
