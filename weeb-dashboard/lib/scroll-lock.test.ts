import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { describe, expect, it } from "vitest"

/**
 * The `right-scroll-lock` utility (src/globals.css) keeps the fixed header and the toasts
 * still while a Radix menu, dialog, sheet or select has the page scroll locked. It reads a
 * CSS variable that Radix's lock (react-remove-scroll-bar) sets on <body>. If an upgrade
 * renames the variable or drops the library, the utility falls back to 0 without an error
 * and the header slides sideways again (4px in Chrome and Safari, measured 18/11/2026).
 */

const root = path.resolve(__dirname, "..")
const read = (file: string) => readFileSync(path.join(root, file), "utf8")

/** Follows the dependency chain the way the app's bundle resolves it. */
function resolveFrom(chain: string[]): string {
  let from = path.join(root, "package.json")
  for (const name of chain) {
    from = createRequire(from).resolve(name)
  }
  return from
}

const LOCKERS: Record<string, string[]> = {
  "dropdown-menu": ["@radix-ui/react-dropdown-menu", "@radix-ui/react-menu", "react-remove-scroll"],
  "dialog and sheet": ["@radix-ui/react-dialog", "react-remove-scroll"],
  select: ["@radix-ui/react-select", "react-remove-scroll"],
}

function utilityVariable(): string {
  const rule = read("src/globals.css").match(/\.right-scroll-lock\s*\{([^}]*)\}/)
  const variable = rule?.[1].match(/right:\s*var\((--[\w-]+)/)
  if (!variable) throw new Error(".right-scroll-lock { right: var(--...) } not found in src/globals.css")
  return variable[1]
}

describe("right-scroll-lock", () => {
  for (const [component, chain] of Object.entries(LOCKERS)) {
    it(`reads the variable the ${component} lock sets`, () => {
      const bar = createRequire(resolveFrom(chain))("react-remove-scroll-bar") as { removedBarSizeVariable: string }
      expect(utilityVariable()).toBe(bar.removedBarSizeVariable)
    })
  }

  it("is the right edge of the fixed site header, its phone sheet and the toasts", () => {
    const header = read("components/layout/Header.tsx")
    expect(header.match(/"[^"\n]*\bfixed\b[^"\n]*"/g)).toEqual([
      expect.stringContaining(" right-scroll-lock "),
      expect.stringContaining(" right-scroll-lock "),
    ])
    expect(header).not.toMatch(/\bfixed\b[^"\n]*\b(inset-x-0|right-0)\b/)
    expect(read("components/ui/toast.tsx")).toMatch(/\bfixed\b[^"\n]*\bsm:right-scroll-lock\b/)
  })
})
