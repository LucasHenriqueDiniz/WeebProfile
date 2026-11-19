import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { clearTokenCache } from "./battlenet"
import { parseCharacterRef } from "./character-ref"
import { fetchWowForeverData, mapEquipment, mapStats } from "./fetchData"

const CREDENTIALS = { clientid: "app-client", clientsecret: "app-secret" }

/** 1x1 PNG, so the render passes the magic-byte check. */
const PNG = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
])

const PROFILE = {
  name: "Liora",
  surname: "Brightwater",
  level: 60,
  race: { name: "Human" },
  character_class: { name: "Paladin" },
  faction: { type: "ALLIANCE", name: "Alliance" },
  guild: { name: "Ashen Vanguard" },
  ruleset: { name: "Normal" },
  average_item_level: 63,
}

type Route = (url: URL, init?: RequestInit) => Response | undefined

/** A fake Battle.net: the token endpoint, then whatever `routes` answer, 404 for the rest. */
function stubBattlenet(routes: Record<string, unknown>, extra?: Route) {
  const calls: Array<{ url: string; init?: RequestInit }> = []
  const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url)
    calls.push({ url: url.href, init })
    const custom = extra?.(url, init)
    if (custom) return custom
    if (url.href === "https://oauth.battle.net/token") {
      return Response.json({ access_token: "token-1", token_type: "bearer", expires_in: 86399 })
    }
    if (url.hostname === "render.worldofwarcraft.com") {
      return new Response(PNG, { headers: { "content-type": "image/png" } })
    }
    const route = url.pathname.replace(/^\/profile\/wow\/character\/[^/]+/, "") || "/"
    if (route in routes) return Response.json(routes[route])
    return new Response(null, { status: 404 })
  })
  vi.stubGlobal("fetch", fetchMock)
  return calls
}

beforeEach(() => clearTokenCache())
afterEach(() => vi.unstubAllGlobals())

describe("parseCharacterRef", () => {
  it.each([
    ["Liora Brightwater", "eu", { region: "eu", slug: "liora-brightwater" }],
    ["  liora-brightwater ", "US", { region: "us", slug: "liora-brightwater" }],
    ["Pröudmoore Önd", "kr", { region: "kr", slug: "pröudmoore-önd" }],
    [
      "https://worldofwarcraft.blizzard.com/en-gb/forever/eu/armory/character/judgement-judy",
      "us",
      { region: "eu", slug: "judgement-judy" },
    ],
    [
      "worldofwarcraft.blizzard.com/pt-br/forever/us/armory/character/p%C3%B6rt-kai/achievements",
      undefined,
      { region: "us", slug: "pört-kai" },
    ],
  ])("reads %j in %s", (character, region, expected) => {
    expect(parseCharacterRef(character, region)).toEqual(expected)
  })

  it.each([
    ["", "us", /required/],
    ["Liora", "us", /name and the surname/],
    ["Liora Bright Water", "us", /name and the surname/],
    ["Liora Brightwater", "cn", /region must be one of/],
    ["Liora Brightwater", undefined, /region must be one of/],
  ])("refuses %j in %s", (character, region, message) => {
    expect(() => parseCharacterRef(character, region)).toThrow(message)
  })
})

describe("mapEquipment", () => {
  it("drops the shirt, the tabard and the ammo, and keeps the slot order", () => {
    const items = mapEquipment({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Lionheart Helm",
          quality: { type: "EPIC" },
          level: { value: 63 },
        },
        { slot: { type: "SHIRT", name: "Shirt" }, name: "White Linen Shirt", quality: { type: "COMMON" } },
        { slot: { type: "TABARD", name: "Tabard" }, name: "Tabard of Stormwind", quality: { type: "COMMON" } },
        { slot: { type: "AMMO", name: "Ammo" }, name: "Jagged Arrow", quality: { type: "COMMON" } },
        { slot: { type: "MAIN_HAND", name: "Main Hand" }, name: "Arcanite Reaper", quality: { type: "EPIC" } },
      ],
    })
    expect(items).toEqual([
      { slot: "Head", name: "Lionheart Helm", quality: "EPIC", itemLevel: 63 },
      { slot: "Main Hand", name: "Arcanite Reaper", quality: "EPIC", itemLevel: null },
    ])
  })
})

