import { describe, it, expect } from "vitest"
import {
  svgCreateSchema,
  svgUpdateSchema,
  templateCreateSchema,
  templateUpdateSchema,
  profileUpdateSchema,
} from "./validation"

const accepts = (schema: { safeParse: (v: unknown) => { success: boolean } }, body: unknown) =>
  schema.safeParse(body).success

describe("svgCreateSchema", () => {
  it("accepts a minimal body", () => {
    expect(accepts(svgCreateSchema, { name: "My Card" })).toBe(true)
  })

  it("fills the same defaults the hand-written destructuring used to", () => {
    const parsed = svgCreateSchema.parse({ name: "Defaults" })
    expect(parsed).toMatchObject({
      entityType: "profile",
      artifactType: "profile_card",
      variant: "default",
      style: "default",
      size: "half",
      theme: "default",
      pluginsConfig: {},
      uiConfig: {},
    })
  })

  it.each([
    ["name missing", {}],
    // This one is why the schema exists: a non-string name reached .toLowerCase()
    // in the slug builder and came back as a 500 rather than a 400.
    ["name is a number", { name: 123 }],
    ["name is an object", { name: { a: 1 } }],
    ["name is only whitespace", { name: "   " }],
    ["unknown style", { name: "x", style: "hacker" }],
    ["unknown size", { name: "x", size: "gigante" }],
    ["unknown entityType", { name: "x", entityType: "admin" }],
    ["pluginsConfig is an array", { name: "x", pluginsConfig: [1, 2] }],
    ["body is a string", "pwned"],
    ["body is null", null],
  ])("rejects when %s", (_label, body) => {
    expect(accepts(svgCreateSchema, body)).toBe(false)
  })

  it("bounds customCss length", () => {
    expect(accepts(svgCreateSchema, { name: "x", customCss: ".a{color:red}" })).toBe(true)
    expect(accepts(svgCreateSchema, { name: "x", customCss: "a".repeat(30_000) })).toBe(false)
  })
})

describe("svgUpdateSchema", () => {
  it("accepts an empty patch", () => {
    expect(accepts(svgUpdateSchema, {})).toBe(true)
  })

  it("keeps booleans boolean", () => {
    expect(accepts(svgUpdateSchema, { isPaused: true })).toBe(true)
    expect(accepts(svgUpdateSchema, { isPaused: "sim" })).toBe(false)
  })
})

describe("templateCreateSchema", () => {
  it("accepts a minimal body and defaults isPublic to false", () => {
    const parsed = templateCreateSchema.parse({ name: "My Template" })
    expect(parsed.isPublic).toBe(false)
  })

  // isPublic decides whether a template is readable by other people, so it is the
  // last field that should accept a loosely-typed value.
  it.each([
    ["the string true", "true"],
    ["the number 1", 1],
  ])("rejects isPublic as %s", (_label, isPublic) => {
    expect(accepts(templateCreateSchema, { name: "x", isPublic })).toBe(false)
  })

  it("accepts isPublic as a real boolean", () => {
    expect(accepts(templateCreateSchema, { name: "x", isPublic: true })).toBe(true)
  })

  it("bounds description length", () => {
    expect(accepts(templateCreateSchema, { name: "x", description: "d".repeat(600) })).toBe(false)
  })

  // Deliberate: bounding shape is not sanitising CSS. Containment for hostile CSS
  // is the preview iframe, not this schema -- see PreviewSvgContainer.
  it("does not attempt to reject hostile CSS", () => {
    expect(accepts(templateCreateSchema, { name: "x", customCss: "@import url(https://evil)" })).toBe(true)
  })
})

describe("templateUpdateSchema", () => {
  it("accepts an empty patch and single-field patches", () => {
    expect(accepts(templateUpdateSchema, {})).toBe(true)
    expect(accepts(templateUpdateSchema, { customCss: ".a{}" })).toBe(true)
  })

  it("still rejects a mistyped isPublic", () => {
    expect(accepts(templateUpdateSchema, { isPublic: "sim" })).toBe(false)
  })
})

describe("profileUpdateSchema", () => {
  it("accepts either field alone", () => {
    expect(accepts(profileUpdateSchema, { username: "lucas" })).toBe(true)
    expect(accepts(profileUpdateSchema, { essentialConfigs: { steam: { apiKey: "abc" } } })).toBe(true)
  })

  it("accepts a null username, which clears it", () => {
    expect(accepts(profileUpdateSchema, { username: null })).toBe(true)
  })

  it.each([
    ["the body is empty", {}],
    ["username is a number", { username: 123 }],
    ["essentialConfigs is a string", { essentialConfigs: "pwned" }],
    ["essentialConfigs is an array", { essentialConfigs: [] }],
    ["a secret value is a number", { essentialConfigs: { steam: { apiKey: 999 } } }],
    ["a secret value is nested", { essentialConfigs: { steam: { apiKey: { a: 1 } } } }],
    ["a plugin name is empty", { essentialConfigs: { "": { apiKey: "x" } } }],
  ])("rejects when %s", (_label, body) => {
    expect(accepts(profileUpdateSchema, body)).toBe(false)
  })

  // Every leaf key is one D1 upsert, so the caps bound write amplification as much
  // as they bound types.
  it("caps the number of plugins", () => {
    const configs = Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`plugin${i}`, { apiKey: "x" }]))
    expect(accepts(profileUpdateSchema, { essentialConfigs: configs })).toBe(false)
  })

  it("caps the number of keys per plugin", () => {
    const keys = Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`key${i}`, "x"]))
    expect(accepts(profileUpdateSchema, { essentialConfigs: { steam: keys } })).toBe(false)
  })

  it("bounds secret length", () => {
    expect(accepts(profileUpdateSchema, { essentialConfigs: { steam: { apiKey: "a".repeat(5000) } } })).toBe(false)
  })

  it("never echoes a secret back in the validation error", () => {
    const secret = "SUPER-SECRET-VALUE-123".repeat(300)
    const result = profileUpdateSchema.safeParse({ essentialConfigs: { steam: { apiKey: secret } } })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(JSON.stringify(result.error.issues)).not.toContain("SUPER-SECRET-VALUE")
    }
  })
})
