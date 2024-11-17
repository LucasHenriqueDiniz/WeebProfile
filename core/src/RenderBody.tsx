import React from "react"
import { renderToString } from "react-dom/server"
import { toBoolean } from "source/helpers/boolean"
import logger from "source/helpers/logger"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import fetchPluginsData from "source/plugins/@utils/fetchPluginsData"
import SvgContainer from "templates/Main/SvgContainer"
import calculateElementHeight from "../utils/calculateElementHeight"
import LoadCss from "./loadCss"
import RenderActivePlugins from "./RenderActivePlugins"
import { buildTailwind } from "./setup/setupTailwind"

async function RenderBody(): Promise<string> {
  logger({ message: "Rendering body...", level: "info", __filename, header: true })
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const isDev = toBoolean(env.dev)

  if (isDev) {
    logger({ message: "Dev mode is enabled", level: "warn", __filename })
  }

  // Gerar Tailwind CSS antes de renderizar
  await buildTailwind()

  const data = await fetchPluginsData(isDev)
  const activePlugins = RenderActivePlugins({ pluginsData: data })
  const svgHeight = await calculateElementHeight(activePlugins, env)

  if (!svgHeight || svgHeight <= 0) {
    throw new Error("Invalid SVG height")
  }

  const htmlString = renderToString(
    <SvgContainer size={env.size ?? "full"} height={svgHeight} style={env.style} defs={await LoadCss(env)}>
      {activePlugins}
    </SvgContainer>
  )

  return htmlString
}

export default RenderBody
