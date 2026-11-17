import { beforeAll, describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { PluginManager } from "../manager"
import { PLUGINS_METADATA } from "../metadata"
import type { GithubData } from "./types"

/**
 * The title options the dashboard shows for a section must change that section.
 *
 * top_repositories declared `stargazers_hide_title` and `stargazers_title`, the keys of the
 * stargazers section, while its component reads `top_repositories_*`: "Hide title" did
 * nothing to it, and hid the title of a stargazers section on the same card instead.
 * `validate-config-options` did not catch it, because some component of the plugin reads
 * each key.
 */

type Option = { key: string; type: string }
const plugin = PluginManager.getInstance().get("github")!
const sections = (PLUGINS_METADATA.github as { sections: Array<{ id: string; configOptions: Option[] }> }).sections
let mock: GithubData

beforeAll(async () => {
  mock = (await plugin.fetchData(
    { ...plugin.config, sections: sections.map((s) => s.id) },
    true,
    undefined,
    true
  )) as never
})

const draw = (section: string, options: Record<string, unknown>) =>
  renderToStaticMarkup(
    plugin.render(
      { ...plugin.config, enabled: true, sections: [section], style: "default", size: "half", ...options } as never,
      mock as never
    )
  )

const withOption = (suffix: string) =>
  sections.flatMap((section) =>
    section.configOptions.filter((o) => o.key.endsWith(suffix)).map((o) => [section.id, o.key] as const)
  )

describe("github section title options", () => {
  it.each(withOption("_hide_title"))("%s: %s hides the title", (section, key) => {
    expect(draw(section, { [key]: true })).not.toEqual(draw(section, {}))
  })

  it.each(withOption("_title").filter(([, key]) => !key.endsWith("_hide_title")))(
    "%s: %s is the title drawn",
    (section, key) => {
      expect(draw(section, { [key]: "Picked by the user" })).toContain("Picked by the user")
    }
  )
})
