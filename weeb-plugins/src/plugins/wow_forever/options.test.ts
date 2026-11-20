import { describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { visibleData } from "./options"
import { MOCK_DATA } from "./services/mock-data"
import type { WowForeverConfig } from "./types"

const config = (options: Record<string, unknown>, sections = ["journey"]): WowForeverConfig =>
  ({ enabled: true, sections, ...options }) as WowForeverConfig

describe("visibleData", () => {
  it("shows everything by default", () => {
    const data = visibleData(MOCK_DATA, config({}))
    expect(data.journey).toHaveLength(MOCK_DATA.journey.length)
    expect(data.equipment).toHaveLength(MOCK_DATA.equipment.length)
  })

  it("drops each journey number and attribute switched off", () => {
    const data = visibleData(MOCK_DATA, config({ journey_show_deaths: false, stats_show_power: false }))
    expect(data.journey.map((s) => s.key)).not.toContain("deaths")
    expect(data.journey).toHaveLength(MOCK_DATA.journey.length - 1)
    expect(data.stats.map((s) => s.label)).not.toContain("Mana")
  })

  it("drops each equipment slot switched off, by the API's slot type", () => {
    const data = visibleData(MOCK_DATA, config({ equipment_show_finger_1: false, equipment_show_finger_2: false }))
    expect(data.equipment.map((i) => i.slot)).not.toEqual(expect.arrayContaining(["Ring 1"]))
    expect(data.equipment.map((i) => i.slot)).not.toEqual(expect.arrayContaining(["Ring 2"]))
    expect(data.equipment).toHaveLength(MOCK_DATA.equipment.length - 2)
  })

  it("hides professions and factions by name, in any case, from a list or typed with commas", () => {
    const data = visibleData(
      MOCK_DATA,
      config({ professions_hide: ["cooking"], reputations_hide: "Gadgetzan, darnassus" })
    )
    expect(data.professions.map((p) => p.name)).toEqual(["Tailoring", "Engineering"])
    expect(data.reputations.map((r) => r.name)).not.toEqual(expect.arrayContaining(["Gadgetzan", "Darnassus"]))
    expect(data.reputations).toHaveLength(MOCK_DATA.reputations.length - 2)
  })
})

describe("calculateHeight with the options", () => {
  const plugin = PluginManager.getInstance().get("wow_forever")!
  const height = (options: Record<string, unknown>, sections: string[]) =>
    plugin.calculateHeight({ ...config(options, sections), style: "default" } as never, MOCK_DATA as never, "half")

  it("loses a row of tiles when a row's worth of journey numbers is off", () => {
    const off = Object.fromEntries(
      ["killing_blows", "flight_paths", "hearthstones", "duels_won"].map((k) => [`journey_show_${k}`, false])
    )
    expect(height({}, ["journey"]) - height(off, ["journey"])).toBe(48 + 8)
  })

  it("leaves the section out when every number in it is off", () => {
    const off = Object.fromEntries(MOCK_DATA.journey.map((s) => [`journey_show_${s.key}`, false]))
    expect(height(off, ["journey"])).toBe(0)
  })
})
