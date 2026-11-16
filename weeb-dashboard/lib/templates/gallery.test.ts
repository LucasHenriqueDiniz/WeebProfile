import { describe, expect, it } from "vitest"
import type { Template } from "@/types/template"
import { distinctValues, showsGalleryToolbar, sortTemplates } from "./gallery"

// The three public templates in production, as /api/templates?public=true returns them
// (ids shortened), plus a later one to tell the dates apart.
const template = (over: Partial<Template>): Template => ({
  id: "24631805e9b581180f00b670638a0fe3",
  name: "Developer Showcase",
  description: "",
  preview: "",
  platforms: ["github"],
  style: "default",
  theme: "purple",
  size: "full",
  ...over,
})

const gallery = [
  template({ id: "24631805e9b581180f00b670638a0fe3", name: "Developer Showcase", createdAt: "2026-07-22 22:17:13" }),
  template({
    id: "eac59bb5481ce60dc57bf2090ef24c3b",
    name: "Anime & Music",
    style: "terminal",
    theme: "pink",
    createdAt: "2026-07-22 22:17:13",
  }),
  template({
    id: "d7ed90cfffbbd466cec24ff05ba3abb9",
    name: "Gamer Stats",
    theme: "cyan",
    createdAt: "2026-08-01 10:00:00",
  }),
]

describe("templates gallery", () => {
  it("leaves out search and filters while every template fits on screen", () => {
    expect(showsGalleryToolbar(3)).toBe(false)
    expect(showsGalleryToolbar(6)).toBe(false)
    expect(showsGalleryToolbar(7)).toBe(true)
  })

  it("offers only the styles and themes some template has", () => {
    expect(distinctValues(gallery, "style")).toEqual(["default", "terminal"])
    expect(distinctValues(gallery, "theme")).toEqual(["cyan", "pink", "purple"])
  })

  it("sorts by creation date, not by the UUID", () => {
    expect(sortTemplates(gallery, "newest").map((t) => t.name)[0]).toBe("Gamer Stats")
    expect(
      sortTemplates(gallery, "oldest")
        .map((t) => t.name)
        .at(-1)
    ).toBe("Gamer Stats")
  })

  it("keeps the API order for templates without a date", () => {
    const undated = gallery.map(({ createdAt: _, ...rest }) => rest)
    expect(sortTemplates(undated, "newest").map((t) => t.id)).toEqual(undated.map((t) => t.id))
  })
})
