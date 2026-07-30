import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { Websites } from "./Websites"
import type { WebsitesConfig, WebsitesData } from "../types"

interface RenderWebsitesProps {
  config: WebsitesConfig
  data: WebsitesData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/**
 * Renders the Websites plugin
 */
export function RenderWebsites({
  config,
  data,
  style = "default",
  size = "half",
}: RenderWebsitesProps): React.ReactElement {
  if (!config.enabled || !data || !config.sections || config.sections.length === 0) {
    return <></>
  }

  // As opções chegam em nonEssential ou já achatadas na raiz do config
  // (o react-renderer espalha sectionConfigs no nível raiz antes de renderizar).
  const sectionConfig = {
    ...(config.nonEssential || {}),
    ...Object.keys(config).reduce(
      (acc, key) => {
        if (key.startsWith("websites_")) {
          acc[key] = (config as Record<string, any>)[key]
        }
        return acc
      },
      {} as Record<string, any>
    ),
  }

  const renderedSections = config.sections.map((section) => {
    switch (section) {
      case "websites":
        return <Websites key={section} data={data} config={sectionConfig} style={style} size={size} />
      default:
        return (
          <div key={section} className="text-muted">
            Section &quot;{section}&quot; not yet implemented
          </div>
        )
    }
  })

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<>{renderedSections}</>}
      terminalComponent={<>{renderedSections}</>}
      wrapTerminalBody={true}
    />
  )
}
