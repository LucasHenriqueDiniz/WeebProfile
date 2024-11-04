import logger from "source/helpers/logger"
import React from "react"
import { renderToString } from "react-dom/server"
import { PluginsConfig } from "source/plugins/@types/plugins"
import fetchPluginsData from "source/plugins/@utils/fetchPluginsData"
import ForeignObject from "templates/Main/ForeignObject"
import SvgContainer from "templates/Main/SvgContainer"
import calculateElementHeight from "../utils/calculateElementHeight"
import LoadCss from "./loadCss"
import RenderActivePlugins from "./RenderActivePlugins"
import { toBoolean } from "source/helpers/boolean"

async function RenderBody({ env }: { env: PluginsConfig }): Promise<string> {
  logger({ message: "Starting...", level: "info", __filename, header: true })
  // check if dev mode is enabled - default is false
  const isDev = toBoolean(env.dev) || false
  if (isDev) {
    logger({ message: "Dev mode is enabled", level: "warn", __filename })
  }

  const data = await fetchPluginsData(isDev)
  const activePlugins = RenderActivePlugins({ pluginsData: data })
  const svgHeight = await calculateElementHeight(activePlugins, env)

  if (!svgHeight || svgHeight <= 0) {
    throw new Error("Invalid SVG height")
  }

  const htmlString = renderToString(
    <SvgContainer size={env.size ?? "full"} height={svgHeight} style={env.style}>
      <>
        <defs>{await LoadCss(env)}</defs>
        <ForeignObject>
          <>{activePlugins}</>
        </ForeignObject>
      </>
    </SvgContainer>
  )

  return htmlString
}

export default RenderBody
