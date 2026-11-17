import { describe, expect, it } from "vitest"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { publicRequiredFields } from "./required-fields"

interface Fields {
  requiredFields?: readonly string[]
  essentialConfigKeysMetadata?: readonly { key: string }[]
}

const plugins = Object.entries(PLUGINS_METADATA as unknown as Record<string, Fields>)

describe("publicRequiredFields", () => {
  // The wizard draws one input per secret and one per public required field. A required
  // field in neither list has no input, and the wizard can never be finished.
  it.each(plugins.filter(([, meta]) => (meta.requiredFields ?? []).length > 0))(
    "%s: every required field gets an input",
    (_name, meta) => {
      const secretKeys = (meta.essentialConfigKeysMetadata ?? []).map((s) => s.key)
      const withInput = new Set([...secretKeys, ...publicRequiredFields(meta)])

      expect((meta.requiredFields ?? []).filter((field) => !withInput.has(field))).toEqual([])
    }
  )

  it("asks GitHub for the username next to its token", () => {
    expect(publicRequiredFields(PLUGINS_METADATA.github)).toEqual(["username"])
  })

  it("asks Repository for owner and repo next to its token", () => {
    expect(publicRequiredFields(PLUGINS_METADATA.github_repo)).toEqual(["owner", "repo"])
  })

  it("does not ask twice for a field that is also a secret", () => {
    expect(publicRequiredFields(PLUGINS_METADATA.lastfm)).toEqual([])
  })
})
