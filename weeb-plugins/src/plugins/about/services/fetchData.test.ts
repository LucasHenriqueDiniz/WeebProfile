import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { AboutConfig } from "../types"
import { fetchAboutData, githubAvatarUrl } from "./fetchData"
import { MOCK_LINKS, MOCK_NEOFETCH } from "./mock-data"

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4])

function config(options: Record<string, unknown>, sections = ["neofetch", "links"]): AboutConfig {
  return { enabled: true, sections, ...options } as AboutConfig
}

const fields = [
  { label: "Location", value: "Brazil" },
  { label: "Stack", value: "TypeScript · React · Cloudflare" },
]

describe("fetchAboutData", () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(
      async () => new Response(PNG, { status: 200, headers: { "content-type": "image/png" } })
    )
    vi.stubGlobal("fetch", fetchMock)
    vi.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("embeds the picture and keeps what the user typed, in order", async () => {
    const data = await fetchAboutData(
      config({
        neofetch_title: "  lucas@brasil ",
        neofetch_fields: [...fields, { label: "", value: "" }, null],
        neofetch_image: "https://avatars.example.com/me.png",
        links_items: [{ url: "lucashdo.com" }, { url: "someone@example.com" }],
      })
    )

    expect(data.neofetch.title).toBe("lucas@brasil")
    expect(data.neofetch.fields).toEqual(fields)
    expect(data.neofetch.image).toBe(`data:image/png;base64,${Buffer.from(PNG).toString("base64")}`)
    expect(data.links.map((link) => link.href)).toEqual(["https://lucashdo.com/", "mailto:someone@example.com"])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  // Production draws exactly what was typed: a sample there would publish someone
  // else's details on the user's profile.
  it("never falls back to the mock when generating", async () => {
    const data = await fetchAboutData(config({}))
    expect(data).toEqual({ neofetch: { title: "", fields: [], image: null }, links: [] })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("leaves the picture out, not the card, when it cannot be embedded", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 404 }))
    const data = await fetchAboutData(
      config({ neofetch_title: "me@home", neofetch_image: "https://avatars.example.com/missing.png" })
    )
    expect(data.neofetch).toEqual({ title: "me@home", fields: [], image: null })
  })

  // The URL is the user's: the Worker must not be pointed at its own network.
  it.each(["http://avatars.example.com/me.png", "https://127.0.0.1/me.png", "https://localhost/me.png", "me.png"])(
    "never fetches the picture %j",
    async (image) => {
      const data = await fetchAboutData(config({ neofetch_title: "me@home", neofetch_image: image }))
      expect(data.neofetch.image).toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    }
  )

  it("does not fetch the picture for a card without the intro", async () => {
    await fetchAboutData(config({ neofetch_image: "https://avatars.example.com/me.png" }, ["links"]))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("keeps at most 10 lines", async () => {
    const many = Array.from({ length: 14 }, (_, i) => ({ label: `L${i}`, value: `v${i}` }))
    const data = await fetchAboutData(config({ neofetch_fields: many }))
    expect(data.neofetch.fields.map((field) => field.label)).toEqual(many.slice(0, 10).map((field) => field.label))
  })

  describe("the picture", () => {
    const uploaded = `data:image/png;base64,${Buffer.from(PNG).toString("base64")}`

    // The wizard keeps an uploaded image in the card: a picture with no address of its
    // own, like the pixel-art avatar drawn for the profile, needs nothing to fetch.
    it("embeds an uploaded image as it is, with no request", async () => {
      const data = await fetchAboutData(config({ neofetch_picture: "custom", neofetch_image: uploaded }))
      expect(data.neofetch.image).toBe(uploaded)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("leaves out an uploaded SVG, which could carry script", async () => {
      const svg = `data:image/svg+xml;base64,${Buffer.from("<svg/>").toString("base64")}`
      const data = await fetchAboutData(config({ neofetch_image: svg }))
      expect(data.neofetch.image).toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("downloads the GitHub avatar of the username given", async () => {
      const data = await fetchAboutData(
        config({ neofetch_picture: "github", neofetch_github_user: "@LucasHenriqueDiniz", neofetch_image: uploaded })
      )
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(String(fetchMock.mock.calls[0]![0])).toBe("https://github.com/LucasHenriqueDiniz.png?size=348")
      expect(data.neofetch.image).toBe(uploaded) // the fetch mock answers the same PNG
    })

    it("draws no picture for none, even with an image set", async () => {
      const data = await fetchAboutData(config({ neofetch_picture: "none", neofetch_image: uploaded }))
      expect(data.neofetch.image).toBeNull()
    })

    it("draws no picture for the GitHub avatar without a valid username", async () => {
      const data = await fetchAboutData(config({ neofetch_picture: "github", neofetch_github_user: "../../evil" }))
      expect(data.neofetch.image).toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("shows the avatar's address in the preview, without fetching it", async () => {
      const data = await fetchAboutData(
        config({ neofetch_picture: "github", neofetch_github_user: "octocat" }),
        true,
        true
      )
      expect(data.neofetch.image).toBe("https://github.com/octocat.png?size=348")
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe("in the wizard preview and the dev tools", () => {
    it("draws the mock while nothing is typed, without touching the network", async () => {
      expect(await fetchAboutData(config({}), true, true)).toEqual({ neofetch: MOCK_NEOFETCH, links: MOCK_LINKS })
      expect(await fetchAboutData(config({}), true, false)).toEqual({ neofetch: MOCK_NEOFETCH, links: MOCK_LINKS })
      expect(fetchMock).not.toHaveBeenCalled()
    })

    // The wizard's live preview hands fetchData the store's config, where each section
    // keeps its options under sectionConfigs. Read only at the root, the preview kept
    // showing the mock cat while the user typed.
    it("draws what the user is typing, read from sectionConfigs, with the picture straight from its URL", async () => {
      const data = await fetchAboutData(
        config({
          sectionConfigs: {
            neofetch: {
              neofetch_title: "lucas@brasil",
              neofetch_fields: fields,
              neofetch_image: "https://a.example/me.png",
            },
            links: { links_items: [{ url: "https://www.linkedin.com/in/someone/" }] },
          },
        }),
        true,
        true
      )

      expect(data.neofetch).toEqual({ title: "lucas@brasil", fields, image: "https://a.example/me.png" })
      expect(data.links).toEqual([
        { href: "https://www.linkedin.com/in/someone/", label: "LinkedIn", icon: "linkedin" },
      ])
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})

describe("githubAvatarUrl", () => {
  it.each([
    ["octocat", "https://github.com/octocat.png?size=348"],
    [" @Lucas-Diniz ", "https://github.com/Lucas-Diniz.png?size=348"],
  ])("%j has an avatar", (login, url) => {
    expect(githubAvatarUrl(login)).toBe(url)
  })

  it.each(["", "a/b", "-start", "end-", "dou--ble", "x".repeat(40), "https://github.com/x", 7])(
    "%j is not a GitHub login",
    (login) => {
      expect(githubAvatarUrl(login)).toBeNull()
    }
  )
})
