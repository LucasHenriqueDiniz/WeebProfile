import { readFileSync } from "node:fs"
import path from "node:path"

type Messages = Record<string, unknown>

export function pluginMessages(plugin: string, locale: string): Messages {
  const file = path.join(__dirname, "../../messages/plugins", plugin, `${locale}.json`)
  return JSON.parse(readFileSync(file, "utf-8"))
}

/** What tWithFallback does, over the files the site loads: "about.sections..." → text. */
export function translator(locale: string) {
  return (key: string, fallback: string) => {
    const [plugin, ...rest] = key.split(".")
    let node: unknown = pluginMessages(plugin!, locale)
    for (const part of rest) node = (node as Messages | undefined)?.[part]
    return typeof node === "string" ? node : fallback
  }
}
