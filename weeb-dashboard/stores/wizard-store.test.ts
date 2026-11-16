import { beforeEach, describe, expect, it } from "vitest"
import { useWizardStore } from "./wizard-store"
import { PREVIEW_PLUGINS, type PreviewPluginId, type PreviewRequest } from "@/lib/preview/public-preview"

const previews: PreviewRequest[] = (Object.keys(PREVIEW_PLUGINS) as PreviewPluginId[]).map((plugin) => ({
  plugin,
  style: "terminal",
  size: "full",
  theme: "default",
  username: PREVIEW_PLUGINS[plugin].field === "username" ? "visitor" : "76561197960287930",
}))

const plugin = (name: string) => useWizardStore.getState().plugins[name] as unknown as Record<string, unknown>

beforeEach(() => {
  useWizardStore.getState().reset()
})

describe("loadFromPreview", () => {
  // loadFromTemplate drops whatever was typed into a template, the username included,
  // so the card a visitor previewed reached the wizard with an empty field.
  it.each(previews)("opens the wizard on the $plugin card the visitor previewed", (request) => {
    useWizardStore.getState().loadFromPreview(request)
    const state = useWizardStore.getState()

    expect(state.pluginsOrder).toEqual([request.plugin])
    expect(state.style).toBe("terminal")
    expect(plugin(request.plugin)).toMatchObject({
      enabled: true,
      sections: [...PREVIEW_PLUGINS[request.plugin].sections],
    })
    // A Steam id belongs in the profile, never in the plugin config.
    expect(plugin(request.plugin).username).toBe(
      PREVIEW_PLUGINS[request.plugin].field === "username" ? "visitor" : undefined
    )
  })
})

describe("loadFromTemplate", () => {
  it("still leaves an author's username behind", () => {
    useWizardStore.getState().loadFromTemplate({
      pluginsOrder: ["github"],
      pluginsConfig: { github: { enabled: true, sections: ["profile"], username: "author" } },
    })

    expect(plugin("github")).toMatchObject({ enabled: true, sections: ["profile"] })
    expect(plugin("github").username).toBeUndefined()
  })
})
