import { renderToString } from "react-dom/server"
import PluginsConfig from "source/plugins/@types/PluginsConfig"
import ForeignObject from "templates/Main/ForeignObject"
import SvgContainer from "templates/Main/SvgContainer"
import calculateElementHeight from "../utils/calculateElementHeight"
import LoadCss from "./loadCss"
import RenderActivePlugins from "./RenderActivePlugins"
import React from "react"
import fetchPluginsData from "source/plugins/@utils/fetchPluginsData"
import logger from "core/utils/logger"

async function RenderBody({ env }: { env: PluginsConfig }): Promise<string> {
  logger({ message: "Starting...", level: "info", __filename, header: true })

  const data = await fetchPluginsData()
  const activePlugins = await RenderActivePlugins(env, data)
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
