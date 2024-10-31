export default function generateRandomColorWithString(str: string): string {
  const hash = Array.from(str).reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0)
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  return "#" + "00000".substring(0, 6 - c.length) + c
}