describe("mapStats", () => {
  it("names the power after its type and leaves out what the API did not send", () => {
    expect(
      mapStats({
        health: 3200,
        power: 100,
        power_type: { name: "Rage" },
        strength: { effective: 210 },
        agility: { effective: 90 },
        stamina: { effective: 180 },
        intellect: { effective: 30 },
        armor: { effective: 4100 },
      }).map((s) => s.label)
    ).toEqual(["Health", "Rage", "Strength", "Agility", "Stamina", "Intellect", "Armor"])
  })
})

describe("fetchWowForeverData", () => {
  const config = (sections: string[], extra: Record<string, unknown> = {}) =>
    ({ enabled: true, sections, character: "Liora Brightwater", region: "eu", ...extra }) as never

  it("reads the realmless routes of the Forever namespace with the application's token", async () => {
    const calls = stubBattlenet({
      "/": PROFILE,
      "/pvp-summary": { honorable_kills: 1284 },
      "/character-media": {
        assets: [
          { key: "avatar", value: "https://render.worldofwarcraft.com/forever-eu/character/1/1-avatar.jpg" },
          { key: "main-raw", value: "https://render.worldofwarcraft.com/forever-eu/character/1/1-main-raw.png" },
        ],
      },
    })

    const data = await fetchWowForeverData(config(["character"]), false, CREDENTIALS)

    const token = calls.find((c) => c.url === "https://oauth.battle.net/token")!
    expect(new Headers(token.init?.headers).get("authorization")).toBe(`Basic ${btoa("app-client:app-secret")}`)
    const profile = new URL(calls.find((c) => c.url.includes("api.blizzard.com"))!.url)
    expect(profile.origin).toBe("https://eu.api.blizzard.com")
    expect(profile.pathname).toBe("/profile/wow/character/liora-brightwater")
    expect(profile.searchParams.get("namespace")).toBe("profile-forever-eu")
    expect(data.character).toMatchObject({
      name: "Liora",
      surname: "Brightwater",
      guild: "Ashen Vanguard",
      honorableKills: 1284,
    })
    expect(data.image?.kind).toBe("render")
    expect(data.image?.src.startsWith("data:image/png;base64,")).toBe(true)
    expect(calls.some((c) => c.url.endsWith("-main-raw.png"))).toBe(true)
  })

  it("asks for the token once across cards", async () => {
    const calls = stubBattlenet({ "/": PROFILE })
    await fetchWowForeverData(config(["character"], { character_image: "none" }), false, CREDENTIALS)
    await fetchWowForeverData(config(["character"], { character_image: "none" }), false, CREDENTIALS)
    expect(calls.filter((c) => c.url === "https://oauth.battle.net/token")).toHaveLength(1)
  })

  it("draws the card without a picture while Blizzard has not rendered the character", async () => {
    stubBattlenet({ "/": PROFILE })
    const data = await fetchWowForeverData(config(["character"]), false, CREDENTIALS)
    expect(data.image).toBeNull()
    expect(data.character.honorableKills).toBeNull()
  })

  it("explains a character the API does not serve", async () => {
    stubBattlenet({})
    await expect(fetchWowForeverData(config(["character"]), false, CREDENTIALS)).rejects.toThrow(
      /"liora-brightwater" was not found in EU.*level 10/
    )
  })

  it("fails without the application's client, and never prints the credentials", async () => {
    stubBattlenet({ "/": PROFILE })
    await expect(fetchWowForeverData(config(["character"]), false, {})).rejects.toThrow(/no Battle.net client/)

    stubBattlenet({}, (url) => (url.hostname === "oauth.battle.net" ? new Response("{}", { status: 401 }) : undefined))
    const error = await fetchWowForeverData(config(["character"]), false, CREDENTIALS).catch((e: Error) => e)
    expect((error as Error).message).toMatch(/refused the application's credentials \(HTTP 401\)/)
    expect((error as Error).message).not.toMatch(/app-client|app-secret/)
  })

  it("fetches only what the enabled sections draw", async () => {
    const calls = stubBattlenet({ "/": PROFILE, "/equipment": { equipped_items: [] } })
    await fetchWowForeverData(config(["equipment"]), false, CREDENTIALS)
    const routes = calls
      .filter((c) => c.url.includes("api.blizzard.com"))
      .map((c) => new URL(c.url).pathname.replace("/profile/wow/character/liora-brightwater", "") || "/")
    expect(routes.sort()).toEqual(["/", "/equipment"])
  })
})
