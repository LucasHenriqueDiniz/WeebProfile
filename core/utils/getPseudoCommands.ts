interface PseudoCommandProps {
  plugin: string
  section: string
  username?: string
  period?: string
  limit?: number
  min?: number
  type?: string
}

function getPseudoCommands({ plugin, section, username, period, limit, min, type }: PseudoCommandProps): string {
  let command = `${plugin} --${section}`

  if (username) command += ` --user=${username}`
  if (period) command += ` --period=${period.replace("Last ", "").replace(" days", "d")}`
  if (limit) command += ` --limit=${limit}`
  if (min) command += ` --min=${min}`
  if (type) command += ` --type=${type}`

  return command
}

export default getPseudoCommands
