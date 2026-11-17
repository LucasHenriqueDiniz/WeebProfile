import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../../manager"
import type { SteamData } from "../types"

// The statistics section had its labels typed in Portuguese ("Horas totais", "Últimas 2
// semanas", "Destaque recente") next to English titles, and floored 51 minutes to "0h".
const plugin = PluginManager.getInstance().get("steam")!
let mock: SteamData

beforeAll(async () => {
  mock = (await plugin.fetchData({ ...plugin.config, sections: ["statistics"] }, true, undefined, true)) as never
})

function render(data: SteamData): string {
  const config = { ...plugin.config, enabled: true, sections: ["statistics"], style: "default", size: "half" }
  return renderToStaticMarkup(<>{plugin.render(config as never, data as never)}</>)
}

describe("steam statistics", () => {
  it("draws its labels in English", () => {
    const html = render(mock)
    for (const portuguese of ["jogos", "Horas", "Últimas", "semanas", "Jogos", "Destaque", "Tempo total"]) {
      expect(html).not.toContain(portuguese)
    }
    expect(html).toContain("Total playtime")
    expect(html).toContain("Last 2 weeks")
  })

  it("shows the minutes of a fortnight under an hour", () => {
    const html = render({ ...mock, statistics: { ...mock.statistics, recentPlaytime: 51 } })
    expect(html).toContain(">51m<")
    expect(html).not.toContain(">0h<")
  })
})
