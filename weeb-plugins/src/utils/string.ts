/**
 * Utilitários de string
 */

export function randomString(length = 6): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let result = ""
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function randomColorWithString(str: string): string {
  const hash = Array.from(str).reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0)
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  return "#" + "00000".substring(0, 6 - c.length) + c
}

export function treatJapaneseName(name: string): string {
  if (name.split(",").length !== 2) {
    return name
  } else {
    return name.split(",")[0] + " " + name.split(",")[1]
  }
}
