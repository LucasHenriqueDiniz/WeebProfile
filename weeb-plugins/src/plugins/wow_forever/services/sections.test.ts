import { describe, expect, it } from "vitest"
import {
  mapAchievements,
  mapCollection,
  mapDungeons,
  mapJourney,
  mapProfessions,
  mapReputations,
  mapTalents,
  talentPoints,
} from "./sections"

/**
 * The inputs are cut from the live responses for a level 31 character on 19/11/2026
 * (Pequeno Ibuprofeno, US), keeping their shape.
 */

const STATISTICS = {
  categories: [
    {
      name: "Dungeons & Raids",
      statistics: [{ id: 932, name: "Total 5-player dungeons entered", quantity: 8 }],
      sub_categories: [
        {
          name: "Boss Kills",
          statistics: [
            { id: 1, name: "Bazzalan kills (Ragefire Chasm)", quantity: 1 },
            { id: 2, name: "Edwin VanCleef Kills (Deadmines)", quantity: 2 },
            { id: 3, name: "Archmage Arugal kills (Shadowfang Keep)", quantity: 1 },
            { id: 4, name: "Onyxia kills (Onyxia's Lair)", quantity: 0 },
          ],
        },
      ],
    },
    { name: "Kills", statistics: [{ id: 1197, name: "Total kills", quantity: 3415 }] },
    { name: "Deaths", statistics: [{ id: 60, name: "Total deaths", quantity: 43 }] },
    { name: "Quests", statistics: [{ id: 98, name: "Quests completed", quantity: 342 }] },
  ],
}

describe("mapJourney", () => {
  it("keeps the journey's order and leaves out what the character has no number for", () => {
    expect(mapJourney(STATISTICS)).toEqual([
      { label: "Kills", value: 3415 },
      { label: "Deaths", value: 43 },
      { label: "Quests", value: 342 },
      { label: "Dungeons", value: 8 },
    ])
  })
})

describe("mapDungeons", () => {
  it("reads the boss and the dungeon from both spellings, most kills first, none of the zeros", () => {
    expect(mapDungeons(STATISTICS)).toEqual([
      { boss: "Edwin VanCleef", dungeon: "Deadmines", kills: 2 },
      { boss: "Archmage Arugal", dungeon: "Shadowfang Keep", kills: 1 },
      { boss: "Bazzalan", dungeon: "Ragefire Chasm", kills: 1 },
    ])
  })
})

describe("mapProfessions", () => {
  it("lists the primary professions, then the secondary ones", () => {
    const rows = mapProfessions({
      primaries: [
        {
          profession: { name: "Tailoring", id: 197 },
          tiers: [{ tier: { name: "Tailoring" }, skill_points: 81, max_skill_points: 150 }],
        },
        { profession: { name: "Engineering", id: 202 }, tiers: [{ skill_points: 150, max_skill_points: 150 }] },
      ],
      secondaries: [{ profession: { name: "Cooking", id: 185 }, tiers: [{ skill_points: 1, max_skill_points: 75 }] }],
    })
    expect(rows.map((r) => [r.id, r.name, r.label])).toEqual([
      [197, "Tailoring", "81 / 150"],
      [202, "Engineering", "150 / 150"],
      [185, "Cooking", "1 / 75"],
    ])
  })
})

describe("mapReputations", () => {
  it("puts the highest standing first and fills Exalted's bar", () => {
    const rows = mapReputations({
      reputations: [
        { faction: { name: "Gadgetzan" }, standing: { value: 600, max: 3000, tier: 3, name: "Neutral" } },
        { faction: { name: "Ironforge" }, standing: { value: 1958, max: 12000, tier: 5, name: "Honored" } },
        { faction: { name: "Stormwind" }, standing: { value: 9005, max: 12000, tier: 5, name: "Honored" } },
        { faction: { name: "Darnassus" }, standing: { value: 0, max: 0, tier: 7, name: "Exalted" } },
      ],
    })
    expect(rows.map((r) => [r.name, r.label, r.value / r.max])).toEqual([
      ["Darnassus", "Exalted", 1],
      ["Stormwind", "Honored", 9005 / 12000],
      ["Ironforge", "Honored", 1958 / 12000],
      ["Gadgetzan", "Neutral", 600 / 3000],
    ])
  })
})

describe("mapTalents", () => {
  const response = {
    specialization_groups: [
      { is_active: false, specializations: [{ specialization: { id: 56, name: "Holy" }, spent_points: 10 }] },
      { is_active: true, specializations: [{ specialization: { id: 613, name: "Discipline" }, spent_points: 22 }] },
    ],
  }
  const priest = {
    specializations: [
      { id: 613, name: "Discipline" },
      { id: 56, name: "Holy" },
      { id: 78, name: "Shadow Magic" },
    ],
  }

  it("shows every tree of the class with the active group's points, out of the level's points", () => {
    expect(mapTalents(response, priest, 31).map((r) => [r.name, r.value, r.max])).toEqual([
      ["Discipline", 22, 22],
      ["Holy", 0, 22],
      ["Shadow Magic", 0, 22],
    ])
  })

  it("without the class, shows the trees the group spent points in", () => {
    expect(mapTalents(response, null, 31).map((r) => r.name)).toEqual(["Discipline"])
  })

  it("counts one point a level from 10, and 51 at 60", () => {
    expect([talentPoints(9), talentPoints(10), talentPoints(31), talentPoints(60)]).toEqual([0, 1, 22, 51])
  })
})

describe("mapAchievements", () => {
  it("lists the completed ones, the latest first", () => {
    const rows = mapAchievements({
      achievements: [
        { achievement: { name: "Novice Priest", id: 62000 }, completed_timestamp: 1794513360000 },
        { achievement: { name: "Journeyman Engineer", id: 62021 }, completed_timestamp: 1794944400000 },
        { achievement: { name: "In progress", id: 1 }, criteria: { is_completed: false } },
      ],
    })
    expect(rows.map((r) => r.name)).toEqual(["Journeyman Engineer", "Novice Priest"])
  })
})

describe("mapCollection", () => {
  it("lists each name once, and takes a missing list as none", () => {
    expect(
      mapCollection(
        { mounts: [{ mount: { name: "Cerulean Prideclaw" } }] },
        {
          pets: [
            { species: { name: "Zergling" } },
            { species: { name: "Zergling" } },
            { species: { name: "Panda Cub" } },
          ],
        },
        null
      )
    ).toEqual({ mounts: ["Cerulean Prideclaw"], pets: ["Zergling", "Panda Cub"], toys: [] })
  })
})
