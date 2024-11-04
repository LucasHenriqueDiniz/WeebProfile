function splitString(envString: string | undefined | string[]): string[] {
  // string example "PLUGIN_SECTIONS: anime, manga" => { PLUGIN_SECTIONS: ["anime", "manga"] }
  if (!envString) {
    return []
  }
  if (Array.isArray(envString)) {
    return envString
  }
  try {
    return envString.split(",").map((s) => s.trim())
  } catch (e) {
    throw new Error("Failed to split string, envString: " + envString + ", error: " + e)
  }
}

function randomString(length = 6) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let result = ""
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export default function randomColorWithString(str: string): string {
  const hash = Array.from(str).reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0)
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  return "#" + "00000".substring(0, 6 - c.length) + c
}

function treatJapaneseName(name: string): string {
  if (name.split(",").length !== 2) {
    return name
  } else {
    return name.split(",")[0] + " " + name.split(",")[1]
  }
}

export { splitString, randomString, randomColorWithString, treatJapaneseName }
